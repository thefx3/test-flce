// controllers/adminController.js
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import familyModel from "../models/familyModel.js";
import testModel from "../models/testModel.js";


// =========== PROFILE ==================

async function createProfile(req, res) {
  try {
    const userIdParam = req.params.userId;
    const userId = userIdParam ? Number(userIdParam) : req.user?.userId;
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const existing = await profileModel.getProfileByUserId(userId);
    if (existing) return res.status(409).json({ message: "Profile already exists" });

    const profile = await profileModel.createProfile(userId, req.body);
    res.status(201).json(profile);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getProfile(req, res) {
  try {
    const userId = Number(req.params.userId);
    const profile = await profileModel.getProfileByUserId(userId);
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
    const userId = Number(req.params.userId);
    const data = req.body;

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    const updated = await profileModel.updateProfile(userId, data);
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateProfileLevel(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { level } = req.body;

    if (level === undefined || level === null) {
      return res.status(400).json({ message: "level is required" });
    }

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    const updated = await profileModel.updateProfileLevel(userId, level);
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile level:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// =========== FAMILIES =================

//Needs to be an Au Pair + Role.user = "USER"
async function addFamily(req, res) {
  try {
    const userIdParam = req.params.userId;
    const userId = userIdParam ? Number(userIdParam) : req.user?.userId;
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const existing = await familyModel.getFamilyByUserId(userId);
    if (existing && existing.length > 0) {
      return res.status(409).json({ message: "Family already exists" });
    }

    const family = await familyModel.addFamily(userId, req.body);
    res.status(201).json(family);
  } catch (err) {
    console.error("Error creating family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getAllFamilies(req, res) {
  try {
    const families = await familyModel.getAllFamilies();
    res.json(families);
  } catch (err) {
    console.error("Error fetching families:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getFamilies(req, res) {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const families = await familyModel.getFamilyByUserId(userId);
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

// GET for userId USER, all his tests
async function getAllTests(req, res) {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const tests = await testModel.getTestsByUserId(userId);
    res.json(tests);
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// GET for userId USER, the testId TEST. 
async function getSingleTest(req, res) {
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

// DELETE for userId USER, the testId TEST. 
async function deleteSingleTest(req, res) {
  try {
    const { userId, testId } = req.params;
    const parsedTestId = Number(testId);
    const parsedUserId = Number(userId);

    const test = Number.isNaN(parsedTestId)
      ? null
      : await testModel.deleteTest(parsedTestId);

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

  createProfile,
  getProfile,
  updateProfile,
  updateProfileLevel,

  addFamily,
  getFamilies,
  getAllFamilies,
  updateFamily,
  deleteFamily,

  getAllTests,
  getSingleTest,
  deleteSingleTest,

  gradeTestAuto,
  gradeTestManual,
};
