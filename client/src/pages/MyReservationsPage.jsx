import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

const MyReservationsPage = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user || !user.id || !token) {
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: user.id }
        };
        const response = await apiClient.get('/reservations', config);
        setReservations(response.data.sort((a, b) => new Date(b.reservation_date) - new Date(a.reservation_date)));
      } catch (err) {
        console.error('Error fetching user reservations:', err);
        if (err.response && err.response.status === 401) {
             setError('Your session has expired. Please log in again.');
             // Consider calling logout() here or redirecting to login
        } else {
            setError('Failed to load your reservations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, user, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
        <div className="container text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="lead mt-2">Loading your reservations...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container py-5">
            <div className="alert alert-danger text-center" role="alert">{error}</div>
        </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Ensure date is treated as UTC to avoid off-by-one day errors due to timezone conversion
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="container py-4 py-md-5">
      <h1 className="display-5 text-center my-4 fw-bold">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead text-muted mb-4">You have no reservations yet.</p>
          <Link
            to="/reservations"
            className="btn btn-primary btn-lg d-block mx-auto"
            style={{maxWidth: '300px'}}
          >
            Make a Reservation
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: '768px' }} className="mx-auto">
          {reservations.map(res => (
            <div key={res.id} className="card shadow-sm mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className={`mb-0 text-capitalize ${res.type === 'table' ? 'text-primary' : 'text-info'}`}>
                  {res.type} Reservation
                </h5>
                <span className="badge bg-secondary">ID: {res.id}</span>
              </div>
              <div className="card-body">
                <dl className="row mb-0"> {/* mb-0 to remove default dl margin if any */}
                  <dt className="col-sm-4">Date:</dt>
                  <dd className="col-sm-8">{formatDate(res.reservation_date)}</dd>

                  {res.type === 'table' && (
                    <>
                      <dt className="col-sm-4">Time:</dt>
                      <dd className="col-sm-8">{res.reservation_time}</dd>
                      <dt className="col-sm-4">Guests:</dt>
                      <dd className="col-sm-8">{res.num_people}</dd>
                    </>
                  )}
                  {res.type === 'sunbed' && (
                    <>
                      <dt className="col-sm-4">Type:</dt>
                      <dd className="col-sm-8 text-capitalize">{res.sunbed_type ? res.sunbed_type.replace('_', ' ') : 'N/A'}</dd>
                    </>
                  )}
                </dl>
                {/* TODO: Add Cancel button for upcoming reservations */}
                {/*
                <div className="mt-3 text-end">
                  <button className="btn btn-outline-danger btn-sm">Cancel Reservation</button>
                </div>
                */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
