import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data && response.data.token && response.data.user) {
        auth.login(response.data.user, response.data.token);
        navigate('/'); // Redirect to home page after successful login
      } else {
        setError('Login failed: Invalid response from server.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title text-center h3 mb-4 fw-bold">Login</h2>
          {error && <p className="alert alert-danger text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3"> {/* Changed mb-6 to mb-3 for Bootstrap consistency */}
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control" // Removed mb-3 from here as parent div has it
                required
              />
            </div>
            <div className="d-grid"> {/* Use d-grid for full-width button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg" // Added btn-lg for a larger button
              >
                Login
              </button>
            </div>
            <p className="text-center mt-3"> {/* Bootstrap margin utility */}
              Don't have an account? <Link to="/register">Register here</Link> {/* Used Link component */}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
