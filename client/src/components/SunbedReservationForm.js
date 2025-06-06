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
    // TODO: Add date validation (e.g., not in the past)

    try {
      const payload = {
        user_id: user.id,
        type: 'sunbed',
        reservation_date: reservationDate,
        sunbed_type: sunbedType,
        // reservation_time and num_people are not applicable here for this simplified version
      };
      const response = await apiClient.post('/reservations', payload);
      setSuccess('Sunbed reservation successful! Confirmation ID: ' + response.data.id);
      // Clear form
      setReservationDate('');
      setSunbedType('');
      // TODO: Optionally redirect or update a list of user's reservations
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm text-center p-2 bg-red-100 rounded-md">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center p-2 bg-green-100 rounded-md">{success}</p>}

      <div>
        <label htmlFor="reservationDateSunbed" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="reservationDateSunbed"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="sunbedType" className="block text-sm font-medium text-gray-700 mb-1">
          Sunbed Type
        </label>
        <select
          id="sunbedType"
          value={sunbedType}
          onChange={(e) => setSunbedType(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled>Select a sunbed type</option>
          {sunbedTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Book Sunbed
        </button>
      </div>
    </form>
  );
};

export default SunbedReservationForm;
