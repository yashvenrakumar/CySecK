import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAllFeedbacks,
  fetchFeedbacksByReviewer,
  patchMyFeedback,
} from "../../features/feedbacks/feedbacksSlice";

/**
 * REST: `GET /api/feedbacks`, `PATCH /api/feedbacks/:id` (employee body.reviewerId = author)
 */
export function useFeedbacks() {
  const dispatch = useAppDispatch();
  const adminList = useAppSelector((s) => s.feedbacks?.adminList ?? []);
  const myList = useAppSelector((s) => s.feedbacks?.myList ?? []);

  const getAllFeedbacks = useCallback(() => dispatch(fetchAllFeedbacks()), [dispatch]);

  const getFeedbacksForReviewer = useCallback(
    (reviewerId: string) => dispatch(fetchFeedbacksByReviewer(reviewerId)),
    [dispatch],
  );

  const updateMyFeedback = useCallback(
    (args: { feedbackId: string; reviewerId: string; comment: string; rating: number }) =>
      dispatch(patchMyFeedback(args)),
    [dispatch],
  );

  return {
    adminFeedbacks: adminList,
    myFeedbacks: myList,
    getAllFeedbacks,
    getFeedbacksForReviewer,
    updateMyFeedback,
  };
}
