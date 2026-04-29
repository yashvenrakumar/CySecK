"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmployee = exports.patchEmployee = exports.postEmployee = exports.getEmployees = void 0;
const employeeService_1 = require("../services/employeeService");
const apiResponse_1 = require("../utils/apiResponse");
const getEmployees = (_req, res) => {
    res.json((0, apiResponse_1.ok)("Employees fetched", (0, employeeService_1.listEmployees)()));
};
exports.getEmployees = getEmployees;
const postEmployee = (req, res) => {
    const employee = (0, employeeService_1.createEmployee)(req.body);
    res.status(201).json((0, apiResponse_1.ok)("Employee created", employee));
};
exports.postEmployee = postEmployee;
const patchEmployee = (req, res) => {
    const employee = (0, employeeService_1.updateEmployee)(String(req.params.id), req.body);
    if (!employee)
        return res.status(404).json((0, apiResponse_1.fail)("Employee not found"));
    res.json((0, apiResponse_1.ok)("Employee updated", employee));
};
exports.patchEmployee = patchEmployee;
const removeEmployee = (req, res) => {
    const deleted = (0, employeeService_1.deleteEmployee)(String(req.params.id));
    if (!deleted)
        return res.status(404).json((0, apiResponse_1.fail)("Employee not found"));
    res.json((0, apiResponse_1.ok)("Employee deleted"));
};
exports.removeEmployee = removeEmployee;
