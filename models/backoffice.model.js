const db = require('../config/db.conn'); // Database connection

// Admin model for managing users and properties
class Backoffice {
  // Get all users
  static async getAllUsers() {
    const [users] = await db.query("SELECT * FROM users");
    return users;
  }

  // Approve user
  static async approveUser(userId) {
    await db.query("UPDATE users SET status = 'approved' WHERE id = ?", [userId]);
  }

  // Suspend user
  static async suspendUser(userId) {
    await db.query("UPDATE users SET status = 'suspended' WHERE id = ?", [userId]);
  }

  // Delete user
  static async deleteUser(userId) {
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
  }

  // Get all properties
  static async getAllProperties() {
    const [properties] = await db.query("SELECT * FROM properties");
    return properties;
  }

  // Delete property
  static async deleteProperty(propertyId) {
    await db.query("DELETE FROM properties WHERE id = ?", [propertyId]);
  }
}

module.exports = Backoffice;
