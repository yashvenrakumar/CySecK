import crypto from "crypto";
import { Router } from "express";
import { readDb, writeDb } from "./models/dbModel";
import type { Feedback, Review } from "./types";
import { fail, ok } from "./utils/apiResponse";

const router = Router();
const adminOnly = (role?: string) => role !== "admin";
const employeeOrAdmin = (role?: string) => role === "employee" || role === "admin";

router.get("/", (_req, res) => {
  res.json(ok("Reviews fetched", readDb().reviews));
});

router.post("/", (req, res) => {
  if (adminOnly(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const body = req.body as Partial<Review>;
  if (!body?.employeeId) return res.status(400).json(fail("employeeId is required"));
  if (!body?.title || String(body.title).trim().length < 3) return res.status(400).json(fail("title must be at least 3 characters"));
  const now = new Date().toISOString();
  const review: Review = {
    id: crypto.randomUUID(),
    employeeId: String(body.employeeId),
    title: String(body.title).trim(),
    status: body.status === "closed" ? "closed" : "open",
    reviewerIds: Array.isArray(body.reviewerIds) ? body.reviewerIds.map(String) : [],
    createdAt: now,
    updatedAt: now,
  };
  const db = readDb();
  db.reviews.push(review);
  writeDb(db);
  res.status(201).json(ok("Review created", review));
});

router.patch("/:id", (req, res) => {
  if (adminOnly(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const id = String(req.params.id);
  const db = readDb();
  const idx = db.reviews.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json(fail("Review not found"));
  const body = req.body as Partial<Review>;
  db.reviews[idx] = { ...db.reviews[idx], ...body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json(ok("Review updated", db.reviews[idx]));
});

router.post("/:id/assign", (req, res) => {
  if (adminOnly(req.userRole)) return res.status(403).json(fail("Forbidden: insufficient permissions"));
  const reviewId = String(req.params.id);
  const reviewerId = String((req.body as { reviewerId?: string })?.reviewerId || "");
  if (!reviewerId) return res.status(400).json(fail("reviewerId is required"));
  const db = readDb();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review) return res.status(404).json(fail("Review not found"));
  if (review.employeeId === reviewerId) {
    return res.status(400).json(fail("Choose a different reviewer: they cannot review their own performance cycle"));
  }
  if (!db.employees.some((e) => e.id === reviewerId)) {
    return res.status(400).json(fail("That person is not in the staff directory. Add them under Employees, then assign again."));
  }
  if (!review.reviewerIds.includes(reviewerId)) review.reviewerIds.push(reviewerId);
  review.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json(ok("Reviewer assigned", review));
});

router.get("/pending/:reviewerId", (req, res) => {
  if (!employeeOrAdmin(req.userRole)) {
    return res.status(403).json(fail("Forbidden: insufficient permissions"));
  }
  const reviewerId = String(req.params.reviewerId);
  const db = readDb();
  const submitted = new Set(db.feedbacks.filter((f) => f.reviewerId === reviewerId).map((f) => f.reviewId));
  const rows = db.reviews.filter((r) => r.status === "open" && r.reviewerIds.includes(reviewerId) && !submitted.has(r.id));
  res.json(ok("Pending reviews fetched", rows));
});

router.post("/:id/feedback", (req, res) => {
  if (!employeeOrAdmin(req.userRole)) {
    return res.status(403).json(fail("Forbidden: insufficient permissions"));
  }
  const reviewId = String(req.params.id);
  const body = req.body as Partial<Feedback>;
  if (!body?.reviewerId || !body?.comment || typeof body?.rating !== "number") {
    return res.status(400).json(fail("reviewerId, comment and rating are required"));
  }
  if (String(body.comment).trim().length < 2) return res.status(400).json(fail("Comment must be at least 2 characters"));
  if (body.rating < 1 || body.rating > 5) return res.status(400).json(fail("Rating must be between 1 and 5"));
  const db = readDb();
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review || review.status !== "open" || !review.reviewerIds.includes(String(body.reviewerId))) {
    return res.status(400).json(fail("Feedback not accepted: review must be open, and you must be listed as an assigned reviewer for it"));
  }
  const feedback: Feedback = {
    id: crypto.randomUUID(),
    reviewId,
    reviewerId: String(body.reviewerId),
    comment: String(body.comment).trim(),
    rating: Number(body.rating),
    createdAt: new Date().toISOString(),
  };
  db.feedbacks.push(feedback);
  writeDb(db);
  res.status(201).json(ok("Feedback submitted", feedback));
});

export default router;
