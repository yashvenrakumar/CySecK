import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAllFeedbacks,
  fetchFeedbacksByReviewer,
} from "../../features/feedbacks/feedbacksSlice";

 
export function useFeedbacks() {
  const dispatch = useAppDispatch();
  const adminList = useAppSelector((s) => s.feedbacks?.adminList ?? []);
  const myList = useAppSelector((s) => s.feedbacks?.myList ?? []);

  const getAllFeedbacks = useCallback(() => dispatch(fetchAllFeedbacks()), [dispatch]);

  const getFeedbacksForReviewer = useCallback(
    (reviewerId: string) => dispatch(fetchFeedbacksByReviewer(reviewerId)),
    [dispatch],
  );

  return {
    adminFeedbacks: adminList,
    myFeedbacks: myList,
    getAllFeedbacks,
    getFeedbacksForReviewer,
  };
}
