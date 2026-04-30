"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachRole = void 0;
const attachRole = (req, _res, next) => {
    const role = req.header("x-role");
    if (role === "admin" || role === "employee")
        req.userRole = role;
    next();
};
exports.attachRole = attachRole;
