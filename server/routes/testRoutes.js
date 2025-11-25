// testRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import testController from "../controllers/testController.js";

const router = Router();

// ADMIN creates test manually for a user
router.post("/create/:userId", authRequired, adminRequired, testController.createTest);

// USER sees his own tests
router.get("/user/:userId", authRequired, testController.getTests);


// ADMIN views test (with corrections)
router.get("/:testId", authRequired, adminRequired, testController.getTest);

// USER logged-in submits answers (optional feature)
router.post("/:testId/responses", authRequired, testController.submitResponses);


// ADMIN grading
router.post("/:testId/grade-auto", authRequired, adminRequired, testController.gradeAuto);
router.post("/:testId/grade-manual", authRequired, adminRequired, testController.gradeManual);

export default router;
