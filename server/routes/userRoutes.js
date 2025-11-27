import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//To handle all the users/admin accounts

//Public
router.post("/users",  authRequired, ownerRequired, userController.createTestUser);
router.get("/users/:userId",  authRequired, ownerRequired, userController.getSingleUser);
router.put("/users/:userId",  authRequired, ownerRequired, userController.updateUser);

//Admin
router.post("/admins", authRequired, adminRequired, authController.register);
router.get("/admins", authRequired, adminRequired, userController.getAllAdmins);
router.get("/admins/:userId", authRequired, adminRequired, userController.getSingleAdmin);
router.put("/admins/:userId", authRequired, adminRequired, userController.updateAdmin);
router.delete("/admins/:userId", authRequired, adminRequired, userController.deleteAdmin);

router.get("/users",authRequired, adminRequired, userController.getAllUsers);
router.delete("/users/:userId", authRequired, adminRequired, userController.deleteUser);


export default router;