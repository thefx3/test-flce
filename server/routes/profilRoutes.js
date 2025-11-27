// routes/profilRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import profileController from "../controllers/profileController.js";

const router = Router();

router.get("/user/:userId", authRequired, profileController.ensureOwnProfile, profileController.getProfile);

router.post("/user/:userId",authRequired,profileController.ensureOwnProfile, profileController.createProfile);

router.put("/user/:userId",authRequired,profileController.ensureOwnProfile,profileController.updateProfile);

router.patch("/:userId/level",authRequired, adminRequired, profileController.setLevel);


export default router;
