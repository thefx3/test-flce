//adminRoutes.js
import { Router } from "express";
import adminController from "../controllers/adminController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

// =============== ADMIN ACCOUNTS ==================
// Manage all the admin accounts

router.get("/admins", authRequired, adminController.getAdmins);

router.get("/admins/:id", authRequired, adminController.getSingleAdmin);

router.put("/admins/:id", authRequired, adminController.updateAdmin);

router.delete("/admins/:id", authRequired, adminController.deleteAdmin);


// =============== USER ACCOUNTS ==================
// Manage all the test user accounts

router.get("/users", authRequired, adminController.getAllUsers);

router.get("/users/:id", authRequired, adminController.getUser);

router.put("/users/:id", authRequired, adminController.updateUser);


router.get("/users/:id/profile", authRequired, adminController.getProfile);

router.put("/users/:id/profile", authRequired, adminController.updateProfile);


router.get("/users/:userId/families", authRequired, adminController.getFamilies);

router.put("/users/:userId/families/:familyId", authRequired, adminController.updateFamily);

router.delete("/users/:userId/families/:familyId", authRequired, adminController.deleteFamily);


router.get("/users/:userId/test/:testId", authRequired, adminController.getTest);

router.put("/users/:userId/test/:testId/auto-grade", authRequired, adminController.gradeTestAuto);

router.put("/users/:userId/test/:testId/manual-grade", authRequired, adminController.gradeTestManual);


export default router;
