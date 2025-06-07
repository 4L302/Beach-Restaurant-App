const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database'); // Import the shared db instance
const { getQuery, runQuery } = require('../utils/dbHelpers'); // Import helpers

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  // Consider exiting the process if JWT_SECRET is crucial for the app to function
  // process.exit(1);
}

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const existingUser = await getQuery(db, 'SELECT email FROM users WHERE email = ?', [email]);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await runQuery(db, 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({
            message: 'User registered successfully.',
            userId: result.lastID,
            name: name,
            email: email
        });

    } catch (error) {
        console.error('Error in register function:', error.message);
        if (error.message.toLowerCase().includes('sqlite_constraint_unique')) {
             return res.status(409).json({ message: 'Email already exists (constraint violation).' });
        }
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await getQuery(db, 'SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const tokenPayload = {
            userId: user.id,
            email: user.email,
            name: user.name
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful.',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error in login function:', error.message);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful. Please delete your token on the client side.' });
};

module.exports = {
    register,
    login,
    logout
};
