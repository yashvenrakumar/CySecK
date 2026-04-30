import { Request, Response } from "express";
import { listFeedbacksEnriched } from "../services/feedbackService";
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
