import { z } from "zod";

export const createReviewSchema = z.object({
  employeeId: z.string().min(1),
  title: z.string().min(3),
  status: z.enum(["open", "closed"]).default("open"),
  reviewerIds: z.array(z.string()).default([]),
});

export const updateReviewSchema = createReviewSchema.partial();

export const feedbackSchema = z.object({
  reviewerId: z.string().min(1),
  comment: z.string().min(2),
  rating: z.number().min(1).max(5),
});

/** Same shape as submit; used for PATCH /api/feedbacks/:id */
export const feedbackUpdateSchema = feedbackSchema;

export const assignReviewerSchema = z.object({
  reviewerId: z.string().min(1),
});
