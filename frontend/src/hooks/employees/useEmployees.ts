import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "../../features/employees/employeesSlice";
import type { Employee, Role } from "../../shared/types";

 
export function useEmployees() {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((s) => s.employees?.items ?? []);

  const getEmployees = useCallback(() => dispatch(fetchEmployees()), [dispatch]);

  const postEmployee = useCallback(
    (body: Omit<Employee, "id">, roleForApi: Role = "admin") =>
      dispatch(addEmployee({ ...body, roleForApi })),
    [dispatch],
  );

  const patchEmployee = useCallback(
    (id: string, data: Partial<Omit<Employee, "id">>, roleForApi: Role = "admin") =>
      dispatch(updateEmployee({ id, data, roleForApi })),
    [dispatch],
  );

  const deleteEmployeeById = useCallback(
    (id: string, roleForApi: Role = "admin") => dispatch(deleteEmployee({ id, roleForApi })),
    [dispatch],
  );

  return {
    employees,
  
    getEmployees,
   
    postEmployee,
   
    patchEmployee,
  
    deleteEmployeeById,
  };
}
