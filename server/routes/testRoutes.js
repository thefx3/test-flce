// testRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import testController from "../controllers/testController.js";

const router = Router();

// ADMIN creates test manually for a user
router.post("/create/:userId", authRequired, adminRequired, testController.createTest);

// ADMIN sees all tests
router.get("/", authRequired, adminRequired, testController.getAllTests);

// ADMIN views test (with corrections)
router.get("/:testId", authRequired, adminRequired, testController.getTest);

// DELETE SINGLE TEST
router.delete("/:testId", authRequired, adminRequired, testController.deleteTest);

// USER logged-in submits answers (optional feature)
router.post("/:testId/responses", authRequired, testController.submitResponses);

// ADMIN grading
router.post("/:testId/grade-auto", authRequired, adminRequired, testController.gradeAuto);
router.post("/:testId/grade-manual", authRequired, adminRequired, testController.gradeManual);



// Score one question
router.get(
    "/:testId/question/:questionId/score",
    authRequired,
    adminRequired,
    testController.getScoreOfQuestion
  );
  
  // Score total test
  router.get(
    "/:testId/score",
    authRequired,
    adminRequired,
    testController.getScoreOfTest
  );
  
export default router;
