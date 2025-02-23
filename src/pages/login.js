import React from "react";
import "../css/login.css";

function Login() {
  return (
    <main>
      <h1>Login</h1>
      <form>
        <label>Email:</label>
        <input type="email" required />
        <label>Password:</label>
        <input type="password" required />
        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default Login;
