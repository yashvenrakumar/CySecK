import { Request, Response } from "express";
import {
  assignReviewer,
  createReview,
  listPendingReviewsForReviewer,
  listReviews,
  submitFeedback,
  updateReview,
} from "../services/reviewService";
import { fail, ok } from "../utils/apiResponse";

export const getReviews = (_req: Request, res: Response) => {
  res.json(ok("Reviews fetched", listReviews()));
};

export const postReview = (req: Request, res: Response) => {
  const review = createReview(req.body);
  res.status(201).json(ok("Review created", review));
};

export const patchReview = (req: Request, res: Response) => {
  const review = updateReview(String(req.params.id), req.body);
  if (!review) return res.status(404).json(fail("Review not found"));
  res.json(ok("Review updated", review));
};

export const postAssignReviewer = (req: Request, res: Response) => {
  const result = assignReviewer(String(req.params.id), req.body.reviewerId as string);
  if (!result.ok) {
    if (result.reason === "not_found") return res.status(404).json(fail("Review not found"));
    if (result.reason === "reviewer_not_in_directory") {
      return res
        .status(400)
        .json(fail("That person is not in the staff directory. Add them under Employees, then assign again."));
    }
    return res
      .status(400)
      .json(fail("Choose a different reviewer: they cannot review their own performance cycle"));
  }
  res.json(ok("Reviewer assigned", result.review));
};

export const getPendingReviews = (req: Request, res: Response) => {
  const reviewerId = String(req.params.reviewerId);
  res.json(ok("Pending reviews fetched", listPendingReviewsForReviewer(reviewerId)));
};

export const postFeedback = (req: Request, res: Response) => {
  const feedback = submitFeedback(String(req.params.id), req.body);
  if (!feedback) {
    return res.status(400).json(
      fail(
        "Feedback not accepted: review must be open, and you must be listed as an assigned reviewer for it",
      ),
    );
  }
  res.status(201).json(ok("Feedback submitted", feedback));
};
