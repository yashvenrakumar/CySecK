import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, Review, Role } from "../../shared/types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

  const getReviews = useCallback(() => {
    const p = api.get<ApiResponse<Review[]>>("/reviews").then((res) => {
      const list = res.data?.data;
      const rows = Array.isArray(list) ? list : [];
      setReviews(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const postReview = useCallback(
    (body: Omit<Review, "id" | "createdAt" | "updatedAt">, roleForApi: Role = "admin") => {
      const p = api.post<ApiResponse<Review>>("/reviews", body, withRole(roleForApi)).then((res) => {
        const row = res.data.data as Review;
        setReviews((prev) => [...prev, row]);
        return row;
      });
      return { unwrap: () => p };
    },
    [],
  );

  const patchReview = useCallback((reviewId: string, status: "open" | "closed", role: Role = "admin") => {
    const p = api.patch<ApiResponse<Review>>(`/reviews/${reviewId}`, { status }, withRole(role)).then((res) => {
      const row = res.data.data as Review;
      setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const postReviewAssign = useCallback((reviewId: string, reviewerId: string, role: Role = "admin") => {
    const p = api
      .post<ApiResponse<Review>>(`/reviews/${reviewId}/assign`, { reviewerId }, withRole(role))
      .then((res) => {
        const row = res.data.data as Review;
        setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        return row;
      });
    return { unwrap: () => p };
  }, []);

  const getPendingReviews = useCallback((reviewerId: string) => {
    const p = api
      .get<ApiResponse<Review[]>>(`/reviews/pending/${reviewerId}`, withRole("employee"))
      .then((res) => {
        const list = res.data?.data;
        const rows = Array.isArray(list) ? list : [];
        setPendingReviews(rows);
        return rows;
      });
    return { unwrap: () => p };
  }, []);

  const postReviewFeedback = useCallback(
    (args: { reviewId: string; reviewerId: string; comment: string; rating: number }) => {
      const p = api.post(`/reviews/${args.reviewId}/feedback`, args, withRole("employee")).then(() => {
        setPendingReviews((prev) => prev.filter((r) => r.id !== args.reviewId));
        return args.reviewId;
      });
      return { unwrap: () => p };
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
