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


router.get("/users/:id/family", authRequired, adminController.getFamily);

router.put("/users/:id/family", authRequired, adminController.updateFamily);

router.delete("/users/:id/family", authRequired, adminController.deleteFamily);


router.get("/users/:id/test", authRequired, adminController.getTest);

router.put("/users/:id/test", authRequired, adminController.gradeTest);


export default router;
