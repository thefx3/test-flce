// questionRoutes.js
import { Router } from "express";
import adminQuestionController from "../controllers/adminQuestionController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

router.get("/all", authRequired, adminQuestionController.getQuestions);
router.get("/:questionId/get", authRequired, adminQuestionController.getQuestion);

router.post("/", authRequired, adminQuestionController.createQuestion);
router.put("/:questionId/update", authRequired, adminQuestionController.updateQuestion);
router.delete("/:questionId/delete", authRequired, adminQuestionController.deleteQuestion);

export default router;
