const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file. Auth middleware will not work.");
  // This middleware will fail all requests if JWT_SECRET is not set.
  // Depending on the application's needs, you might want to throw an error here
  // or have a more graceful fallback, though for auth, failing closed is often preferred.
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (!JWT_SECRET) {
        // This check is crucial here as well to prevent trying to verify with an undefined secret
        console.error('Auth Middleware: JWT_SECRET is not available. Cannot verify token.');
        return res.status(500).json({ message: 'Server configuration error: JWT secret missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user payload (e.g., { userId, email, name }) to the request object
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token is expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        // For other errors, it might be a server issue or an unexpected token problem
        return res.status(500).json({ message: 'Failed to authenticate token' });
    }
};

module.exports = authenticateToken;
