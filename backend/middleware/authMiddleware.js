const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // First, try finding in users table
    let result = await db.query('SELECT id, name, email, \'user\' as role FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      // If not in users, try coolies table
      result = await db.query('SELECT id, first_name || \' \' || last_name as name, email, \'coolie\' as role, is_approved FROM coolies WHERE id = $1', [decoded.id]);
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

exports.optionalProtect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return next(); // Proceed as guest
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let result = await db.query('SELECT id, name, email, \'user\' as role FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      result = await db.query('SELECT id, first_name || \' \' || last_name as name, email, \'coolie\' as role FROM coolies WHERE id = $1', [decoded.id]);
    }

    if (result.rows.length > 0) {
      req.user = result.rows[0];
    }
    
    next();
  } catch (error) {
    // If token is invalid, just proceed as guest
    next();
  }
};
