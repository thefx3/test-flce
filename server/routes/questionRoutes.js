// routes/questionRoutes.js
import { Router } from "express";
import questionController from "../controllers/questionController.js";

const router = Router();

//Public
router.get("/Open", questionController.getQuestionsOPENPublic);
router.get("/Video", questionController.getQuestionsVIDEOPublic);
router.get("/QCM", questionController.getQuestionsQCMPublic);

router.get("/", questionController.getAllQuestionsPublic);
router.get("/:questionId", questionController.getSingleQuestionPublic);

export default router;
