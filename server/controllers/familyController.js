// familyController.js
import familyModel from "../models/familyModel.js";

function normalizeFamilyPayload(body) {
  const familyname1 =
    body.familyname1 ||
    body.fatherName ||
    body.motherName ||
    body.familyName ||
    null;

  return {
    familyname1,
    familyname2: body.familyname2 ?? null,
    email: body.email ?? body.familyEmail ?? null,
    phone: body.phone ?? body.familyPhone ?? null,
    address: body.address ?? null,
  };
}

function validateFamilyPayload(res, payload) {
  if (!payload.familyname1) {
    res.status(400).json({ message: "familyname1 is required" });
    return false;
  }
  if (!payload.email) {
    res.status(400).json({ message: "email is required" });
    return false;
  }
  if (!payload.phone) {
    res.status(400).json({ message: "phone is required" });
    return false;
  }
  return true;
}

async function createFamily(req, res) {
  try {
    const userId = Number(req.params.userId)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await familyModel.getFamily(userId);
    if (existing) return res.status(409).json({ message: "Family already exists" });

    const payload = normalizeFamilyPayload(req.body);
    if (!validateFamilyPayload(res, payload)) return;

    const family = await familyModel.createFamily(userId, payload);
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
    if (!family) return res.status(404).json({ message: "Family not found" });
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

    const payload = normalizeFamilyPayload(req.body);
    if (!validateFamilyPayload(res, payload)) return;

    const updated = await familyModel.updateFamily(userId, payload);
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
