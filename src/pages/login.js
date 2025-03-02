import React, { useState } from 'react';
import './css/styles.css'; // Import your CSS file

const bgImage = `${process.env.PUBLIC_URL}/images/login-bg.jpg`;

const LoginForm = () => {
  // State to manage form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login (replace with actual API call)
    console.log('Email:', email);
    console.log('Password:', password);

    alert('Login successful! Redirecting to your dashboard...');

    // Reset the form
    setEmail('');
    setPassword('');
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="loginEmail">Email:</label>
        <input
          type="email"
          id="loginEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="loginPassword">Password:</label>
        <input
          type="password"
          id="loginPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;