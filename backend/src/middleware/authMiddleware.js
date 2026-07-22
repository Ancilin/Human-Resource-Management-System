import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'hrms_super_secret_jwt_key_2026';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch full details
    const user = await db.get(`
      SELECT u.id as user_id, u.email, u.role, e.id as employee_id, e.employee_code, e.name, e.department, e.designation, e.avatar
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.id = ?
    `, [decoded.userId]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
  }
}
