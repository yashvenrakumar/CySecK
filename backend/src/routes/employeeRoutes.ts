import { Router } from "express";
import { getEmployees, patchEmployee, postEmployee, removeEmployee } from "../controllers/employeeController";
import { requireRole } from "../middleware/rbac";
import { validateBody } from "../middleware/validate";
import { createEmployeeSchema, updateEmployeeSchema } from "../validations/employeeValidation";

const router = Router();

router.get("/", getEmployees);
router.post("/", requireRole(["admin"]), validateBody(createEmployeeSchema), postEmployee);
router.patch("/:id", requireRole(["admin"]), validateBody(updateEmployeeSchema), patchEmployee);
router.delete("/:id", requireRole(["admin"]), removeEmployee);

export default router;
