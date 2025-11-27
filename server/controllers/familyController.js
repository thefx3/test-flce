// familyController.js
import familyModel from "../models/familyModel.js";

async function addFamily(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await familyModel.getFamilyByUserId(userId);
    if (existing) return res.status(409).json({ message: "Family already exists" });

    const family = await familyModel.addFamily(userId, req.body);
    res.status(201).json(family);
  } catch (err) {
    console.error("Error creating family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getFamilies(req, res) {
  try {
    const families = await familyModel.getAllFamilies();
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

export default {
  addFamily,
  getFamilies,
  updateFamily,
  deleteFamily
};
