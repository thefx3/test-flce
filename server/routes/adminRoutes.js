//adminRoutes.js
import { Router } from "express";
import adminController from "../controllers/adminController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"

const router = Router();

// =============== ADMIN ACCOUNTS ==================
// Manage all the admin accounts

router.get("/admins", authRequired, adminController.getAdmins);

router.get("/admins/:id", authRequired, adminController.getSingleAdmin);

router.put("/admins/:id", authRequired, adminController.updateAdmin);

router.delete("/admins/:id", authRequired, adminController.deleteAdmin);


// =============== USER ACCOUNTS ==================
// Manage all the test user accounts

router.get("/users", authRequired, adminRequired, adminController.getAllUsers);

router.get("/users/:id", authRequired, adminRequired, adminController.getUser);

router.put("/users/:id", authRequired, adminRequired, adminController.updateUser);


router.get("/users/:id/profile", authRequired, adminRequired, adminController.getProfile);

router.put("/users/:id/profile", authRequired, adminRequired, adminController.updateProfile);

router.put("/users/:id/profile/level", authRequired, adminRequired, adminController.updateProfileLevel);


router.get("/users/:userId/families", authRequired, adminRequired, adminController.getFamilies);

router.put("/users/:userId/families/:familyId", authRequired, adminRequired, adminController.updateFamily);

router.delete("/users/:userId/families/:familyId", authRequired, adminRequired, adminController.deleteFamily);


router.get("/users/:userId/test/:testId", authRequired, adminRequired, adminController.getTest);

router.put("/users/:userId/test/:testId/auto-grade", authRequired, adminRequired, adminController.gradeTestAuto);

router.put("/users/:userId/test/:testId/manual-grade", authRequired, adminRequired, adminController.gradeTestManual);



export default router;
