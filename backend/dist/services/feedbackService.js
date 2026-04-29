"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFeedbacksEnriched = void 0;
const dbModel_1 = require("../models/dbModel");
const listFeedbacksEnriched = (filterReviewerId) => {
    const db = (0, dbModel_1.readDb)();
    let rows = db.feedbacks;
    if (filterReviewerId)
        rows = rows.filter((f) => f.reviewerId === filterReviewerId);
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
    return mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
exports.listFeedbacksEnriched = listFeedbacksEnriched;
