import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, FeedbackEnriched } from "../../shared/types";

export function useFeedbacks() {
  // two lists: admin sees all, employee page only "mine"
  const [adminFeedbacks, setAdminFeedbacks] = useState<FeedbackEnriched[]>([]);
  const [myFeedbacks, setMyFeedbacks] = useState<FeedbackEnriched[]>([]);

  const getAllFeedbacks = useCallback(() => {
    const p = api.get<ApiResponse<FeedbackEnriched[]>>("/feedbacks", withRole("admin")).then((res) => {
      const list = res.data?.data;
      const rows = Array.isArray(list) ? list : [];
      setAdminFeedbacks(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const getFeedbacksForReviewer = useCallback((reviewerId: string) => {
    const p = api
      .get<ApiResponse<FeedbackEnriched[]>>("/feedbacks", {
        ...withRole("employee"),
        params: { reviewerId },
      })
      .then((res) => {
        const list = res.data?.data;
        const rows = Array.isArray(list) ? list : [];
        setMyFeedbacks(rows);
        return rows;
      });
    return { unwrap: () => p };
  }, []);

  return {
    adminFeedbacks,
    myFeedbacks,
    getAllFeedbacks,
    getFeedbacksForReviewer,
  };
}
