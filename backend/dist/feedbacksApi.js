"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbModel_1 = require("./models/dbModel");
const apiResponse_1 = require("./utils/apiResponse");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    if (req.userRole !== "admin" && req.userRole !== "employee") {
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: set x-role to admin or employe"));
    }
    const reviewerId = typeof req.query.reviewerId === "string" ? req.query.reviewerId.trim() : "";
    if (req.userRole === "employee" && !reviewerId) {
        return res.status(400).json((0, apiResponse_1.fail)("Query parameter reviewerId is required"));
    }
    const db = (0, dbModel_1.readDb)();
    let rows = db.feedbacks;
    if (reviewerId)
        rows = rows.filter((f) => f.reviewerId === reviewerId);
    const mapped = rows.map((f) => {
        const review = db.reviews.find((r) => r.id === f.reviewId);
        const reviewer = db.employees.find((e) => e.id === f.reviewerId);
        const reviewee = review ? db.employees.find((e) => e.id === review.employeeId) : undefined;
        return {
            id: f.id,
            reviewId: f.reviewId,
            reviewTitle: review?.title ?? "(removed review)",
            reviewerId: f.reviewerId,
            reviewerName: reviewer?.name ?? "Unknown reviewer",
            reviewerEmail: reviewer?.email ?? "",
            revieweeId: review?.employeeId ?? "",
            revieweeName: reviewee?.name ?? "Unknown reviewee",
            revieweeEmail: reviewee?.email ?? "",
            comment: f.comment,
            rating: f.rating,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
            reviewStatus: review?.status ?? "closed",
        };
    });
    mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json((0, apiResponse_1.ok)("Feedbacks fetched", mapped));
});
exports.default = router;
