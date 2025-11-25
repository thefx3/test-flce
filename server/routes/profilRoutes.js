// routes/profilRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import profileController from "../controllers/profileController.js";

const router = Router();

router.get(
  "/user/:userId",
  authRequired,
  profileController.ensureOwnProfile,
  profileController.getProfile
);

router.post(
  "/user/:userId",
  authRequired,
  profileController.ensureOwnProfile,
  profileController.createProfile
);

router.put(
  "/user/:userId",
  authRequired,
  profileController.ensureOwnProfile,
  profileController.updateProfile
);

export default router;
