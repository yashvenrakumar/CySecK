// types matching what backend sends back (not 100% strict but good enought)

export type Role = "admin" | "employee";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Review {
  id: string;
  employeeId: string; // who the review is *about*
  title: string;
  status: "open" | "closed";
  reviewerIds: string[];
  createdAt: string;
  updatedAt: string;
}

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
  reviewStatus: "open" | "closed";
}

// standard json envelope from API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
