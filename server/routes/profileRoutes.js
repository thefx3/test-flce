// routes/profilRoutes.js
import { Router } from "express";
import profileController from "../controllers/profileController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//Public
router.get("/users/:userId/profile", authRequired, ownerRequired, profileController.getProfile);
router.post("/users/:userId/profile",authRequired, ownerRequired, profileController.createProfile);
router.put("/users/:userId/profile",authRequired, ownerRequired,profileController.updateProfile);


//Admin
router.delete("/users/:userId/profile", authRequired, ownerRequired, profileController.deleteProfile);
router.patch("/:userId/profile/level",authRequired, adminRequired, profileController.setLevel);

//Public routes with Admin permissions
router.get("/users/:userId/profile", authRequired, ownerRequired, profileController.getProfile);
router.post("/users/:userId/profile",authRequired, ownerRequired, profileController.createProfile);
router.put("/users/:userId/profile",authRequired, ownerRequired,profileController.updateProfile);



export default router;
