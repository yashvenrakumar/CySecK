import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  role: z.enum(["admin", "employee"]).default("employee"),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
