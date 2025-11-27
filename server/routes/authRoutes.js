//authRoute.js
import { Router } from "express";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";

const router = Router();

// Register - only from an Admin account
router.post('/register', authRequired, adminRequired, authController.register);

// Login
// Admin Login
router.post('/login', authController.login);

//User Login
router.post('/login-user', authController.loginUser);

// Me
router.get('/me', authRequired, authController.loginSuccess);

export default router;
