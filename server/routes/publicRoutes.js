// routes/publicRoutes.js
import { Router } from "express";
import publicController from "../controllers/publicController.js";
import testSessionRequired from "../auth/testSessionRequired.js";

const router = Router();

// Get all questions (PUBLIC, without corrections)
router.get("/questions", publicController.getQuestions);

// Get single question (PUBLIC, without corrections)
router.get("/questions/:questionId", publicController.getQuestion);

// Start a new test (PUBLIC - creates user + test + returns a session token)
router.post("/start-test", publicController.startTest);

// Submit responses for an anonymous test
// We expect a "test session token" to protect against random tampering
router.post(
  "/tests/:testId/responses",
  testSessionRequired,
  publicController.submitResponses
);

export default router;
