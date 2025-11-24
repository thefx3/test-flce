// questionRoutes.js
import { Router } from "express";
import adminQuestionController from "../controllers/adminQuestionController.js";
import authRequired from "../auth/authRequired.js";

const router = Router();

router.get("/", authRequired, adminQuestionController.getQuestions);
router.get("/:id", authRequired, adminQuestionController.getQuestion);

router.post("/", authRequired, adminQuestionController.createQuestion);
router.put("/:id", authRequired, adminQuestionController.updateQuestion);
router.delete("/:id", authRequired, adminQuestionController.deleteQuestion);

export default router;
