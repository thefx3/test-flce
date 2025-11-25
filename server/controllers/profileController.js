// profileController.js
import profileModel from "../models/profileModel.js";

async function getProfile(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function createProfile(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await profileModel.getProfileByUserId(userId);
    if (existing) return res.status(409).json({ message: "Profile already exists" });

    const profile = await profileModel.createProfile(userId, req.body);
    res.status(201).json(profile);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await profileModel.getProfileByUserId(userId);
    if (!existing) return res.status(404).json({ message: "Profile not found" });

    const updated = await profileModel.updateProfile(userId, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

function ensureOwnProfile(req, res, next) {
  if (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN") {
    return next();
  }
  if (Number(req.user.userId) !== Number(req.params.userId)) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
}

async function setLevel(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { level } = req.body;

    const validLevels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const updated = await prisma.profile.update({
      where: { userId },
      data: { level }
    });

    return res.json(updated);

  } catch (err) {
    console.error("Error setting level:", err);
    res.status(500).json({ message: "Internal error" });
  }
}


export default {
  getProfile,
  createProfile,
  updateProfile,
  ensureOwnProfile,
  setLevel
};
