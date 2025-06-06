const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "database.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Log the error and exit the process if connection fails
        console.error("Fatal Error: Could not connect to SQLite database.", err.message);
        process.exit(1); // Exit if DB connection fails
    } else {
        console.log('Connected to the SQLite database.');
        // Use serialize to ensure table creation happens in order
        db.serialize(() => {
            // Create users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error("Error creating users table:", err.message);
                } else {
                    // console.log("Users table checked/created.");
                }
            });

            // Create dishes table
            db.run(`CREATE TABLE IF NOT EXISTS dishes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT NOT NULL, -- 'meat' or 'fish'
                image_url TEXT,
                ingredients TEXT,
                preparation TEXT,
                allergens TEXT
            )`, (err) => {
                if (err) {
                    console.error("Error creating dishes table:", err.message);
                } else {
                    // console.log("Dishes table checked/created.");
                }
            });

            // Create reservations table
            db.run(`CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                type TEXT NOT NULL, -- 'table' or 'sunbed'
                reservation_date TEXT NOT NULL,
                reservation_time TEXT NOT NULL,
                num_people INTEGER, -- For table reservations
                sunbed_type TEXT, -- For sunbed reservations (e.g., 'standard', 'vip')
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    console.error("Error creating reservations table:", err.message);
                } else {
                    // console.log("Reservations table checked/created.");
                }
            });
        });
    }
});

// Graceful shutdown: Close the database connection when the Node process exits
// This is important to prevent database corruption and ensure resources are released.
// Moved this from authController to here, as database.js now "owns" the connection.
const gracefulShutdown = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.message);
        } else {
            console.log('Database connection closed successfully.');
        }
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = db;
