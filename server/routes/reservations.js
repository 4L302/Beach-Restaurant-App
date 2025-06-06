const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// POST /api/reservations/ - Create a new reservation
router.post('/', reservationController.createReservation);

// GET /api/reservations/ - Get all reservations (optionally filter by user_id or type)
router.get('/', reservationController.getReservations);

// GET /api/reservations/:id - Get a specific reservation by ID
router.get('/:id', reservationController.getReservationById);

// PUT /api/reservations/:id - Update a specific reservation by ID
router.put('/:id', reservationController.updateReservation);

// DELETE /api/reservations/:id - Delete a specific reservation by ID
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
