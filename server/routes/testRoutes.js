// testRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import testController from "../controllers/testController.js";

const router = Router();

// Create a test for a user
router.post("/start", testController.createTest);

// Get all tests of a user
router.get("/user/:userId", authRequired, testController.getTests);

// Get one test
router.get("/:testId", authRequired, testController.getTest);

// Save responses
router.post("/:testId/responses", authRequired, testController.submitResponses);

// Auto-grade (QCM + Video)
router.post("/:testId/grade-auto", authRequired, testController.gradeAuto);

// Manual-grade (Open Questions)
router.post("/:testId/grade-manual", authRequired, testController.gradeManual);

export default router;
