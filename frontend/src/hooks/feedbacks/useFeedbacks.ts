import { useCallback, useState } from "react";
import { API_PREFIX } from "../../shared/config/env";
import type { ApiResponse, FeedbackEnriched, Role } from "../../shared/types";

async function readJson(res: Response) {
  return (await res.json().catch(() => ({}))) as { message?: string };
}

function roleHeaders(role: Role) {
  return {
    "Content-Type": "application/json",
    "x-role": role,
  };
}

export function useFeedbacks() {
  const [adminFeedbacks, setAdminFeedbacks] = useState<FeedbackEnriched[]>([]);
  const [myFeedbacks, setMyFeedbacks] = useState<FeedbackEnriched[]>([]);

  const getAllFeedbacks = useCallback(() => {
    const p = fetch(`${API_PREFIX}/feedbacks`, {
      headers: roleHeaders("admin"),
    }).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<FeedbackEnriched[]>;
      if (!res.ok) throw new Error(json?.message || "Could not load feedback log");
      const list = json?.data;
      const rows = Array.isArray(list) ? list : [];
      setAdminFeedbacks(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const getFeedbacksForReviewer = useCallback((reviewerId: string) => {
    const q = new URLSearchParams({ reviewerId }).toString();
    const p = fetch(`${API_PREFIX}/feedbacks?${q}`, {
      headers: roleHeaders("employee"),
    }).then(async (res) => {
        const json = (await readJson(res)) as ApiResponse<FeedbackEnriched[]>;
        if (!res.ok) throw new Error(json?.message || "Could not load my feedbacks");
        const list = json?.data;
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
