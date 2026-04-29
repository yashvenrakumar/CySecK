"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeedbackByReviewer = exports.submitFeedback = exports.listPendingReviewsForReviewer = exports.assignReviewer = exports.updateReview = exports.createReview = exports.listReviews = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dbModel_1 = require("../models/dbModel");
const listReviews = () => (0, dbModel_1.readDb)().reviews;
exports.listReviews = listReviews;
const createReview = (payload) => {
    const db = (0, dbModel_1.readDb)();
    const now = new Date().toISOString();
    const review = { id: crypto_1.default.randomUUID(), ...payload, createdAt: now, updatedAt: now };
    db.reviews.push(review);
    (0, dbModel_1.writeDb)(db);
    return review;
};
exports.createReview = createReview;
const updateReview = (id, payload) => {
    const db = (0, dbModel_1.readDb)();
    const index = db.reviews.findIndex((r) => r.id === id);
    if (index === -1)
        return null;
    db.reviews[index] = { ...db.reviews[index], ...payload, updatedAt: new Date().toISOString() };
    (0, dbModel_1.writeDb)(db);
    return db.reviews[index];
};
exports.updateReview = updateReview;
const assignReviewer = (reviewId, reviewerId) => {
    const db = (0, dbModel_1.readDb)();
    const review = db.reviews.find((r) => r.id === reviewId);
    if (!review)
        return { ok: false, reason: "not_found" };
    if (review.employeeId === reviewerId)
        return { ok: false, reason: "subject_cannot_review_self" };
    if (!db.employees.some((e) => e.id === reviewerId)) {
        return { ok: false, reason: "reviewer_not_in_directory" };
    }
    if (!review.reviewerIds.includes(reviewerId))
        review.reviewerIds.push(reviewerId);
    review.updatedAt = new Date().toISOString();
    (0, dbModel_1.writeDb)(db);
    return { ok: true, review };
};
exports.assignReviewer = assignReviewer;
const listPendingReviewsForReviewer = (reviewerId) => {
    const db = (0, dbModel_1.readDb)();
    const submittedReviewIds = new Set(db.feedbacks.filter((f) => f.reviewerId === reviewerId).map((f) => f.reviewId));
    return db.reviews.filter((review) => review.status === "open" &&
        review.reviewerIds.includes(reviewerId) &&
        !submittedReviewIds.has(review.id));
};
exports.listPendingReviewsForReviewer = listPendingReviewsForReviewer;
const submitFeedback = (reviewId, payload) => {
    const db = (0, dbModel_1.readDb)();
    const review = db.reviews.find((r) => r.id === reviewId);
    if (!review || review.status !== "open" || !review.reviewerIds.includes(payload.reviewerId))
        return null;
    const feedback = {
        id: crypto_1.default.randomUUID(),
        reviewId,
        reviewerId: payload.reviewerId,
        comment: payload.comment,
        rating: payload.rating,
        createdAt: new Date().toISOString(),
    };
    db.feedbacks.push(feedback);
    (0, dbModel_1.writeDb)(db);
    return feedback;
};
exports.submitFeedback = submitFeedback;
const updateFeedbackByReviewer = (feedbackId, payload) => {
    const db = (0, dbModel_1.readDb)();
    const index = db.feedbacks.findIndex((f) => f.id === feedbackId);
    if (index === -1)
        return { ok: false, reason: "not_found" };
    const row = db.feedbacks[index];
    if (row.reviewerId !== payload.reviewerId)
        return { ok: false, reason: "forbidden" };
    const review = db.reviews.find((r) => r.id === row.reviewId);
    if (!review)
        return { ok: false, reason: "review_missing" };
    if (review.status !== "open")
        return { ok: false, reason: "review_closed" };
    const now = new Date().toISOString();
    db.feedbacks[index] = {
        ...row,
        comment: payload.comment,
        rating: payload.rating,
        updatedAt: now,
    };
    (0, dbModel_1.writeDb)(db);
    return { ok: true, feedback: db.feedbacks[index] };
};
exports.updateFeedbackByReviewer = updateFeedbackByReviewer;
