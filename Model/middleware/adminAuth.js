import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Check for hardcoded admin token
    if (token === 'hardcoded-admin-token') {
      req.admin = { _id: 'admin', role: 'admin' };
      next();
      return;
    }
    
    // Regular JWT verification for database users
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle hardcoded admin case with JWT
    if (decoded.id === "admin") {
      req.admin = { _id: 'admin', role: 'admin' };
      next();
      return;
    }
    
    // Look up regular database admin users
    const admin = await userModel.findById(decoded.id);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.admin = admin;
    next();
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default adminAuth;