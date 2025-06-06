const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// POST /api/dishes/ - Create a new dish
router.post('/', dishController.createDish);

// GET /api/dishes/ - Get all dishes (optionally filter by category)
router.get('/', dishController.getDishes);

// GET /api/dishes/:id - Get a specific dish by ID
router.get('/:id', dishController.getDishById);

// PUT /api/dishes/:id - Update a specific dish by ID
router.put('/:id', dishController.updateDish);

// DELETE /api/dishes/:id - Delete a specific dish by ID
router.delete('/:id', dishController.deleteDish);

module.exports = router;
