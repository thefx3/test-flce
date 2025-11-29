// routes/questionRoutes.js
import { Router } from "express";
import questionController from "../controllers/questionController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";

const router = Router();

router.get("/Open", questionController.getQuestionsOPENPublic); //To do
router.get("/Video", questionController.getQuestionsVIDEOPublic); //To do
router.get("/QCM", questionController.getQuestionsQCMPublic); //To do

router.get("/", questionController.getAllQuestionsPublic);
router.get("/:questionId", questionController.getSingleQuestionPublic);

export default router;
