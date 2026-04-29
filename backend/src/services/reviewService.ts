import crypto from "crypto";
import { readDb, writeDb } from "../models/dbModel";
import { Feedback, Review } from "../types";

export const listReviews = () => readDb().reviews;

export const createReview = (payload: Omit<Review, "id" | "createdAt" | "updatedAt">) => {
  const db = readDb();
  const now = new Date().toISOString();
  const review: Review = { id: crypto.randomUUID(), ...payload, createdAt: now, updatedAt: now };
  db.reviews.push(review);
  writeDb(db);
  return review;
};

export const updateReview = (id: string, payload: Partial<Omit<Review, "id" | "createdAt">>) => {
  const db = readDb();
  const index = db.reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;
  db.reviews[index] = { ...db.reviews[index], ...payload, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.reviews[index];
};

export type AssignReviewerResult =
  | { ok: true; review: Review }
  | { ok: false; reason: "not_found" | "subject_cannot_review_self" | "reviewer_not_in_directory" };

export const assignReviewer = (reviewId: string, reviewerId: string): AssignReviewerResult => {
  const db = readDb();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review) return { ok: false, reason: "not_found" };
  if (review.employeeId === reviewerId) return { ok: false, reason: "subject_cannot_review_self" };
  if (!db.employees.some((e) => e.id === reviewerId)) {
    return { ok: false, reason: "reviewer_not_in_directory" };
  }
  if (!review.reviewerIds.includes(reviewerId)) review.reviewerIds.push(reviewerId);
  review.updatedAt = new Date().toISOString();
  writeDb(db);
  return { ok: true, review };
};

export const listPendingReviewsForReviewer = (reviewerId: string) => {
  const db = readDb();
  const submittedReviewIds = new Set(
    db.feedbacks.filter((f) => f.reviewerId === reviewerId).map((f) => f.reviewId),
  );
  return db.reviews.filter(
    (review) =>
      review.status === "open" &&
      review.reviewerIds.includes(reviewerId) &&
      !submittedReviewIds.has(review.id),
  );
};

export const submitFeedback = (reviewId: string, payload: Omit<Feedback, "id" | "reviewId" | "createdAt">) => {
  const db = readDb();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review || review.status !== "open" || !review.reviewerIds.includes(payload.reviewerId)) return null;

  const feedback: Feedback = {
    id: crypto.randomUUID(),
    reviewId,
    reviewerId: payload.reviewerId,
    comment: payload.comment,
    rating: payload.rating,
    createdAt: new Date().toISOString(),
  };
  db.feedbacks.push(feedback);
  writeDb(db);
  return feedback;
};

export type UpdateFeedbackResult =
  | { ok: true; feedback: Feedback }
  | { ok: false; reason: "not_found" | "forbidden" | "review_closed" | "review_missing" };

export const updateFeedbackByReviewer = (
  feedbackId: string,
  payload: { reviewerId: string; comment: string; rating: number },
): UpdateFeedbackResult => {
  const db = readDb();
  const index = db.feedbacks.findIndex((f) => f.id === feedbackId);
  if (index === -1) return { ok: false, reason: "not_found" };
  const row = db.feedbacks[index];
  if (row.reviewerId !== payload.reviewerId) return { ok: false, reason: "forbidden" };
  const review = db.reviews.find((r) => r.id === row.reviewId);
  if (!review) return { ok: false, reason: "review_missing" };
  if (review.status !== "open") return { ok: false, reason: "review_closed" };
  const now = new Date().toISOString();
  db.feedbacks[index] = {
    ...row,
    comment: payload.comment,
    rating: payload.rating,
    updatedAt: now,
  };
  writeDb(db);
  return { ok: true, feedback: db.feedbacks[index] };
};
