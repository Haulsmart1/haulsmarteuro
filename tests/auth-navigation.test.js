import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Execute the real shared page and its submit handler with React's state/effect
// semantics retained across navigation. Auth and framework I/O stay synthetic.
function fixture(pathname, query = {}, observe) {
  const router = { pathname, query };
  const states = [], effects = [], requests = [];
  let cursor = 0, dirty = false, pending = [], tree;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => {
        const next = typeof value === "function" ? value(states[index]) : value;
        if (!Object.is(next, states[index])) { states[index] = next; dirty = true; }
      }];
    },
    useEffect(callback, deps) {
      const index = cursor++;
      if (!effects[index] || deps.some((value, i) => !Object.is(value, effects[index].deps[i]))) {
        pending.push(() => {
          effects[index]?.cleanup?.();
          effects[index] = { deps, cleanup: callback() };
        });
      }
    },
  };
  const element = (type, props) => ({ type, props });
  const stubs = {
    "next/head": { default: () => null },
    "next/link": { default: () => null },
    "next/router": { useRouter: () => router },
    react: hooks,
    "react/jsx-runtime": { jsx: element, jsxs: element, Fragment: "fragment" },
    "../lib/supabaseClient": { getSupabaseClient: () => ({ auth: {
      signInWithOtp: async (request) => { requests.push(request); return { error: null }; },
    } }) },
    "../lib/authReturn": { getAuthReturnUrl: (origin) => `${origin}/login` },
    "../lib/loginSession": { observeLoginSession: (auth, callbacks) => { observe?.(callbacks); return () => {}; } },
    "../styles/pages/auth.module.css": { default: {} },
  };
  const source = readFileSync(new URL("../pages/login.js", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    fileName: "login.jsx",
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = { exports: {}, window: { location: { origin: "https://example.invalid" } },
    require(name) { assert.ok(name in stubs, `Unexpected import ${name}`); return stubs[name]; } };
  vm.runInNewContext(compiled, context);
  function render() {
    for (let attempts = 0; attempts < 10; attempts++) {
      cursor = 0; dirty = false; pending = [];
      tree = context.exports.default();
      pending.forEach((effect) => effect());
      if (!dirty) return tree;
    }
    throw new Error("Render did not settle");
  }
  function find(node, predicate) {
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of [node.props?.children].flat(Infinity)) {
      const found = find(child, predicate); if (found) return found;
    }
  }
  render();
  return {
    requests,
    alert() { return find(tree, (node) => node.props?.role === "alert")?.props.children; },
    go(path, nextQuery = {}) { router.pathname = path; router.query = nextQuery; render(); },
    async submit() {
      find(tree, (node) => node.type === "input" && node.props.type === "email")
        .props.onChange({ target: { value: " synthetic@example.invalid " } });
      render();
      await find(tree, (node) => node.type === "form").props.onSubmit({ preventDefault() {} });
      render();
    },
  };
}

test("register to login navigation cannot keep account creation enabled", async () => {
  const page = fixture("/register");
  page.go("/login");
  await page.submit();
  assert.equal(page.requests[0].options.shouldCreateUser, false);
  assert.equal("data" in page.requests[0].options, false);
});

test("login to register navigation enables the requested registration flow", async () => {
  const page = fixture("/login");
  page.go("/register");
  await page.submit();
  assert.equal(page.requests[0].options.shouldCreateUser, true);
  assert.equal(page.requests[0].email, "synthetic@example.invalid");
});

test("removing register query mode returns the shared page to sign-in", async () => {
  const page = fixture("/login", { mode: "register" });
  page.go("/login");
  await page.submit();
  assert.equal(page.requests[0].options.shouldCreateUser, false);
});

test("initial login keeps account creation disabled", async () => {
  const page = fixture("/login");
  await page.submit();
  assert.equal(page.requests[0].options.shouldCreateUser, false);
});

test("invalid callback feedback explains how to obtain a new email link", () => {
  const page = fixture("/login", {}, ({ onError }) => onError("invalid_link"));
  assert.equal(page.alert(), "That sign-in link is invalid or has expired. Enter your email below to request a new link.");
});
