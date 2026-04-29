import { NextFunction, Request, Response } from "express";
import { Role } from "../types";
import { fail } from "../utils/apiResponse";

declare global {
  namespace Express {
    interface Request {
      userRole?: Role;
    }
  }
}

export const attachRole = (req: Request, _res: Response, next: NextFunction) => {
  const role = req.header("x-role");
  if (role === "admin" || role === "employee") req.userRole = role;
  next();
};

export const requireRole =
  (allowed: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowed.includes(req.userRole)) {
      return res.status(403).json(fail("Forbidden: insufficient permissions"));
    }
    next();
  };
