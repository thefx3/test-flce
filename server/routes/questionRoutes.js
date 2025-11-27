// routes/questionRoutes.js
import { Router } from "express";
import questionController from "../controllers/questionController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";

const router = Router();

// List all questions (with corrections) - ADMIN ONLY
router.get("/", questionController.getAllQuestionsPublic);
router.get("/:questionId", questionController.getSingleQuestionPublic);

export default router;
