"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const express_1 = require("express");
const dbModel_1 = require("./models/dbModel");
const apiResponse_1 = require("./utils/apiResponse");
const router = (0, express_1.Router)();
const notAdmin = (role) => role !== "admin";
const normalizeName = (v) => String(v ?? "").trim();
const normalizeEmail = (v) => String(v ?? "").trim().toLowerCase();
const badName = (v) => normalizeName(v).length < 2;
const badEmail = (v) => !normalizeEmail(v).includes("@");
router.get("/", (_req, res) => {
    res.json((0, apiResponse_1.ok)("Employees fetched", (0, dbModel_1.readDb)().employees));
});
router.post("/", (req, res) => {
    if (notAdmin(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insufficient permissions"));
    const body = req.body;
    if (badName(body?.name))
        return res.status(400).json((0, apiResponse_1.fail)("Name must be at least 2 characters"));
    if (badEmail(body?.email))
        return res.status(400).json((0, apiResponse_1.fail)("Invalid email"));
    const db = (0, dbModel_1.readDb)();
    const employee = {
        id: crypto_1.default.randomUUID(),
        name: normalizeName(body.name),
        email: normalizeEmail(body.email),
        role: body.role === "admin" ? "admin" : "employee",
    };
    db.employees.push(employee);
    (0, dbModel_1.writeDb)(db);
    res.status(201).json((0, apiResponse_1.ok)("Employee created", employee));
});
router.patch("/:id", (req, res) => {
    if (notAdmin(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insufficient permissions"));
    const id = String(req.params.id);
    const db = (0, dbModel_1.readDb)();
    const index = db.employees.findIndex((e) => e.id === id);
    if (index === -1)
        return res.status(404).json((0, apiResponse_1.fail)("Employee not found"));
    const body = req.body;
    if (body.name !== undefined && badName(body.name)) {
        return res.status(400).json((0, apiResponse_1.fail)("Name must be at least 2 characters"));
    }
    if (body.email !== undefined && badEmail(body.email)) {
        return res.status(400).json((0, apiResponse_1.fail)("Invalid email"));
    }
    db.employees[index] = {
        ...db.employees[index],
        ...body,
        name: body.name !== undefined ? normalizeName(body.name) : db.employees[index].name,
        email: body.email !== undefined ? normalizeEmail(body.email) : db.employees[index].email,
    };
    (0, dbModel_1.writeDb)(db);
    res.json((0, apiResponse_1.ok)("Employee updated", db.employees[index]));
});
router.delete("/:id", (req, res) => {
    if (notAdmin(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insufficient permissions"));
    const id = String(req.params.id);
    const db = (0, dbModel_1.readDb)();
    if (!db.employees.some((e) => e.id === id))
        return res.status(404).json((0, apiResponse_1.fail)("Employee not found"));
    db.employees = db.employees.filter((e) => e.id !== id);
    db.reviews = db.reviews.map((r) => ({ ...r, reviewerIds: r.reviewerIds.filter((rid) => rid !== id) }));
    db.feedbacks = db.feedbacks.filter((f) => f.reviewerId !== id);
    (0, dbModel_1.writeDb)(db);
    res.json((0, apiResponse_1.ok)("Employee deleted"));
});
exports.default = router;
