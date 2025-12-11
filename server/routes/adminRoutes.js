//adminRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js"
import userController from "../controllers/userController.js";
import profileController from "../controllers/profileController.js";
import familyController from "../controllers/familyController.js";
import testController from "../controllers/testController.js";
import questionController from "../controllers/questionController.js";
import authController from "../controllers/authController.js";

const router = Router();

// --- ADMINS --- (Admin Users)
// Registration is handled publicly in /auth/register so the first admin can be created
router.get("/admins", userController.getAllAdmins);
router.post("/admins/register", authController.register);
router.get("/admins/:userId", userController.getSingleAdmin);
router.put("/admins/:userId", userController.updateAdmin);
router.delete("/admins/:userId", userController.deleteAdmin);


// --- USERS --- (Test Users)
router.post("/users", userController.createTestUser); //Public
router.get("/users", userController.getAllUsers); 
router.get("/users/:userId", userController.getSingleUser); //Public
router.put("/users/:userId", userController.updateUser); //Public 
router.delete("/users/:userId", userController.deleteUser);


//--- PROFILE ---
router.post("/users/:userId/profile", authRequired, adminRequired, profileController.createProfile); //Public
router.get("/users/profiles", authRequired, adminRequired, profileController.getAllProfiles);
router.get("/users/:userId/profile", authRequired, adminRequired, profileController.getSingleProfile); //Public
router.put("/users/:userId/profile", authRequired, adminRequired, profileController.updateProfile); //Public
router.delete("/users/:userId/profile", authRequired, adminRequired, profileController.deleteProfile)
router.put("/users/:userId/profile/level", authRequired, adminRequired, profileController.setLevel);


// --- FAMILY ---
router.post("/users/:userId/family", authRequired, adminRequired, familyController.createFamily); //Public
router.get("/users/families", authRequired, adminRequired, familyController.getAllFamilies);
router.get("/users/:userId/family", authRequired, adminRequired, familyController.getSingleFamily); //Public
router.put("/users/:userId/family", authRequired, adminRequired, familyController.updateFamily); //Public
router.delete("/users/:userId/family", authRequired, adminRequired, familyController.deleteFamily)


// --- TESTS --- 
router.get("/tests/count", authRequired, adminRequired, testController.countAllTestsAdmin);
router.get("/tests/to-grade/count", authRequired, adminRequired, testController.countAllTestsToGradeAdmin);

router.get("/tests", authRequired, adminRequired, testController.getAllTestsAdmin);
router.post("/users/:userId/tests", authRequired, adminRequired, testController.createTest);
router.get("/users/:userId/tests", authRequired, adminRequired, testController.getAllTests);
router.get("/users/:userId/tests/:testId", authRequired, adminRequired, testController.getSingleTest); //Public
router.put("/users/:userId/tests/:testId", authRequired, adminRequired, testController.updateTest); //Public
router.delete("/users/:userId/tests/:testId", authRequired, adminRequired, testController.deleteTest);
router.get("/users/:userId/tests/:testId/score", authRequired, adminRequired, testController.getScoreOfTest);


// --- GRADES ---
router.put("/tests/:testId/corrected", authRequired, adminRequired, testController.finalizeGrading);
router.put("/tests/:testId/auto-grade", authRequired, adminRequired, testController.gradeAuto);
router.put("/tests/:testId/manual-grade", authRequired, adminRequired, testController.gradeManual);
router.put("/users/:userId/tests/:testId/auto-grade", authRequired, adminRequired, testController.gradeAuto);
router.put("/users/:userId/tests/:testId/manual-grade", authRequired, adminRequired, testController.gradeManual);


// --- QUESTIONS --- 
router.post("/questions", authRequired, adminRequired, questionController.createQuestion);
router.get("/questions", authRequired, adminRequired, questionController.getAllQuestionsAdmin);
router.get("/questions/:questionId", authRequired, adminRequired, questionController.getSingleQuestionAdmin);
router.put("/questions/:questionId", authRequired, adminRequired, questionController.updateQuestion);
router.delete("/questions/:questionId", authRequired, adminRequired, questionController.deleteQuestion);
router.get("/tests/:testId/questions/:questionId", authRequired, adminRequired, questionController.getScoreQuestion);

export default router;
