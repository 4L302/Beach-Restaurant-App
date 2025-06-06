import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

const TableReservationForm = () => {
  const { user } = useAuth();
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState(''); // E.g., 'Lunch', 'Dinner'
  const [numPeople, setNumPeople] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const timeSlots = ["Breakfast", "Lunch", "Aperitivo", "Dinner"]; // As per prenotazioni.html

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.id) {
      setError('You must be logged in to make a reservation.');
      return;
    }
    if (!reservationDate || !reservationTime || !numPeople) {
      setError('All fields are required.');
      return;
    }
    if (numPeople < 1) {
        setError('Number of people must be at least 1.');
        return;
    }

    // TODO: Add date validation (e.g., not in the past)

    try {
      const payload = {
        user_id: user.id,
        type: 'table',
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        num_people: parseInt(numPeople, 10),
      };
      const response = await apiClient.post('/reservations', payload);
      setSuccess('Table reservation successful! Confirmation ID: ' + response.data.id);
      // Clear form
      setReservationDate('');
      setReservationTime('');
      setNumPeople(1);
      // TODO: Optionally redirect or update a list of user's reservations
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to make table reservation. Please try again.');
      }
      console.error('Table reservation error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm text-center p-2 bg-red-100 rounded-md">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center p-2 bg-green-100 rounded-md">{success}</p>}

      <div>
        <label htmlFor="reservationDateTable" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="reservationDateTable"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="reservationTimeTable" className="block text-sm font-medium text-gray-700 mb-1">
          Time Slot
        </label>
        <select
          id="reservationTimeTable"
          value={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled>Select a time slot</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="numPeople" className="block text-sm font-medium text-gray-700 mb-1">
          Number of People
        </label>
        <input
          type="number"
          id="numPeople"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          min="1"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Book Table
        </button>
      </div>
    </form>
  );
};

export default TableReservationForm;
