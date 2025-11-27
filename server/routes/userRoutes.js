import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//Public
router.post("/users",  authRequired, userController.createTestUser);
router.get("/users/:userId",  authRequired, ownerRequired, userController.getSingleUser);
router.put("/users/:userId",  authRequired, ownerRequired, userController.updateUser);

export default router;