import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import InfoPiattoPage from './pages/InfoPiattoPage';
import ReservationsPage from './pages/ReservationsPage';
import MyReservationsPage from './pages/MyReservationsPage'; // Import MyReservationsPage
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '0rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/dish/:id" element={<InfoPiattoPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} /> {/* New route */}
          {/* TODO: Add a 404 Not Found route later */}
        </Routes>
      </div>
    </>
  );
}

export default App;
