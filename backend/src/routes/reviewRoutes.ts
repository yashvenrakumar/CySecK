import { Router } from "express";
import {
  getPendingReviews,
  getReviews,
  patchReview,
  postAssignReviewer,
  postFeedback,
  postReview,
} from "../controllers/reviewController";
import { requireRole } from "../middleware/rbac";
import { validateBody } from "../middleware/validate";
import {
  assignReviewerSchema,
  createReviewSchema,
  feedbackSchema,
  updateReviewSchema,
} from "../validations/reviewValidation";

const router = Router();

router.get("/", getReviews);
router.post("/", requireRole(["admin"]), validateBody(createReviewSchema), postReview);
router.patch("/:id", requireRole(["admin"]), validateBody(updateReviewSchema), patchReview);
router.post("/:id/assign", requireRole(["admin"]), validateBody(assignReviewerSchema), postAssignReviewer);
router.get("/pending/:reviewerId", requireRole(["employee", "admin"]), getPendingReviews);
router.post("/:id/feedback", requireRole(["employee", "admin"]), validateBody(feedbackSchema), postFeedback);

export default router;
