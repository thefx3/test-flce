// routes/questionRoutes.js
import { Router } from "express";
import questionController from "../controllers/questionController.js";

const router = Router();

//Public
router.get("/OPEN", questionController.getQuestionsOPENPublic);
router.get("/VIDEO", questionController.getQuestionsVIDEOPublic);
router.get("/QCM", questionController.getQuestionsQCMPublic);

router.get("/:questionId", questionController.getSingleQuestionPublic);

export default router;
