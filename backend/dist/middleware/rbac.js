"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.attachRole = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const attachRole = (req, _res, next) => {
    const role = req.header("x-role");
    if (role === "admin" || role === "employee")
        req.userRole = role;
    next();
};
exports.attachRole = attachRole;
const requireRole = (allowed) => (req, res, next) => {
    if (!req.userRole || !allowed.includes(req.userRole)) {
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insufficient permissions"));
    }
    next();
};
exports.requireRole = requireRole;
