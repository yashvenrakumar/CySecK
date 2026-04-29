import crypto from "crypto";
import { readDb, writeDb } from "../models/dbModel";
import { Employee } from "../types";

export const listEmployees = () => readDb().employees;

export const createEmployee = (payload: Omit<Employee, "id">) => {
  const db = readDb();
  const employee: Employee = { id: crypto.randomUUID(), ...payload };
  db.employees.push(employee);
  writeDb(db);
  return employee;
};

export const updateEmployee = (id: string, payload: Partial<Omit<Employee, "id">>) => {
  const db = readDb();
  const index = db.employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  db.employees[index] = { ...db.employees[index], ...payload };
  writeDb(db);
  return db.employees[index];
};

export const deleteEmployee = (id: string) => {
  const db = readDb();
  const exists = db.employees.some((e) => e.id === id);
  if (!exists) return false;
  db.employees = db.employees.filter((e) => e.id !== id);
  db.reviews = db.reviews.map((r) => ({
    ...r,
    reviewerIds: r.reviewerIds.filter((reviewerId) => reviewerId !== id),
  }));
  db.feedbacks = db.feedbacks.filter((f) => f.reviewerId !== id);
  writeDb(db);
  return true;
};
