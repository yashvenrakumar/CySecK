import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, withRole } from "../../shared/api/client";
import type { Employee, Role } from "../../shared/types";

export const fetchEmployees = createAsyncThunk("employees/fetch", async () => {
  const res = await api.get("/employees");
  const data = res.data?.data;
  return Array.isArray(data) ? (data as Employee[]) : [];
});

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (payload: Omit<Employee, "id"> & { roleForApi: Role }) => {
    const { roleForApi, ...body } = payload;
    const res = await api.post("/employees", body, withRole(roleForApi));
    return res.data.data as Employee;
  },
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({
    id,
    data,
    roleForApi,
  }: {
    id: string;
    data: Partial<Omit<Employee, "id">>;
    roleForApi: Role;
  }) => {
    const res = await api.patch(`/employees/${id}`, data, withRole(roleForApi));
    return res.data.data as Employee;
  },
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async ({ id, roleForApi }: { id: string; roleForApi: Role }) => {
    await api.delete(`/employees/${id}`, withRole(roleForApi));
    return id;
  },
);

interface EmployeesState {
  items: Employee[];
}

const initialState: EmployeesState = { items: [] };

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(addEmployee.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      if (action.payload) state.items.push(action.payload);
    });
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      const p = action.payload;
      if (!p?.id) return;
      state.items = state.items.map((e) => (e.id === p.id ? p : e));
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.filter((e) => e.id !== action.payload);
    });
  },
});

export default employeesSlice.reducer;
