// controllers/adminController.js
import userModel from "../models/userModel.js";

// =========== ADMIN ACCOUNTS ============

//Admin 
async function getAllAdmins(req, res) {
  try {
    const admins = await userModel.getAllAdmins();
    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getSingleAdmin(req, res) {
  try {
    const adminId = Number(req.params.userId);
    if (Number.isNaN(adminId)) {
      return res.status(400).json({ message: "Admin id is required" });
    }
    const admin = Number.isNaN(adminId)
      ? null
      : await userModel.getSingleAdminById(adminId);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateAdmin(req, res) {
  try {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Admin id is required" });
    }
    const data = req.body;

    const admin = await userModel.getSingleAdminById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const updated = await userModel.updateAdmin(id, data);
    res.json(updated);
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function deleteAdmin(req, res) {
  try {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Admin id is required" });
    }

    await userModel.deleteUserById(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

//Public - can't access to admin accounts 


// ============ USER ACCOUNTS ============

//Admin & Public
async function createTestUser(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await userModel.getSingleUserByEmail(email);
    if (existing) return res.status(409).json({ message: "User already exists" });

    const user = await userModel.createTestUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getSingleUser(req, res) { //If public, ensureOwnProfile | If admin = authrrequired
  try {
    const userId = Number(req.params.userId);
    const user = Number.isNaN(userId)
      ? null
      : await userModel.getSingleUserById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "USER") {
      return res.status(403).json({ message: "Not a test user" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateUser(req, res) { //If public, ensurOwnProfile | If admin = authrequired
  try {
    const id = Number(req.params.userId);
    const data = req.body;

    const user = Number.isNaN(id)
      ? null
      : await userModel.getSingleUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "USER") {
      return res.status(403).json({ message: "Not a test user" });
    }

    const updated = await userModel.updateUser(id, data);
    res.json(updated);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

//Admin - all informations about users
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = Number(req.params.userId);

    await userModel.deleteUserById(userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

//Public - only basic informations

export default {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  
  createTestUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
}
