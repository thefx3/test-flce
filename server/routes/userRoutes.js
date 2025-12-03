import { Router } from "express";
import userController from "../controllers/userController.js";
import authRequired from "../auth/authRequired.js";
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//Public
router.post("/users",  authRequired, userController.createTestUser);
router.get("/users/:userId",  authRequired, ownerRequired, userController.getSingleUser);
router.put("/users/:userId",  authRequired, ownerRequired, userController.updateUser);

export default router;