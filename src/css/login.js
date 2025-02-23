import React from "react";
import "./css/login.css";

function Login() {
  return (
    <div className="login-page">
      <h1>Login to HaulSmart Euro</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
