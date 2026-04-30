import { useCallback, useState } from "react";
import { API_PREFIX } from "../../shared/config/env";
import type { ApiResponse, Employee, Role } from "../../shared/types";

async function readJson(res: Response) {
  return (await res.json().catch(() => ({}))) as { message?: string };
}

function roleHeaders(role: Role) {
  return {
    "Content-Type": "application/json",
    "x-role": role,
  };
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployees = useCallback(() => {
    const p = fetch(`${API_PREFIX}/employees`).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Employee[]>;
      if (!res.ok) throw new Error(json?.message || "Could not load employees");
      const list = json?.data;
      const rows = Array.isArray(list) ? list : [];
      setEmployees(rows);
      return rows;
    });
    return { unwrap: () => p };
  }, []);

  const postEmployee = useCallback((body: Omit<Employee, "id">, roleForApi: Role = "admin") => {
    const p = fetch(`${API_PREFIX}/employees`, {
      method: "POST",
      headers: roleHeaders(roleForApi),
      body: JSON.stringify(body),
    }).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Employee>;
      if (!res.ok) throw new Error(json?.message || "Could not create employee");
      const row = json.data as Employee;
      setEmployees((prev) => [...prev, row]);
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const patchEmployee = useCallback((id: string, data: Partial<Omit<Employee, "id">>, roleForApi: Role = "admin") => {
    const p = fetch(`${API_PREFIX}/employees/${id}`, {
      method: "PATCH",
      headers: roleHeaders(roleForApi),
      body: JSON.stringify(data),
    }).then(async (res) => {
      const json = (await readJson(res)) as ApiResponse<Employee>;
      if (!res.ok) throw new Error(json?.message || "Could not update employee");
      const row = json.data as Employee;
      setEmployees((prev) => prev.map((e) => (e.id === row.id ? row : e)));
      return row;
    });
    return { unwrap: () => p };
  }, []);

  const deleteEmployeeById = useCallback((id: string, roleForApi: Role = "admin") => {
    const p = fetch(`${API_PREFIX}/employees/${id}`, {
      method: "DELETE",
      headers: roleHeaders(roleForApi),
    }).then(async (res) => {
      const json = await readJson(res);
      if (!res.ok) throw new Error(json?.message || "Could not delete employee");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      return id;
    });
    return { unwrap: () => p };
  }, []);

  return { employees, getEmployees, postEmployee, patchEmployee, deleteEmployeeById };
}
