"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const zod_1 = require("zod");
exports.createEmployeeSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.email(),
    role: zod_1.z.enum(["admin", "employee"]).default("employee"),
});
exports.updateEmployeeSchema = exports.createEmployeeSchema.partial();
