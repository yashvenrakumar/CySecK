"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchFeedback = exports.getFeedbacks = void 0;
const feedbackService_1 = require("../services/feedbackService");
const reviewService_1 = require("../services/reviewService");
const apiResponse_1 = require("../utils/apiResponse");
const getFeedbacks = (req, res) => {
    const role = req.userRole;
    if (role === "admin") {
        return res.json((0, apiResponse_1.ok)("Feedbacks fetched", (0, feedbackService_1.listFeedbacksEnriched)()));
    }
    if (role === "employee") {
        const reviewerId = typeof req.query.reviewerId === "string" ? req.query.reviewerId.trim() : "";
        if (!reviewerId) {
            return res.status(400).json((0, apiResponse_1.fail)("Query parameter reviewerId is required"));
        }
        return res.json((0, apiResponse_1.ok)("Feedbacks fetched", (0, feedbackService_1.listFeedbacksEnriched)(reviewerId)));
    }
    return res.status(403).json((0, apiResponse_1.fail)("Forbidden: set x-role to admin or employee"));
};
exports.getFeedbacks = getFeedbacks;
const patchFeedback = (req, res) => {
    const result = (0, reviewService_1.updateFeedbackByReviewer)(String(req.params.id), req.body);
    if (!result.ok) {
        if (result.reason === "not_found")
            return res.status(404).json((0, apiResponse_1.fail)("Feedback not found"));
        if (result.reason === "forbidden")
            return res.status(403).json((0, apiResponse_1.fail)("You can only edit your own feedback"));
        if (result.reason === "review_missing")
            return res.status(400).json((0, apiResponse_1.fail)("Review no longer exists"));
        return res.status(400).json((0, apiResponse_1.fail)("This review is closed; feedback can no longer be edited"));
    }
    res.json((0, apiResponse_1.ok)("Feedback updated", result.feedback));
};
exports.patchFeedback = patchFeedback;
