const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const dishRoutes = require('./routes/dishes');
const reservationRoutes = require('./routes/reservations'); // Import reservation routes
const db = require('./database'); // Import the db instance to ensure database.js runs and connects

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/reservations', reservationRoutes); // Mount reservation routes under /api/reservations

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running! Database connection has been established. All routes should be available.');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Note: Graceful shutdown for DB is handled in database.js
// Handle uncaught exceptions and unhandled rejections (basic logging)
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Consider graceful shutdown here as well
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
