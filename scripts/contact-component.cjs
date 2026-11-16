const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),tools=path.join(root,'tools/enquiry-review/node_modules');
const {build}=require(path.join(tools,'esbuild')),{JSDOM}=require(path.join(tools,'jsdom'));
const pause=()=>new Promise(r=>setTimeout(r,20));
async function wait(check){const until=Date.now()+2500;while(!check()&&Date.now()<until)await pause();assert(check(),'Contact did not settle');}
(async()=>{
 const bundle=await build({stdin:{contents:"import {createRoot} from 'react-dom/client';import Contact from './pages/contact.js';createRoot(document.getElementById('root')).render(<Contact deliveryEnabled={true}/>);",resolveDir:root,loader:'jsx'},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic',loader:{'.js':'jsx'},nodePaths:[tools],plugins:[{name:'fixtures',setup(b){
 b.onLoad({filter:/pages\/contact\.js$/},({path:p})=>({contents:fs.readFileSync(p,'utf8').split('export async function getServerSideProps')[0],loader:'jsx'}));
 b.onResolve({filter:/^react(?:-dom)?(?:\/.*)?$/},({path:p})=>({path:require.resolve(p,{paths:[tools]})}));
 b.onResolve({filter:/^next\/|^@\/styles\//},({path:p})=>({path:p,namespace:'fixture'}));
 b.onResolve({filter:/^@\/lib\//},({path:p})=>({path:path.join(root,p.slice(2))}));
 b.onLoad({filter:/.*/,namespace:'fixture'},({path:p})=>({loader:'jsx',contents:p==='next/link'?'export default function Link({children,...props}){return <a {...props}>{children}</a>}':p==='next/head'?'export default function Head(){return null}':'export default {}'}));
 }}]});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.invalid/contact',runScripts:'outside-only'}),w=dom.window,d=w.document,requests=[];w.AbortSignal=AbortSignal;
 w.fetch=(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}));
 try{
  w.eval(bundle.outputFiles[0].text);await wait(()=>d.querySelector('form'));
  const fill=async(name,value)=>{const input=d.querySelector('[name="'+name+'"]');Object.getOwnPropertyDescriptor(input.tagName==='TEXTAREA'?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new w.Event('input',{bubbles:true}));await pause();};
  for(const[name,value]of Object.entries({name:'Test Customer',email:'test@example.invalid',collection:'London',delivery:'Paris',description:'Two pallets\nKeep upright'}))await fill(name,value);
  await fill('collection','   ');d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await pause();assert.equal(requests.length,0);
  await fill('collection','London');d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>requests.length===1);const original=JSON.parse(requests[0].options.body);requests[0].reject(Error('synthetic lost response'));
  await wait(()=>d.querySelector('[role="status"]').textContent.includes('could not be confirmed'));assert(d.querySelector('fieldset').disabled);
  d.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await wait(()=>requests.length===2);assert.deepEqual(JSON.parse(requests[1].options.body),original);
  requests[1].resolve({ok:true,status:200,json:async()=>({state:'received',reference:'HAUL-'+'A'.repeat(32)})});await wait(()=>d.querySelector('[role="status"]').textContent.includes('HAUL-'));
  assert(d.querySelector('button[type="submit"]').disabled);assert(d.querySelector('textarea[readonly]').value.includes('Two pallets\nKeep upright'));assert.equal(w.localStorage.length,0);assert.equal(w.sessionStorage.length,0);
  console.log('PASS contact component: validation, lost-response lock, stable retry, real reference acknowledgement and no browser persistence');
 }finally{w.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
