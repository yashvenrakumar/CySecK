import { useCallback, useState } from "react";
import { API_PREFIX } from "../../shared/config/env";
import type { ApiResponse, Review, Role } from "../../shared/types";

async function readJson(res: Response) {
  return (await res.json().catch(() => ({}))) as { message?: string };
}

function roleHeaders(role: Role) {
  return {
    "Content-Type": "application/json",
    "x-role": role,
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

  const getReviews = useCallback(() => {
    const p = fetch(`${API_PREFIX}/reviews`).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Review[]>;
      if (!res.ok) throw new Error(json?.message || "Could not load reviews");
      const list = json?.data;
      const rows = Array.isArray(list) ? list : [];
      setReviews(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const postReview = useCallback(
    (body: Omit<Review, "id" | "createdAt" | "updatedAt">, roleForApi: Role = "admin") => {
      const p = fetch(`${API_PREFIX}/reviews`, {
        method: "POST",
        headers: roleHeaders(roleForApi),
        body: JSON.stringify(body),
      }).then(async (res) => {
        const json = (await readJson(res)) as ApiResponse<Review>;
        if (!res.ok) throw new Error(json?.message || "Could not create review");
        const row = json.data as Review;
        setReviews((prev) => [...prev, row]);
        return row;
      });
      return { unwrap: () => p };
    },
    [],
  );

  const patchReview = useCallback((reviewId: string, status: "open" | "closed", role: Role = "admin") => {
    const p = fetch(`${API_PREFIX}/reviews/${reviewId}`, {
      method: "PATCH",
      headers: roleHeaders(role),
      body: JSON.stringify({ status }),
    }).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Review>;
      if (!res.ok) throw new Error(json?.message || "Could not update review");
      const row = json.data as Review;
      setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const postReviewAssign = useCallback((reviewId: string, reviewerId: string, role: Role = "admin") => {
    const p = fetch(`${API_PREFIX}/reviews/${reviewId}/assign`, {
      method: "POST",
      headers: roleHeaders(role),
      body: JSON.stringify({ reviewerId }),
    }).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Review>;
      if (!res.ok) throw new Error(json?.message || "Could not assign reviewer");
      const row = json.data as Review;
        setReviews((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        return row;
    });
    return { unwrap: () => p };
  }, []);

  const getPendingReviews = useCallback((reviewerId: string) => {
    const p = fetch(`${API_PREFIX}/reviews/pending/${reviewerId}`, {
      headers: roleHeaders("employee"),
    }).then(async (res) => {
        const json = (await readJson(res)) as ApiResponse<Review[]>;
        if (!res.ok) throw new Error(json?.message || "Could not load pending reviews");
        const list = json?.data;
        const rows = Array.isArray(list) ? list : [];
        setPendingReviews(rows);
        return rows;
    });
    return { unwrap: () => p };
  }, []);

  const postReviewFeedback = useCallback(
    (args: { reviewId: string; reviewerId: string; comment: string; rating: number }) => {
      const p = fetch(`${API_PREFIX}/reviews/${args.reviewId}/feedback`, {
        method: "POST",
        headers: roleHeaders("employee"),
        body: JSON.stringify(args),
      }).then(async (res) => {
        const json = await readJson(res);
        if (!res.ok) throw new Error(json?.message || "Could not submit feedback");
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
