import { Request, Response } from "express";
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from "../services/employeeService";
import { fail, ok } from "../utils/apiResponse";

export const getEmployees = (_req: Request, res: Response) => {
  res.json(ok("Employees fetched", listEmployees()));
};

export const postEmployee = (req: Request, res: Response) => {
  const employee = createEmployee(req.body);
  res.status(201).json(ok("Employee created", employee));
};

export const patchEmployee = (req: Request, res: Response) => {
  const employee = updateEmployee(String(req.params.id), req.body);
  if (!employee) return res.status(404).json(fail("Employee not found"));
  res.json(ok("Employee updated", employee));
};

export const removeEmployee = (req: Request, res: Response) => {
  const deleted = deleteEmployee(String(req.params.id));
  if (!deleted) return res.status(404).json(fail("Employee not found"));
  res.json(ok("Employee deleted"));
};
