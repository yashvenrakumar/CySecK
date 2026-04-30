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
const adminOnly = (role) => role !== "admin";
const employeeOrAdmin = (role) => role === "employee" || role === "admin";
router.get("/", (_req, res) => {
    res.json((0, apiResponse_1.ok)("Reviews fetched", (0, dbModel_1.readDb)().reviews));
});
router.post("/", (req, res) => {
    if (adminOnly(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insuficient permission"));
    const body = req.body;
    if (!body?.employeeId)
        return res.status(400).json((0, apiResponse_1.fail)("employeeId is required"));
    if (!body?.title || String(body.title).trim().length < 3)
        return res.status(400).json((0, apiResponse_1.fail)("title must be atleast 3 characters"));
    const now = new Date().toISOString();
    const review = {
        id: crypto_1.default.randomUUID(),
        employeeId: String(body.employeeId),
        title: String(body.title).trim(),
        status: body.status === "closed" ? "closed" : "open",
        reviewerIds: Array.isArray(body.reviewerIds) ? body.reviewerIds.map(String) : [],
        createdAt: now,
        updatedAt: now,
    };
    const db = (0, dbModel_1.readDb)();
    db.reviews.push(review);
    (0, dbModel_1.writeDb)(db);
    res.status(201).json((0, apiResponse_1.ok)("Review created", review));
});
router.patch("/:id", (req, res) => {
    if (adminOnly(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insuficient permission"));
    const id = String(req.params.id);
    const db = (0, dbModel_1.readDb)();
    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx === -1)
        return res.status(404).json((0, apiResponse_1.fail)("Review not found"));
    const body = req.body;
    db.reviews[idx] = { ...db.reviews[idx], ...body, updatedAt: new Date().toISOString() };
    (0, dbModel_1.writeDb)(db);
    res.json((0, apiResponse_1.ok)("Review updated", db.reviews[idx]));
});
router.post("/:id/assign", (req, res) => {
    if (adminOnly(req.userRole))
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insuficient permission"));
    const reviewId = String(req.params.id);
    const reviewerId = String(req.body?.reviewerId || "");
    if (!reviewerId)
        return res.status(400).json((0, apiResponse_1.fail)("reviewerId is required"));
    const db = (0, dbModel_1.readDb)();
    const review = db.reviews.find((r) => r.id === reviewId);
    if (!review)
        return res.status(404).json((0, apiResponse_1.fail)("Review not found"));
    if (review.employeeId === reviewerId) {
        return res.status(400).json((0, apiResponse_1.fail)("Choose a different reviewer: they cannot review their own performance cycle"));
    }
    if (!db.employees.some((e) => e.id === reviewerId)) {
        return res.status(400).json((0, apiResponse_1.fail)("That person is not in the staff directory. Add them under Employees, then assign again."));
    }
    if (!review.reviewerIds.includes(reviewerId))
        review.reviewerIds.push(reviewerId);
    review.updatedAt = new Date().toISOString();
    (0, dbModel_1.writeDb)(db);
    res.json((0, apiResponse_1.ok)("Reviewer assigned", review));
});
router.get("/pending/:reviewerId", (req, res) => {
    if (!employeeOrAdmin(req.userRole)) {
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insuficient permission"));
    }
    const reviewerId = String(req.params.reviewerId);
    const db = (0, dbModel_1.readDb)();
    const submitted = new Set(db.feedbacks.filter((f) => f.reviewerId === reviewerId).map((f) => f.reviewId));
    const rows = db.reviews.filter((r) => r.status === "open" && r.reviewerIds.includes(reviewerId) && !submitted.has(r.id));
    res.json((0, apiResponse_1.ok)("Pending reviews fetched", rows));
});
router.post("/:id/feedback", (req, res) => {
    if (!employeeOrAdmin(req.userRole)) {
        return res.status(403).json((0, apiResponse_1.fail)("Forbidden: insuficient permission"));
    }
    const reviewId = String(req.params.id);
    const body = req.body;
    if (!body?.reviewerId || !body?.comment || typeof body?.rating !== "number") {
        return res.status(400).json((0, apiResponse_1.fail)("reviewerId, comment and rating are required"));
    }
    if (String(body.comment).trim().length < 2)
        return res.status(400).json((0, apiResponse_1.fail)("Comment must be atleast 2 characters"));
    if (body.rating < 1 || body.rating > 5)
        return res.status(400).json((0, apiResponse_1.fail)("Rating must be between 1 and 5"));
    const db = (0, dbModel_1.readDb)();
    const review = db.reviews.find((r) => r.id === reviewId);
    if (!review || review.status !== "open" || !review.reviewerIds.includes(String(body.reviewerId))) {
        return res.status(400).json((0, apiResponse_1.fail)("Feedback not accepted: review must be open, and you must be listed as an assigned reviewer for it"));
    }
    const feedback = {
        id: crypto_1.default.randomUUID(),
        reviewId,
        reviewerId: String(body.reviewerId),
        comment: String(body.comment).trim(),
        rating: Number(body.rating),
        createdAt: new Date().toISOString(),
    };
    db.feedbacks.push(feedback);
    (0, dbModel_1.writeDb)(db);
    res.status(201).json((0, apiResponse_1.ok)("Feedback submitted", feedback));
});
exports.default = router;
