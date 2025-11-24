//adminRoutes.js
import { Router } from "express";
import adminController from "../controllers/adminController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

// =============== ADMIN ACCOUNTS ==================
// Manage all the admin accounts

// Authrequired

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


router.get("/users/:id/family/:id", authRequired, adminController.getFamilies);

router.put("/users/:id/family/:id", authRequired, adminController.updateFamily);

router.delete("/users/:id/family/:id", authRequired, adminController.deleteFamily);


router.get("/users/:id/test/:id", authRequired, adminController.getTest);

router.put("/users/:id/test/:id/auto-grade", authRequired, adminController.gradeTestAuto);

router.put("/users/:id/test/:id/manual-grade", authRequired, adminController.gradeTestManual);


export default router;
