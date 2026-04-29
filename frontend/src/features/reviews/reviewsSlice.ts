import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, withRole } from "../../shared/api/client";
import type { Review, Role } from "../../shared/types";

export const fetchReviews = createAsyncThunk("reviews/fetch", async () => {
  const res = await api.get("/reviews");
  const data = res.data?.data;
  return Array.isArray(data) ? (data as Review[]) : [];
});

export const fetchPendingReviews = createAsyncThunk("reviews/pending", async (reviewerId: string) => {
  const res = await api.get(`/reviews/pending/${reviewerId}`, withRole("employee"));
  const data = res.data?.data;
  return Array.isArray(data) ? (data as Review[]) : [];
});

export const createReview = createAsyncThunk(
  "reviews/create",
  async (payload: Omit<Review, "id" | "createdAt" | "updatedAt"> & { roleForApi: Role }) => {
    const { roleForApi, ...body } = payload;
    const res = await api.post("/reviews", body, withRole(roleForApi));
    return res.data.data as Review;
  },
);

export const assignReviewerToReview = createAsyncThunk(
  "reviews/assign",
  async ({ reviewId, reviewerId, role }: { reviewId: string; reviewerId: string; role: Role }) => {
    const res = await api.post(`/reviews/${reviewId}/assign`, { reviewerId }, withRole(role));
    return res.data.data as Review;
  },
);

export const updateReviewStatus = createAsyncThunk(
  "reviews/update-status",
  async ({ reviewId, status, role }: { reviewId: string; status: "open" | "closed"; role: Role }) => {
    const res = await api.patch(`/reviews/${reviewId}`, { status }, withRole(role));
    return res.data.data as Review;
  },
);

export const submitReviewFeedback = createAsyncThunk(
  "reviews/feedback",
  async ({
    reviewId,
    reviewerId,
    comment,
    rating,
  }: {
    reviewId: string;
    reviewerId: string;
    comment: string;
    rating: number;
  }) => {
    await api.post(`/reviews/${reviewId}/feedback`, { reviewerId, comment, rating }, withRole("employee"));
    return reviewId;
  },
);

interface ReviewsState {
  items: Review[];
  pending: Review[];
}

const initialState: ReviewsState = { items: [], pending: [] };

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      if (action.payload) state.items.push(action.payload);
    });
    builder.addCase(assignReviewerToReview.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      const p = action.payload;
      if (!p?.id) return;
      state.items = state.items.map((r) => (r.id === p.id ? p : r));
    });
    builder.addCase(updateReviewStatus.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      const p = action.payload;
      if (!p?.id) return;
      state.items = state.items.map((r) => (r.id === p.id ? p : r));
    });
    builder.addCase(fetchPendingReviews.fulfilled, (state, action) => {
      state.pending = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(submitReviewFeedback.fulfilled, (state, action) => {
      if (!Array.isArray(state.pending)) state.pending = [];
      state.pending = state.pending.filter((r) => r.id !== action.payload);
    });
  },
});

export default reviewsSlice.reducer;
