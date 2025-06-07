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
    if (!reservationDate || !reservationTime || !numPeople) {
      setError('All fields are required.');
      return;
    }
    if (numPeople < 1) {
        setError('Number of people must be at least 1.');
        return;
    }
    if (new Date(reservationDate) < new Date(today)) {
        setError('Reservations cannot be made for past dates.');
        return;
    }

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
    <form onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger mt-3">{error}</p>}
      {success && <p className="alert alert-success mt-3">{success}</p>}

      <div className="mb-3">
        <label htmlFor="reservationDateTable" className="form-label">
          Date
        </label>
        <input
          type="date"
          id="reservationDateTable"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="form-control"
          min={today} // Prevent selecting past dates
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="reservationTimeTable" className="form-label">
          Time Slot
        </label>
        <select
          id="reservationTimeTable"
          value={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
          className="form-select"
          required
        >
          <option value="" disabled>Select a time slot</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="numPeople" className="form-label">
          Number of People
        </label>
        <input
          type="number"
          id="numPeople"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          min="1"
          className="form-control"
          required
        />
      </div>

      <div className="d-grid"> {/* Use d-grid for full-width button */}
        <button
          type="submit"
          className="btn btn-primary" // w-100 is not needed with d-grid on parent
        >
          Book Table
        </button>
      </div>
    </form>
  );
};

export default TableReservationForm;
