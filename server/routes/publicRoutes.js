// routes/publicRoutes.js
import { Router } from "express";
import publicController from "../controllers/publicController.js";
import testSessionRequired from "../auth/testSessionRequired.js";

const router = Router();

// Start a new test (PUBLIC - creates user + test + returns a session token)
router.post("/start-test", publicController.startTest);

router.post("/tests/:testId/responses", testSessionRequired, publicController.submitResponses);

export default router;
