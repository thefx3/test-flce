//adminRoutes.js
import { Router } from "express";
import adminController from "../controllers/adminController.js";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"

const router = Router();

// --- ADMINS --- (Admin Users)
router.post("/register", authRequired, adminRequired, authController.register);
router.get("/admins", authRequired, adminRequired, adminController.getAdmins);
router.get("/admins/:id", authRequired, adminRequired, adminController.getSingleAdmin);
router.put("/admins/:id", authRequired, adminRequired, adminController.updateAdmin);
router.delete("/admins/:id", authRequired, adminRequired, adminController.deleteAdmin);

// --- USERS --- (Test Users)
router.get("/users", authRequired, adminRequired, adminController.getAllUsers);
router.get("/users/:userId", authRequired, adminRequired, adminController.getUser);
router.put("/users/:userId", authRequired, adminRequired, adminController.updateUser);

//--- PROFILE ---
router.post("/users/:userId/profile", authRequired, adminRequired, adminController.createProfile);
router.get("/users/:userId/profile", authRequired, adminRequired, adminController.getProfile);
router.put("/users/:userId/profile", authRequired, adminRequired, adminController.updateProfile);
router.put("/users/:userId/profile/level", authRequired, adminRequired, adminController.updateProfileLevel);

// --- FAMILY ---
router.get("/users/:userId/families", authRequired, adminRequired, adminController.getFamilies);
router.put("/users/:userId/families/:familyId", authRequired, adminRequired, adminController.updateFamily);
router.delete("/users/:userId/families/:familyId", authRequired, adminRequired, adminController.deleteFamily);

// --- TESTS --- 
router.get("/users/:userId/tests", authRequired, adminRequired, adminController.getAllTests);
router.get("/users/:userId/tests/:testId", authRequired, adminRequired, adminController.getSingleTest);
router.delete("/users/:userId/tests/:testId", authRequired, adminRequired, adminController.deleteSingleTest);

// --- GRADES ---
router.put("/users/:userId/tests/:testId/auto-grade", authRequired, adminRequired, adminController.gradeTestAuto);
router.put("/users/:userId/tests/:testId/manual-grade", authRequired, adminRequired, adminController.gradeTestManual);

export default router;
