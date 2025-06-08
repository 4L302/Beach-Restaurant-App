import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import apiClient from '../services/api';
// import { useAuth } from '../contexts/AuthContext'; // Not using auth.login() on register for now

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  // const auth = useAuth(); // Get auth context if planning to log in user directly

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      setSuccess(response.data.message + ' Redirecting to login...');
      // Optionally, you could log the user in directly if the backend returns token/user
      // auth.login(response.data.user, response.data.token);
      // navigate('/');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title text-center h3 mb-4 fw-bold">Register</h2>
          {error && <p className="alert alert-danger text-center">{error}</p>}
          {success && <p className="alert alert-success text-center">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>
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
            <div className="mb-3"> {/* Changed mb-6 to mb-3 */}
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Register
              </button>
            </div>
            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
