"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.listEmployees = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dbModel_1 = require("../models/dbModel");
const listEmployees = () => (0, dbModel_1.readDb)().employees;
exports.listEmployees = listEmployees;
const createEmployee = (payload) => {
    const db = (0, dbModel_1.readDb)();
    const employee = { id: crypto_1.default.randomUUID(), ...payload };
    db.employees.push(employee);
    (0, dbModel_1.writeDb)(db);
    return employee;
};
exports.createEmployee = createEmployee;
const updateEmployee = (id, payload) => {
    const db = (0, dbModel_1.readDb)();
    const index = db.employees.findIndex((e) => e.id === id);
    if (index === -1)
        return null;
    db.employees[index] = { ...db.employees[index], ...payload };
    (0, dbModel_1.writeDb)(db);
    return db.employees[index];
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = (id) => {
    const db = (0, dbModel_1.readDb)();
    const exists = db.employees.some((e) => e.id === id);
    if (!exists)
        return false;
    db.employees = db.employees.filter((e) => e.id !== id);
    db.reviews = db.reviews.map((r) => ({
        ...r,
        reviewerIds: r.reviewerIds.filter((reviewerId) => reviewerId !== id),
    }));
    db.feedbacks = db.feedbacks.filter((f) => f.reviewerId !== id);
    (0, dbModel_1.writeDb)(db);
    return true;
};
exports.deleteEmployee = deleteEmployee;
