import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

const SunbedReservationForm = () => {
  const { user } = useAuth();
  const [reservationDate, setReservationDate] = useState('');
  const [sunbedType, setSunbedType] = useState(''); // E.g., 'standard', 'vip'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sunbedTypes = [
    { value: 'standard', label: 'Standard Sunbed' },
    { value: 'double', label: 'Double Sunbed' },
    { value: 'gazebo', label: 'Gazebo' },
    { value: 'vip_lounger', label: 'VIP Lounger' },
  ];

  // Get today's date in YYYY-MM-DD format for min attribute of date input
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.id) {
      setError('You must be logged in to make a reservation.');
      return;
    }
    if (!reservationDate || !sunbedType) {
      setError('All fields are required.');
      return;
    }
    if (new Date(reservationDate) < new Date(today)) {
        setError('Reservations cannot be made for past dates.');
        return;
    }

    try {
      const payload = {
        user_id: user.id,
        type: 'sunbed',
        reservation_date: reservationDate,
        sunbed_type: sunbedType,
      };
      const response = await apiClient.post('/reservations', payload);
      setSuccess('Sunbed reservation successful! Confirmation ID: ' + response.data.id);
      // Clear form
      setReservationDate('');
      setSunbedType('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to make sunbed reservation. Please try again.');
      }
      console.error('Sunbed reservation error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger mt-3">{error}</p>}
      {success && <p className="alert alert-success mt-3">{success}</p>}

      <div className="mb-3">
        <label htmlFor="reservationDateSunbed" className="form-label">
          Date
        </label>
        <input
          type="date"
          id="reservationDateSunbed"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="form-control"
          min={today} // Prevent selecting past dates
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sunbedType" className="form-label">
          Sunbed Type
        </label>
        <select
          id="sunbedType"
          value={sunbedType}
          onChange={(e) => setSunbedType(e.target.value)}
          className="form-select"
          required
        >
          <option value="" disabled>Select a sunbed type</option>
          {sunbedTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-info" // w-100 is not needed with d-grid on parent. Changed to btn-info
        >
          Book Sunbed
        </button>
      </div>
    </form>
  );
};

export default SunbedReservationForm;
