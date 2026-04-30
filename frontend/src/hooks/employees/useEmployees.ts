import { useCallback, useState } from "react";
import { api, withRole } from "../../shared/api/client";
import type { ApiResponse, Employee, Role } from "../../shared/types";

type AsyncAction<T> = { unwrap: () => Promise<T> };

const asAction = <T,>(promise: Promise<T>): AsyncAction<T> => ({
  unwrap: () => promise,
});

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployees = useCallback(() => {
    const task = api.get<ApiResponse<Employee[]>>("/employees").then((res) => {
      const data = res.data?.data;
      const rows = Array.isArray(data) ? (data as Employee[]) : [];
      setEmployees(rows);
      return rows;
    });
    return asAction(task);
  }, []);

  const postEmployee = useCallback(
    (body: Omit<Employee, "id">, roleForApi: Role = "admin") => {
      const task = api.post<ApiResponse<Employee>>("/employees", body, withRole(roleForApi)).then((res) => {
        const row = res.data?.data as Employee;
        setEmployees((prev) => [...prev, row]);
        return row;
      });
      return asAction(task);
    },
    [],
  );

  const patchEmployee = useCallback(
    (id: string, data: Partial<Omit<Employee, "id">>, roleForApi: Role = "admin") => {
      const task = api.patch<ApiResponse<Employee>>(`/employees/${id}`, data, withRole(roleForApi)).then((res) => {
        const row = res.data?.data as Employee;
        setEmployees((prev) => prev.map((e) => (e.id === row.id ? row : e)));
        return row;
      });
      return asAction(task);
    },
    [],
  );

  const deleteEmployeeById = useCallback(
    (id: string, roleForApi: Role = "admin") => {
      const task = api.delete(`/employees/${id}`, withRole(roleForApi)).then(() => {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        return id;
      });
      return asAction(task);
    },
    [],
  );

  return {
    employees,
  
    getEmployees,
   
    postEmployee,
   
    patchEmployee,
  
    deleteEmployeeById,
  };
}
