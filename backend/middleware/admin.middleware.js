const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid token or admin inactive.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.admin.role === 'super_admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions.' });
    }
  };
};

module.exports = { adminAuth, requirePermission };