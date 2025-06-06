import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import TableReservationForm from '../components/TableReservationForm'; // Import actual component
import SunbedReservationForm from '../components/SunbedReservationForm'; // Import actual component

const ReservationsPage = () => {
  const { isAuthenticated } = useAuth();
  const [reservationType, setReservationType] = useState('table'); // 'table' or 'sunbed'

  if (!isAuthenticated) {
    // It's good practice to use `replace` to prevent the login page from being added to history
    // if the user tries to access a protected route directly.
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Make a Reservation</h1>

      <div className="flex justify-center mb-8 shadow rounded-lg">
        <button
          onClick={() => setReservationType('table')}
          className={`flex-1 px-4 py-3 sm:px-6 font-semibold rounded-l-lg transition-colors duration-300 focus:outline-none
                        ${reservationType === 'table'
                            ? 'bg-blue-600 text-white shadow-inner'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Book a Table
        </button>
        <button
          onClick={() => setReservationType('sunbed')}
          className={`flex-1 px-4 py-3 sm:px-6 font-semibold rounded-r-lg transition-colors duration-300 focus:outline-none
                        ${reservationType === 'sunbed'
                            ? 'bg-teal-600 text-white shadow-inner'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Book a Sunbed
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
        {reservationType === 'table' ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Table Reservation Details</h2>
            <TableReservationForm />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Sunbed Reservation Details</h2>
            <SunbedReservationForm />
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;
