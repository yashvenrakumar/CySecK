import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json(fail("Route not found"));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected server error";
  res.status(500).json(fail(message));
};
