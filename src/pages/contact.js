import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Contact() {
    return (
      <div className="contact-form">
        <h1>Contact Us</h1>
        <form action="mailto:help@haul-smart.com" method="post" enctype="text/plain">
          <label>Name:</label>
          <input type="text" name="name" required />
          
          <label>Email:</label>
          <input type="email" name="email" required />
          
          <label>Message:</label>
          <textarea name="message" required></textarea>
          
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
  