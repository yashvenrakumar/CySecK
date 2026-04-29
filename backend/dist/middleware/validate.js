"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json((0, apiResponse_1.fail)(result.error.issues[0]?.message ?? "Validation failed"));
    }
    req.body = result.data;
    next();
};
exports.validateBody = validateBody;
