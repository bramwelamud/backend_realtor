// Middleware to check user role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assume user's role is stored in the request from the authentication middleware
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
  
      next(); // Proceed to next middleware or route handler
    };
  };
  
  module.exports = authorize;
  