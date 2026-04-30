import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import employeeRoutes from "./employeesApi";
import feedbackRoutes from "./feedbacksApi";
import reviewRoutes from "./reviewsApi";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { attachRole } from "./middleware/rbac";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(attachRole);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/employees", employeeRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
