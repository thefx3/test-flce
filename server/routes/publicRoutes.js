// routes/publicRoutes.js
import { Router } from "express";
import publicController from "../controllers/publicController.js";
import testSessionRequired from "../auth/testSessionRequired.js";
import questionController from "../controllers/questionController.js";
import testController from "../controllers/testController.js";

const router = Router();

// Start a new test (PUBLIC - creates user + test + returns a session token)
router.post("/start-test", publicController.startTest);

// Public questions list
router.get("/questions/OPEN", questionController.getQuestionsOPENPublic);
router.get("/questions/VIDEO", questionController.getQuestionsVIDEOPublic);
router.get("/questions/QCM", questionController.getQuestionsQCMPublic);

router.post("/tests/:testId/responses", testSessionRequired, publicController.submitResponses);
router.post("/tests/:testId/comment", testSessionRequired, publicController.submitComment);

router.put("/tests/:testId/grade-auto", testController.gradeAuto);

export default router;
