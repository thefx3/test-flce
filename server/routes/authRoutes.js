//authRoute.js
import { Router } from "express";
import authController from "../controllers/authController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

//Admin Login

router.post('/register', authController.register); 

router.post('/login', authController.login);

//User Login
router.post('/login-user', authController.loginUser);

// Me
router.get('/me', authRequired, authController.loginSuccess);

export default router;
