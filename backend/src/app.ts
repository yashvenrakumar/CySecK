import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import employeeRoutes from "./routes/employeeRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { attachRole } from "./middleware/rbac";
import { swaggerSpec } from "./swagger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(attachRole);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      filter: true,
      tryItOutEnabled: true,
    },
  }),
);
app.use("/api/employees", employeeRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
