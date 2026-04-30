"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignReviewerSchema = exports.feedbackSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    employeeId: zod_1.z.string().min(1),
    title: zod_1.z.string().min(3),
    status: zod_1.z.enum(["open", "closed"]).default("open"),
    reviewerIds: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.updateReviewSchema = exports.createReviewSchema.partial();
exports.feedbackSchema = zod_1.z.object({
    reviewerId: zod_1.z.string().min(1),
    comment: zod_1.z.string().min(2),
    rating: zod_1.z.number().min(1).max(5),
});
exports.assignReviewerSchema = zod_1.z.object({
    reviewerId: zod_1.z.string().min(1),
});
