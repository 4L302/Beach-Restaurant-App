const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/reservations/ - Create a new reservation
router.post('/', authenticateToken, reservationController.createReservation);

// GET /api/reservations/ - Get all reservations (optionally filter by user_id or type)
// For fetching user-specific reservations, this should be protected.
// If there's a use case for admin fetching all, that might be a separate route or role check.
router.get('/', authenticateToken, reservationController.getReservations);

// GET /api/reservations/:id - Get a specific reservation by ID
router.get('/:id', authenticateToken, reservationController.getReservationById);

// PUT /api/reservations/:id - Update a specific reservation by ID
router.put('/:id', authenticateToken, reservationController.updateReservation);

// DELETE /api/reservations/:id - Delete a specific reservation by ID
router.delete('/:id', authenticateToken, reservationController.deleteReservation);

module.exports = router;
