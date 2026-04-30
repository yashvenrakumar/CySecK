"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbacks = void 0;
const feedbackService_1 = require("../services/feedbackService");
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
