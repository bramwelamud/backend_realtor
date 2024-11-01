const User = require('../models/user.model'); // Import User model
const jwt = require('jsonwebtoken'); // Import JWT for token handling

// Controller to log in a user
exports.loginUser = async (req, res) => {
  const { user_email, password } = req.body; // Get credentials from request
  try {
    const user = await User.findByEmail(user_email); // Fetch the user by email
    if (!user) return res.status(401).send({ message: "Invalid email or password" });

    const isValidPassword = await user.validatePassword(password); // Validate password
    if (!isValidPassword) return res.status(401).send({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, userType: user.user_type }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send({ message: "Error logging in user", error });
  }
};

// Controller to log out a user
exports.logoutUser = (req, res) => {
  // Implement logout logic, e.g., invalidate token on client side
  res.status(200).send({ message: "User logged out successfully" });
};

// Controller to validate token
exports.validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(403).send({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Invalid token" });
    res.status(200).send({ message: "Token is valid", userId: decoded.userId });
  });
};
