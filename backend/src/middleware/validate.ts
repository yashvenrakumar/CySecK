import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { fail } from "../utils/apiResponse";

export const validateBody =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(fail(result.error.issues[0]?.message ?? "Validation failed"));
    }
    req.body = result.data;
    next();
  };
