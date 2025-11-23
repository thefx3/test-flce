const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const authRequired = require("../auth/auth");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authRequired, authController.loginSuccess);

module.exports = router;
