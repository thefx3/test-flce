//adminRoutes.js
import { Router } from "express";
import adminController from "../controllers/adminController.js";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"
import userController from "../controllers/userController.js";
import profileController from "../controllers/profileController.js";

const router = Router();

// --- ADMINS --- (Admin Users)
router.post("/register",  authController.register);
router.get("/admins", userController.getAllAdmins);
router.get("/admins/:id", userController.getSingleAdmin);
router.put("/admins/:id", userController.updateAdmin);
router.delete("/admins/:id", userController.deleteAdmin);

// --- USERS --- (Test Users)
router.post("/users", userController.createTestUser); //Public
router.get("/users", userController.getAllUsers); 
router.get("/users/:userId", userController.getSingleUser); //Public
router.put("/users/:userId", userController.updateUser); //Public 
router.put("/users/:userId", userController.deleteUser);


//--- PROFILE ---
router.post("/users/:userId/profile", authRequired, adminRequired, profileController.createProfile); //Public
router.get("/users/:userId/profile", authRequired, adminRequired, profileController.getSingleProfile); //Public
router.put("/users/:userId/profile", authRequired, adminRequired, profileController.updateProfile); //Public
router.delete("/users/:userId/profile", authRequired, adminRequired, profileController.deleteProfile)
router.put("/users/:userId/profile/level", authRequired, adminRequired, profileController.setLevel);


// --- FAMILY ---
router.post("/users/:userId/family", authRequired, adminRequired, adminController.addFamily);
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
