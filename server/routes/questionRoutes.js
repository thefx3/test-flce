// routes/questionRoutes.js
import { Router } from "express";
import adminQuestionController from "../controllers/adminQuestionController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

// Admin only: list questions
router.get("/get", adminQuestionController.getQuestions);

// Admin only: get question
router.get("/:questionId/get", adminQuestionController.getQuestion);

// Create new question
router.post("/create", authRequired, adminQuestionController.createQuestion);

// Update question
router.put("/:questionId/update", authRequired, adminQuestionController.updateQuestion);

// Delete question
router.delete("/:questionId/delete", authRequired, adminQuestionController.deleteQuestion);

export default router;
