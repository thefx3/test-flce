//authRoute.js
import { Router } from "express";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

// Can register only if you are registered - from an ADMIN account with a code
router.post('/register', authRequired, authController.register);

// Login route
router.post('/login', authController.login);

// Me route, once authenticated
router.get('/me', authRequired, authController.loginSuccess);

export default router;
