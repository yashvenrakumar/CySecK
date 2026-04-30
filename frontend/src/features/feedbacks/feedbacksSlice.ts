import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, withRole } from "../../shared/api/client";
import type { FeedbackEnriched } from "../../shared/types";

export const fetchAllFeedbacks = createAsyncThunk("feedbacks/fetchAll", async () => {
  const res = await api.get("/feedbacks", withRole("admin"));
  const data = res.data?.data;
  return Array.isArray(data) ? (data as FeedbackEnriched[]) : [];
});

export const fetchFeedbacksByReviewer = createAsyncThunk(
  "feedbacks/fetchByReviewer",
  async (reviewerId: string) => {
    const res = await api.get("/feedbacks", {
      ...withRole("employee"),
      params: { reviewerId },
    });
    const data = res.data?.data;
    return Array.isArray(data) ? (data as FeedbackEnriched[]) : [];
  },
);

interface FeedbacksState {
  adminList: FeedbackEnriched[];
  myList: FeedbackEnriched[];
}

const initialState: FeedbacksState = { adminList: [], myList: [] };

const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFeedbacks.fulfilled, (state, action) => {
      state.adminList = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchFeedbacksByReviewer.fulfilled, (state, action) => {
      state.myList = Array.isArray(action.payload) ? action.payload : [];
    });
  },
});

export default feedbacksSlice.reducer;
