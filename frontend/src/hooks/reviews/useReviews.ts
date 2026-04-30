import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  assignReviewerToReview,
  createReview,
  fetchPendingReviews,
  fetchReviews,
  submitReviewFeedback,
  updateReviewStatus,
} from "../../features/reviews/reviewsSlice";
import type { Review, Role } from "../../shared/types";

 
export function useReviews() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((s) => s.reviews?.items ?? []);
  const pendingReviews = useAppSelector((s) => s.reviews?.pending ?? []);

 
  const getReviews = useCallback(() => dispatch(fetchReviews()), [dispatch]);

 
  const postReview = useCallback(
    (
      body: Omit<Review, "id" | "createdAt" | "updatedAt">,
      roleForApi: Role = "admin",
    ) => dispatch(createReview({ ...body, roleForApi })),
    [dispatch],
  );

   const patchReview = useCallback(
    (reviewId: string, status: "open" | "closed", role: Role = "admin") =>
      dispatch(updateReviewStatus({ reviewId, status, role })),
    [dispatch],
  );

   const postReviewAssign = useCallback(
    (reviewId: string, reviewerId: string, role: Role = "admin") =>
      dispatch(assignReviewerToReview({ reviewId, reviewerId, role })),
    [dispatch],
  );

   const getPendingReviews = useCallback(
    (reviewerId: string) => dispatch(fetchPendingReviews(reviewerId)),
    [dispatch],
  );

   const postReviewFeedback = useCallback(
    (args: { reviewId: string; reviewerId: string; comment: string; rating: number }) =>
      dispatch(submitReviewFeedback(args)),
    [dispatch],
  );

  return {
    reviews,
    pendingReviews,
    getReviews,
    postReview,
    patchReview,
    postReviewAssign,
    getPendingReviews,
    postReviewFeedback,
  };
}
