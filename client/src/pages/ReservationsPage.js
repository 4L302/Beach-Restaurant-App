import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import TableReservationForm from '../components/TableReservationForm';
import SunbedReservationForm from '../components/SunbedReservationForm';

const ReservationsPage = () => {
  const { isAuthenticated } = useAuth();
  const [reservationType, setReservationType] = useState('table'); // 'table' or 'sunbed'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container py-4 py-md-5">
      <h1 className="display-5 text-center my-4 fw-bold">Make a Reservation</h1>

      <ul className="nav nav-pills nav-fill mb-4 justify-content-center fs-5" id="reservationTypeTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${reservationType === 'table' ? 'active' : ''}`}
            id="table-tab"
            onClick={() => setReservationType('table')}
            type="button"
            role="tab"
            aria-controls="table-form"
            aria-selected={reservationType === 'table'}
          >
            Book a Table
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${reservationType === 'sunbed' ? 'active' : ''}`}
            id="sunbed-tab"
            onClick={() => setReservationType('sunbed')}
            type="button"
            role="tab"
            aria-controls="sunbed-form"
            aria-selected={reservationType === 'sunbed'}
          >
            Book a Sunbed
          </button>
        </li>
      </ul>

      <div className="card shadow-sm p-4 p-md-5 mx-auto" style={{ maxWidth: '768px' }}>
        {reservationType === 'table' ? (
          <div id="table-form" role="tabpanel" aria-labelledby="table-tab">
            <h2 className="h3 text-center mb-4">Table Reservation Details</h2>
            <TableReservationForm />
          </div>
        ) : (
          <div id="sunbed-form" role="tabpanel" aria-labelledby="sunbed-tab">
            <h2 className="h3 text-center mb-4">Sunbed Reservation Details</h2>
            <SunbedReservationForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;
