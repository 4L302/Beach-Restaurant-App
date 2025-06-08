import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SunbedReservationForm = () => {
  const { user } = useAuth();
  const [reservationDate, setReservationDate] = useState('');
  const [sunbedType, setSunbedType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sunbedTypes = [
    { value: 'standard', label: 'Standard Sunbed' },
    { value: 'double', label: 'Double Sunbed' },
    { value: 'gazebo', label: 'Gazebo' },
    { value: 'vip_lounger', label: 'VIP Lounger' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.uid) {
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
        userId: user.uid,
        type: 'sunbed',
        reservation_date: reservationDate,
        sunbed_type: sunbedType,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'reservations'), payload);
      setSuccess(`Sunbed reservation successful! ID: ${docRef.id}`);

      // Reset form
      setReservationDate('');
      setSunbedType('');
    } catch (err) {
      console.error('Firestore error:', err);
      setError('Failed to save reservation. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alert alert-danger mt-3">{error}</p>}
      {success && <p className="alert alert-success mt-3">{success}</p>}

      <div className="mb-3">
        <label htmlFor="reservationDateSunbed" className="form-label">Date</label>
        <input
          type="date"
          id="reservationDateSunbed"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="form-control"
          min={today}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sunbedType" className="form-label">Sunbed Type</label>
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
        <button type="submit" className="btn btn-info">Book Sunbed</button>
      </div>
    </form>
  );
};

export default SunbedReservationForm;
