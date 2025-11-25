// controllers/adminController.js
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import familyModel from "../models/familyModel.js";
import testModel from "../models/testModel.js";

// =============== ADMIN ACCOUNTS ==================

async function getAdmins(req, res) {
  try {
    const admins = await userModel.getAdmins();
    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getSingleAdmin(req, res) {
  try {
    const adminId = Number(req.params.id);
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
    const id = Number(req.params.id);
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
    const id = Number(req.params.id);

    await userModel.deleteUserById(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// =============== USER ACCOUNTS ==================

async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getUser(req, res) {
  try {
    const id = Number(req.params.id);
    const user = Number.isNaN(id)
      ? null
      : await userModel.getSingleUserById(id);

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

async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
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

// =============== PROFILE ==================

async function getProfile(req, res) {
  try {
    const id = Number(req.params.id);
    const profile = await profileModel.getProfileByUserId(id);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateProfile(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const profile = await profileModel.getProfileByUserId(id);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    const updated = await profileModel.updateProfile(id, data);
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateProfileLevel(req, res) {
  try {
    const id = Number(req.params.id);
    const { level } = req.body;

    if (level === undefined || level === null) {
      return res.status(400).json({ message: "level is required" });
    }

    const profile = await profileModel.getProfileByUserId(id);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    const updated = await profileModel.updateProfileLevel(id, level);
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile level:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// =============== FAMILIES ==================

async function getFamilies(req, res) {
  try {
    const userId = Number(req.params.userId);
    const families = Number.isNaN(userId)
      ? []
      : await familyModel.listFamilies(userId);

    if (!families.length) {
      return res.status(404).json({ message: "Families not found" });
    }

    res.json(families);
  } catch (err) {
    console.error("Error fetching families:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateFamily(req, res) {
  try {
    const { familyId, userId } = req.params;
    const parsedFamilyId = Number(familyId);
    const parsedUserId = Number(userId);
    const data = req.body;

    const family = Number.isNaN(parsedFamilyId)
      ? null
      : await familyModel.getFamily(parsedFamilyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    if (!Number.isNaN(parsedUserId) && family.userId !== parsedUserId) {
      return res
        .status(403)
        .json({ message: "Family does not belong to this user" });
    }

    const updated = await familyModel.updateFamily(parsedFamilyId, data);
    res.json(updated);
  } catch (err) {
    console.error("Error updating family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function deleteFamily(req, res) {
  try {
    const { familyId, userId } = req.params;
    const parsedFamilyId = Number(familyId);
    const parsedUserId = Number(userId);

    const family = Number.isNaN(parsedFamilyId)
      ? null
      : await familyModel.getFamily(parsedFamilyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    if (!Number.isNaN(parsedUserId) && family.userId !== parsedUserId) {
      return res
        .status(403)
        .json({ message: "Family does not belong to this user" });
    }

    await familyModel.deleteFamilyById(parsedFamilyId);
    res.json({ message: "Family deleted" });
  } catch (err) {
    console.error("Error deleting family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// =============== TESTS ==================

async function getTest(req, res) {
  try {
    const { userId, testId } = req.params;
    const parsedTestId = Number(testId);
    const parsedUserId = Number(userId);

    const test = Number.isNaN(parsedTestId)
      ? null
      : await testModel.getTestAdmin(parsedTestId);

    if (!test) return res.status(404).json({ message: "Test not found" });

    if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
      return res
        .status(403)
        .json({ message: "Test does not belong to this user" });
    }

    res.json(test);
  } catch (err) {
    console.error("Error fetching test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function gradeTestAuto(req, res) {
  try {
    const { userId, testId } = req.params;
    const parsedTestId = Number(testId);
    const parsedUserId = Number(userId);

    const test = Number.isNaN(parsedTestId)
      ? null
      : await testModel.getTestAdmin(parsedTestId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
      return res
        .status(403)
        .json({ message: "Test does not belong to this user" });
    }

    await testModel.gradeAuto(parsedTestId);
    const updated = await testModel.getTestAdmin(parsedTestId);
    res.json(updated);
  } catch (err) {
    console.error("Error auto-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function gradeTestManual(req, res) {
  try {
    const { userId, testId } = req.params;
    const parsedTestId = Number(testId);
    const parsedUserId = Number(userId);
    const grades = Array.isArray(req.body) ? req.body : req.body.grades;

    if (!Array.isArray(grades)) {
      return res
        .status(400)
        .json({ message: "grades must be an array" });
    }

    const test = Number.isNaN(parsedTestId)
      ? null
      : await testModel.getTestAdmin(parsedTestId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
      return res
        .status(403)
        .json({ message: "Test does not belong to this user" });
    }

    await testModel.gradeManual(grades);
    const updated = await testModel.getTestAdmin(parsedTestId);
    res.json(updated);
  } catch (err) {
    console.error("Error manual-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  getAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  getUser,
  updateUser,
  getProfile,
  updateProfile,
  updateProfileLevel,
  getFamilies,
  updateFamily,
  deleteFamily,
  getTest,
  gradeTestAuto,
  gradeTestManual,
};
