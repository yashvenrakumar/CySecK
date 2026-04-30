import { Router } from "express";
import { getFeedbacks } from "../controllers/feedbackController";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.get("/", requireRole(["admin", "employee"]), getFeedbacks);

export default router;
