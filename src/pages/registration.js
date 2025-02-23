import React from "react";
import "../css/registration.css";

function Registration() {
  return (
    <main>
      <h1>Register</h1>
      <form>
        <label>Name:</label>
        <input type="text" required />
        <label>Email:</label>
        <input type="email" required />
        <label>Password:</label>
        <input type="password" required />
        <button type="submit">Register</button>
      </form>
    </main>
  );
}

export default Registration;
