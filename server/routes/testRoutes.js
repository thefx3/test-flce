// testRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import testController from "../controllers/testController.js";
import ensureIsOwner from "../auth/ownerRequired.js";

const router = Router();

//Public 
router.get("/:userId", authRequired, ensureIsOwner, testController.getAllTests);
router.get("/:testId", authRequired, ensureIsOwner, testController.getSingleTest);
router.post("/",authRequired, ensureIsOwner, testController.createTest);
router.put("/:testId",authRequired, ensureIsOwner,testController.updateTest);

router.post("/:testId/responses", authRequired, testController.submitResponses);

//Admin
router.post("/:testId/grade-auto", authRequired, adminRequired, testController.gradeAuto);
router.post("/:testId/grade-manual", authRequired, adminRequired, testController.gradeManual);

router.get("/:testId/score", authRequired, adminRequired, testController.getScoreOfTest);
  
export default router;
