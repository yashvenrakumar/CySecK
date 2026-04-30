import crypto from "crypto";
import { Router } from "express";
import { readDb, writeDb } from "./models/dbModel";
import type { Employee } from "./types";
import { fail, ok } from "./utils/apiResponse";

const router = Router();
const notAdmin = (role?: string) => role !== "admin";
const normalizeName = (v: unknown) => String(v ?? "").trim();
const normalizeEmail = (v: unknown) => String(v ?? "").trim().toLowerCase();
const badName = (v: unknown) => normalizeName(v).length < 2;
const badEmail = (v: unknown) => !normalizeEmail(v).includes("@");

router.get("/", (_req, res) => {
  res.json(ok("Employees fetched", readDb().employees));
});

router.post("/", (req, res) => {
  if (notAdmin(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const body = req.body as Partial<Employee>;
  if (badName(body?.name)) return res.status(400).json(fail("Name must be at least 2 characters"));
  if (badEmail(body?.email)) return res.status(400).json(fail("Invalid email"));
  const db = readDb();
  const employee: Employee = {
    id: crypto.randomUUID(),
    name: normalizeName(body.name),
    email: normalizeEmail(body.email),
    role: body.role === "admin" ? "admin" : "employee",
  };
  db.employees.push(employee);
  writeDb(db);
  res.status(201).json(ok("Employee created", employee));
});

router.patch("/:id", (req, res) => {
  if (notAdmin(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const id = String(req.params.id);
  const db = readDb();
  const index = db.employees.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json(fail("Employee not found"));
  const body = req.body as Partial<Employee>;
  if (body.name !== undefined && badName(body.name)) {
    return res.status(400).json(fail("Name must be at least 2 characters"));
  }
  if (body.email !== undefined && badEmail(body.email)) {
    return res.status(400).json(fail("Invalid email"));
  }
  db.employees[index] = {
    ...db.employees[index],
    ...body,
    name: body.name !== undefined ? normalizeName(body.name) : db.employees[index].name,
    email: body.email !== undefined ? normalizeEmail(body.email) : db.employees[index].email,
  };
  writeDb(db);
  res.json(ok("Employee updated", db.employees[index]));
});

router.delete("/:id", (req, res) => {
  if (notAdmin(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const id = String(req.params.id);
  const db = readDb();
  if (!db.employees.some((e) => e.id === id)) return res.status(404).json(fail("Employee not found"));
  db.employees = db.employees.filter((e) => e.id !== id);
  db.reviews = db.reviews.map((r) => ({ ...r, reviewerIds: r.reviewerIds.filter((rid) => rid !== id) }));
  db.feedbacks = db.feedbacks.filter((f) => f.reviewerId !== id);
  writeDb(db);
  res.json(ok("Employee deleted"));
});

export default router;
