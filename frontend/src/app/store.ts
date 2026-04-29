import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "../features/employees/employeesSlice";
import feedbacksReducer from "../features/feedbacks/feedbacksSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";
import sessionReducer from "../features/session/sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    employees: employeesReducer,
    reviews: reviewsReducer,
    feedbacks: feedbacksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
