"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
const ok = (message, data) => ({
    success: true,
    message,
    data,
});
exports.ok = ok;
const fail = (message) => ({
    success: false,
    message,
    data: null,
});
exports.fail = fail;
