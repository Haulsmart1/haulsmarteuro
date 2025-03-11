import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Head from 'next/head';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const correctUsername = 'HaulSmartUser';  // Set a proper username
  const correctPassword = 'HaulSmart2025';  // Secure this later!

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect username or password. Try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>🔒 Secure Dashboard Login</h2>
          <p className="text-muted">Enter your credentials to proceed.</p>

          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary btn-block" onClick={handleLogin}>Login</button>
        </div>

        {/* Styling */}
        <style jsx>{`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url('/assets/images/index-bg.jpg') no-repeat center center/cover;
          }
          .login-box {
            background: rgba(0, 0, 0, 0.7);
            padding: 30px;
            border-radius: 10px;
            color: white;
            text-align: center;
            width: 350px;
          }
          .form-control {
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .btn-block {
            width: 100%;
            padding: 10px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>HaulSmart - Dashboard</title>
        <meta name="description" content="Manage live loads, backloads, and request quotes with intelligent pricing tools." />
      </Head>

      <div className="dashboard-container">
        <div className="sidebar">
          <h2>Dashboard</h2>
          <ul>
            <li><Link href="#live-loads">🚛 Live Loads</Link></li>
            <li><Link href="#backloads">📦 Backloads</Link></li>
            <li><Link href="#quotes">💰 Request Quotes</Link></li>
          </ul>
        </div>

        <div className="main-content">
          <h1 className="text-center mb-4">📊 HaulSmart Dashboard</h1>

          {/* Add your dashboard content here */}
        </div>
      </div>
    </>
  );
}
