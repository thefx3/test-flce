// routes/profilRoutes.js
import { Router } from "express";
import profileController from "../controllers/profileController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//Public
router.get("/users/:userId", authRequired, ownerRequired, profileController.getSingleProfile);
router.post("/users/:userId",authRequired, ownerRequired, profileController.createProfile);
router.put("/users/:userId",authRequired, ownerRequired,profileController.updateProfile);


export default router;
