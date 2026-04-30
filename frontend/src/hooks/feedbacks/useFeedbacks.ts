import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, FeedbackEnriched } from "../../shared/types";

type AsyncAction<T> = { unwrap: () => Promise<T> };
const asAction = <T,>(promise: Promise<T>): AsyncAction<T> => ({ unwrap: () => promise });

export function useFeedbacks() {
  const [adminList, setAdminList] = useState<FeedbackEnriched[]>([]);
  const [myList, setMyList] = useState<FeedbackEnriched[]>([]);

  const getAllFeedbacks = useCallback(() => {
    const task = api.get<ApiResponse<FeedbackEnriched[]>>("/feedbacks", withRole("admin")).then((res) => {
      const data = res.data?.data;
      const rows = Array.isArray(data) ? (data as FeedbackEnriched[]) : [];
      setAdminList(rows);
      return rows;
    });
    return asAction(task);
  }, []);

  const getFeedbacksForReviewer = useCallback(
    (reviewerId: string) => {
      const task = api
        .get<ApiResponse<FeedbackEnriched[]>>("/feedbacks", {
          ...withRole("employee"),
          params: { reviewerId },
        })
        .then((res) => {
          const data = res.data?.data;
          const rows = Array.isArray(data) ? (data as FeedbackEnriched[]) : [];
          setMyList(rows);
          return rows;
        });
      return asAction(task);
    },
    [],
  );

  return {
    adminFeedbacks: adminList,
    myFeedbacks: myList,
    getAllFeedbacks,
    getFeedbacksForReviewer,
  };
}
