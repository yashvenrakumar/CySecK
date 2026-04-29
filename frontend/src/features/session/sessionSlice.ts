import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  employeeId: string;
}

const initialState: SessionState = {
  /** Set from first loaded employee on My feedback (avoids stale ids like "e3" vs UUID DB). */
  employeeId: "",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setEmployeeId(state, action: PayloadAction<string>) {
      state.employeeId = action.payload;
    },
    clearEmployeeIdentity(state) {
      state.employeeId = "";
    },
  },
});

export const { setEmployeeId, clearEmployeeIdentity } = sessionSlice.actions;
export default sessionSlice.reducer;
