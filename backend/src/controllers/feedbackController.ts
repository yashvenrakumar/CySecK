import { Request, Response } from "express";
import { listFeedbacksEnriched } from "../services/feedbackService";
import { updateFeedbackByReviewer } from "../services/reviewService";
import { fail, ok } from "../utils/apiResponse";

export const getFeedbacks = (req: Request, res: Response) => {
  const role = req.userRole;
  if (role === "admin") {
    return res.json(ok("Feedbacks fetched", listFeedbacksEnriched()));
  }
  if (role === "employee") {
    const reviewerId = typeof req.query.reviewerId === "string" ? req.query.reviewerId.trim() : "";
    if (!reviewerId) {
      return res.status(400).json(fail("Query parameter reviewerId is required"));
    }
    return res.json(ok("Feedbacks fetched", listFeedbacksEnriched(reviewerId)));
  }
  return res.status(403).json(fail("Forbidden: set x-role to admin or employee"));
};

export const patchFeedback = (req: Request, res: Response) => {
  const result = updateFeedbackByReviewer(String(req.params.id), req.body);
  if (!result.ok) {
    if (result.reason === "not_found") return res.status(404).json(fail("Feedback not found"));
    if (result.reason === "forbidden") return res.status(403).json(fail("You can only edit your own feedback"));
    if (result.reason === "review_missing") return res.status(400).json(fail("Review no longer exists"));
    return res.status(400).json(fail("This review is closed; feedback can no longer be edited"));
  }
  res.json(ok("Feedback updated", result.feedback));
};
