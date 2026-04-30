import { NextFunction, Request, Response } from "express";
import { Role } from "../types";

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
