//authRoute.js
import { Router } from "express";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";

const router = Router();

// Register (admin only via controller)
router.post('/register', authRequired, adminRequired, authController.register);

// Login
router.post('/login', authController.login);

// Me
router.get('/me', authRequired, authController.loginSuccess);

export default router;
