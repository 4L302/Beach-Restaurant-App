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
      return; // Should be handled by the Navigate component, but good for safety
    }

    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        // Ensure Authorization header is set for this request if not globally set or if it was cleared.
        // AuthContext's useEffect should handle this, but being explicit can be safer.
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: user.id }
        };
        const response = await apiClient.get('/reservations', config);
        setReservations(response.data.sort((a, b) => new Date(b.reservation_date) - new Date(a.reservation_date))); // Sort by date desc
      } catch (err) {
        console.error('Error fetching user reservations:', err);
        setError('Failed to load your reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, user, token]); // Depend on user and token to refetch if they change

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="text-center py-10">Loading your reservations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg mb-4">You have no reservations yet.</p>
          <Link
            to="/reservations"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Make a Reservation
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {reservations.map(res => (
            <div key={res.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h2 className="text-2xl font-semibold text-blue-600 capitalize">
                  {res.type} Reservation
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full
                  ${res.type === 'table' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  ID: {res.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
                <p><strong className="font-medium">Date:</strong> {formatDate(res.reservation_date)}</p>
                {res.type === 'table' && (
                  <>
                    <p><strong className="font-medium">Time:</strong> {res.reservation_time}</p>
                    <p><strong className="font-medium">Guests:</strong> {res.num_people}</p>
                  </>
                )}
                {res.type === 'sunbed' && (
                  <p><strong className="font-medium">Type:</strong> <span className="capitalize">{res.sunbed_type.replace('_', ' ')}</span></p>
                )}
              </div>
              {/* TODO: Add Cancel button for upcoming reservations in a future enhancement */}
              {/* <div className="mt-4 text-right">
                <button className="text-red-500 hover:text-red-700 font-medium">Cancel</button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
