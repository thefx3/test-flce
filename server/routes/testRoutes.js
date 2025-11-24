// testRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import testController from "../controllers/testController.js";

const router = Router();

router.post("/user/:userId/create", authRequired, testController.createTest);
router.get("/user/:userId/get", authRequired, testController.getTests);
router.get("/:testId", authRequired, testController.getTest);
router.post("/:testId/responses", authRequired, testController.submitResponses);
router.post("/:testId/grade-auto", authRequired, testController.gradeAuto);
router.post("/:testId/grade-manual", authRequired, testController.gradeManual);

export default router;
