import { Router } from "express";
import { readDb } from "./models/dbModel";
import { fail, ok } from "./utils/apiResponse";

const router = Router();

router.get("/", (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "employee") {
    return res.status(403).json(fail("Forbidden: set x-role to admin or employe"));
  }
  const reviewerId = typeof req.query.reviewerId === "string" ? req.query.reviewerId.trim() : "";
  if (req.userRole === "employee" && !reviewerId) {
    return res.status(400).json(fail("Query parameter reviewerId is required"));
  }

  const db = readDb();
  let rows = db.feedbacks;
  if (reviewerId) rows = rows.filter((f) => f.reviewerId === reviewerId);

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
  res.json(ok("Feedbacks fetched", mapped));
});

export default router;
