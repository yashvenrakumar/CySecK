"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rbac_1 = require("./middleware/rbac");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(rbac_1.attachRole);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
        tryItOutEnabled: true,
    },
}));
app.use("/api/employees", employeeRoutes_1.default);
app.use("/api/feedbacks", feedbackRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
