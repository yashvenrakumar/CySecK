import { Router } from "express";
import { getFeedbacks, patchFeedback } from "../controllers/feedbackController";
import { requireRole } from "../middleware/rbac";
import { validateBody } from "../middleware/validate";
import { feedbackUpdateSchema } from "../validations/reviewValidation";

const router = Router();

router.get("/", requireRole(["admin", "employee"]), getFeedbacks);
router.patch(
  "/:id",
  requireRole(["employee", "admin"]),
  validateBody(feedbackUpdateSchema),
  patchFeedback,
);

export default router;
