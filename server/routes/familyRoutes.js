// routes/familyRoutes.js
import { Router } from "express";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import familyController from "../controllers/familyController.js";

const router = Router();

router.post("/", authRequired, adminRequired, familyController.addFamily);
router.get("/", authRequired, adminRequired, familyController.getFamilies);
router.put("/:familyId", authRequired, adminRequired, familyController.updateFamily);
router.delete("/:familyId", authRequired, adminRequired, familyController.deleteFamily);


export default router;
