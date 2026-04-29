"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const notFound = (_req, res) => {
    res.status(404).json((0, apiResponse_1.fail)("Route not found"));
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    res.status(500).json((0, apiResponse_1.fail)(message));
};
exports.errorHandler = errorHandler;
