import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      if (response.data?.token && response.data?.user) {
        auth.login(response.data.user, response.data.token);
        navigate('/');
      } else {
        setError('Login failed: Invalid response from server.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-between bg-light" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif" }}>
      {/* Background top banner */}
      <div
        className="w-100"
        style={{
          backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDzQpqpoNjAo56xka_W_fkxSWAQ2engl62Tdlz6ep4nL_bGuewRkFUG4UlkG255lhqKcEsPe4qGAzPfgQg8TFkAfWAxlHBN-8R0EpGTOgJ7V1bAuS_2R-YZokjH0X77X7rv00auw4Vg2qSZRxPHaOhWbctjUCKE8M_fm5P7K5l6Rnid3mF7LO9CVkovtbTATm9t4FgkrNjtmUq2YC5a5mFTZfXuuLft3C3VVV5vdbwFFOjiaisA8UhCgHLM8eDlpveMQ-Ul2oNM_SzV)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '250px',
          borderRadius: '0 0 20px 20px'
        }}
      ></div>

      {/* Login card */}
      <div className="d-flex justify-content-center align-items-start px-3 mt-n5">
        <div className="card shadow border-0 w-100" style={{ maxWidth: '460px', backgroundColor: '#f8fcfa', borderRadius: '20px' }}>
          <div className="card-body p-4">
            <h2 className="text-center mb-4 fw-bold text-dark" style={{ fontSize: '1.75rem' }}>Join the Beach Club</h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill px-4 py-3 border-0"
                  placeholder="Full Name"
                  style={{ backgroundColor: '#e7f3ed', color: '#0d1b14' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control rounded-pill px-4 py-3 border-0"
                  placeholder="Password"
                  style={{ backgroundColor: '#e7f3ed', color: '#0d1b14' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill"
                  style={{ backgroundColor: '#13eb7f', color: '#0d1b14' }}
                >
                  Sign In
                </button>
              </div>

              <p className="text-center mt-3 text-success text-decoration-underline">
                Already have an account? <Link to="/register" className="text-success">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer design image */}
      <div className="mt-4">
        <div
          className="w-100"
          style={{
            backgroundImage: 'url(/light.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '390 / 320'
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoginPage;
