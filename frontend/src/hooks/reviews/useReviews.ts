import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, Review, Role } from "../../shared/types";

type AsyncAction<T> = { unwrap: () => Promise<T> };
const asAction = <T,>(promise: Promise<T>): AsyncAction<T> => ({ unwrap: () => promise });

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

  const getReviews = useCallback(() => {
    const task = api.get<ApiResponse<Review[]>>("/reviews").then((res) => {
      const data = res.data?.data;
      const rows = Array.isArray(data) ? (data as Review[]) : [];
      setReviews(rows);
      return rows;
    });
    return asAction(task);
  }, []);

  const postReview = useCallback(
    (
      body: Omit<Review, "id" | "createdAt" | "updatedAt">,
      roleForApi: Role = "admin",
    ) => {
      const task = api.post<ApiResponse<Review>>("/reviews", body, withRole(roleForApi)).then((res) => {
        const row = res.data?.data as Review;
        setReviews((prev) => [...prev, row]);
        return row;
      });
      return asAction(task);
    },
    [],
  );

  const patchReview = useCallback(
    (reviewId: string, status: "open" | "closed", role: Role = "admin") => {
      const task = api.patch<ApiResponse<Review>>(`/reviews/${reviewId}`, { status }, withRole(role)).then((res) => {
        const row = res.data?.data as Review;
        setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        return row;
      });
      return asAction(task);
    },
    [],
  );

  const postReviewAssign = useCallback(
    (reviewId: string, reviewerId: string, role: Role = "admin") => {
      const task = api
        .post<ApiResponse<Review>>(`/reviews/${reviewId}/assign`, { reviewerId }, withRole(role))
        .then((res) => {
        const row = res.data?.data as Review;
        setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        return row;
      });
      return asAction(task);
    },
    [],
  );

  const getPendingReviews = useCallback(
    (reviewerId: string) => {
      const task = api.get<ApiResponse<Review[]>>(`/reviews/pending/${reviewerId}`, withRole("employee")).then((res) => {
        const data = res.data?.data;
        const rows = Array.isArray(data) ? (data as Review[]) : [];
        setPendingReviews(rows);
        return rows;
      });
      return asAction(task);
    },
    [],
  );

  const postReviewFeedback = useCallback(
    (args: { reviewId: string; reviewerId: string; comment: string; rating: number }) => {
      const task = api
        .post(`/reviews/${args.reviewId}/feedback`, args, withRole("employee"))
        .then(() => {
          setPendingReviews((prev) => prev.filter((r) => r.id !== args.reviewId));
          return args.reviewId;
        });
      return asAction(task);
    },
    [],
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
