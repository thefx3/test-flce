// routes/questionRoutes.js
import { Router } from "express";
import questionController from "../controllers/questionController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";

const router = Router();

// List all questions (with corrections) - ADMIN ONLY
router.get(
  "/",
  authRequired,
  adminRequired,
  questionController.getAllQuestionsAdmin
);

// Get a single question (with corrections) - ADMIN ONLY
router.get(
  "/:questionId",
  authRequired,
  adminRequired,
  questionController.getQuestionAdmin
);

// Create new question - ADMIN ONLY
router.post(
  "/",
  authRequired,
  adminRequired,
  questionController.createQuestion
);

// Update question - ADMIN ONLY
router.put(
  "/:questionId",
  authRequired,
  adminRequired,
  questionController.updateQuestion
);

// Delete question - ADMIN ONLY
router.delete(
  "/:questionId",
  authRequired,
  adminRequired,
  questionController.deleteQuestion
);

export default router;
