// familyController.js
import familyModel from "../models/familyModel.js";

async function createFamily(req, res) {
  try {
    const userId = Number(req.params.userId)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await familyModel.getFamily(userId);
    if (existing) return res.status(409).json({ message: "Family already exists" });

    const family = await familyModel.createFamily(userId, req.body);
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

async function getSingleFamily(req, res) {
  try {
    const userId = Number(req.params.userId)
    const family = await familyModel.getSingleFamily(userId);
    res.json(family);
  } catch (err) {
    console.error("Error fetching family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateFamily(req, res) {
  try {
    const userId = Number(req.params.userId)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await familyModel.getFamily(userId);
    if (!existing) return res.status(404).json({ message: "Family not found" });

    const updated = await familyModel.updateFamily(userId, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function deleteFamily(req, res) {
  try {
    const userId = Number(req.params.userId);

    await familyModel.deleteFamily(userId);
    res.json({ message: "Family deleted" });
  } catch (err) {
    console.error("Error deleting family:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  createFamily,
  getAllFamilies,
  getSingleFamily,
  updateFamily,
  deleteFamily
};
