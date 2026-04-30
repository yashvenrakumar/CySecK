"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
router.get("/", (0, rbac_1.requireRole)(["admin", "employee"]), feedbackController_1.getFeedbacks);
exports.default = router;
