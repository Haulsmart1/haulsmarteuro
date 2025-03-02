import React, { useState } from 'react';
import './css/styles.css';

const bgImage = `${process.env.PUBLIC_URL}/images/registration-bg.jpg`;

const RegistrationForm = () => {
  // State to manage form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate registration (replace with actual API call)
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Password:', password);

    alert('Registration successful! Welcome to HaulSmart.');

    // Reset the form
    setFullName('');
    setEmail('');
    setPassword('');
  };

  return (
    <form id="registration-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="regEmail">Email:</label>
        <input
          type="email"
          id="regEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="regPassword">Password:</label>
        <input
          type="password"
          id="regPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;