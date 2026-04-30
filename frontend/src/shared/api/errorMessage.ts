import { ApiError } from "./client";

export function apiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) {
    const data = error.data as { message?: string } | undefined;
    if (typeof data?.message === "string" && data.message.length > 0) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
