import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, Employee, Role } from "../../shared/types";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployees = useCallback(() => {
    const p = api.get<ApiResponse<Employee[]>>("/employees").then((res) => {
      const list = res.data?.data;
      const rows = Array.isArray(list) ? list : [];
      setEmployees(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const postEmployee = useCallback((body: Omit<Employee, "id">, roleForApi: Role = "admin") => {
    const p = api.post<ApiResponse<Employee>>("/employees", body, withRole(roleForApi)).then((res) => {
      const row = res.data.data as Employee;
      setEmployees((prev) => [...prev, row]);
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const patchEmployee = useCallback((id: string, data: Partial<Omit<Employee, "id">>, roleForApi: Role = "admin") => {
    const p = api.patch<ApiResponse<Employee>>(`/employees/${id}`, data, withRole(roleForApi)).then((res) => {
      const row = res.data.data as Employee;
      setEmployees((prev) => prev.map((e) => (e.id === row.id ? row : e)));
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const deleteEmployeeById = useCallback((id: string, roleForApi: Role = "admin") => {
    const p = api.delete(`/employees/${id}`, withRole(roleForApi)).then(() => {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      return id;
    });
    return { unwrap: () => p };
  }, []);

  return { employees, getEmployees, postEmployee, patchEmployee, deleteEmployeeById };
}
