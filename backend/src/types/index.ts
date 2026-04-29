export type Role = "admin" | "employee";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Feedback {
  id: string;
  reviewId: string;
  reviewerId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

/** Feedback row joined with review + people for display */
export interface FeedbackEnriched {
  id: string;
  reviewId: string;
  reviewTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  revieweeId: string;
  revieweeName: string;
  revieweeEmail: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
  /** Whether the linked review is still open (editing allowed only when open). */
  reviewStatus: "open" | "closed";
}

export interface Review {
  id: string;
  employeeId: string;
  title: string;
  status: "open" | "closed";
  reviewerIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  employees: Employee[];
  reviews: Review[];
  feedbacks: Feedback[];
}
