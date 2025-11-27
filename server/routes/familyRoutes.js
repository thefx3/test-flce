// routes/profilRoutes.js
import { Router } from "express";
import familyController from "../controllers/familyController.js";
import authRequired from "../auth/authRequired.js";
import adminRequired from "../auth/adminRequired.js";
import ownerRequired from "../auth/ownerRequired.js"

const router = Router();

//Public
router.get("/users/:userId/family", authRequired, ownerRequired, familyController.getSingleFamily);
router.post("/users/:userId/family",authRequired, ownerRequired, familyController.createFamily);
router.put("/users/:userId/family",authRequired, ownerRequired,familyController.updateFamily);

//Admin
router.get("/users/families", authRequired, adminRequired, familyController.getAllFamilies);
router.delete("/users/:userId/family", authRequired, adminRequired, familyController.deleteFamily);



export default router;
