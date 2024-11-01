const Backoffice = require('..backoffice.model'); // Import the Backoffice model

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Backoffice.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users", error });
  }
};

// Controller to approve a user
exports.approveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await Backoffice.approveUser(userId);
    res.status(200).send({ message: "User approved successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error approving user", error });
  }
};

// Controller to suspend a user
exports.suspendUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await Backoffice.suspendUser(userId);
    res.status(200).send({ message: "User suspended successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error suspending user", error });
  }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await Backoffice.deleteUser(userId);
    res.status(200).send({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
};

// Controller to get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Backoffice.getAllProperties();
    res.status(200).send(properties);
  } catch (error) {
    res.status(500).send({ message: "Error fetching properties", error });
  }
};

// Controller to delete a property
exports.deleteProperty = async (req, res) => {
  const propertyId = req.params.id;
  try {
    await Backoffice.deleteProperty(propertyId);
    res.status(200).send({ message: "Property deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting property", error });
  }
};
