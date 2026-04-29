"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFeedback = exports.getPendingReviews = exports.postAssignReviewer = exports.patchReview = exports.postReview = exports.getReviews = void 0;
const reviewService_1 = require("../services/reviewService");
const apiResponse_1 = require("../utils/apiResponse");
const getReviews = (_req, res) => {
    res.json((0, apiResponse_1.ok)("Reviews fetched", (0, reviewService_1.listReviews)()));
};
exports.getReviews = getReviews;
const postReview = (req, res) => {
    const review = (0, reviewService_1.createReview)(req.body);
    res.status(201).json((0, apiResponse_1.ok)("Review created", review));
};
exports.postReview = postReview;
const patchReview = (req, res) => {
    const review = (0, reviewService_1.updateReview)(String(req.params.id), req.body);
    if (!review)
        return res.status(404).json((0, apiResponse_1.fail)("Review not found"));
    res.json((0, apiResponse_1.ok)("Review updated", review));
};
exports.patchReview = patchReview;
const postAssignReviewer = (req, res) => {
    const result = (0, reviewService_1.assignReviewer)(String(req.params.id), req.body.reviewerId);
    if (!result.ok) {
        if (result.reason === "not_found")
            return res.status(404).json((0, apiResponse_1.fail)("Review not found"));
        if (result.reason === "reviewer_not_in_directory") {
            return res
                .status(400)
                .json((0, apiResponse_1.fail)("That person is not in the staff directory. Add them under Employees, then assign again."));
        }
        return res
            .status(400)
            .json((0, apiResponse_1.fail)("Choose a different reviewer: they cannot review their own performance cycle"));
    }
    res.json((0, apiResponse_1.ok)("Reviewer assigned", result.review));
};
exports.postAssignReviewer = postAssignReviewer;
const getPendingReviews = (req, res) => {
    const reviewerId = String(req.params.reviewerId);
    res.json((0, apiResponse_1.ok)("Pending reviews fetched", (0, reviewService_1.listPendingReviewsForReviewer)(reviewerId)));
};
exports.getPendingReviews = getPendingReviews;
const postFeedback = (req, res) => {
    const feedback = (0, reviewService_1.submitFeedback)(String(req.params.id), req.body);
    if (!feedback) {
        return res.status(400).json((0, apiResponse_1.fail)("Feedback not accepted: review must be open, and you must be listed as an assigned reviewer for it"));
    }
    res.status(201).json((0, apiResponse_1.ok)("Feedback submitted", feedback));
};
exports.postFeedback = postFeedback;
