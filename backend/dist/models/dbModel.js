"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDb = exports.readDb = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../../data/db.json");
const defaultData = {
    employees: [
        { id: "e1", name: "Alice Admin", email: "alice@company.com", role: "admin" },
        { id: "e2", name: "Ethan Employee", email: "ethan@company.com", role: "employee" },
        { id: "e3", name: "Emma Employee", email: "emma@company.com", role: "employee" },
    ],
    reviews: [
        {
            id: "r1",
            employeeId: "e2",
            title: "Q2 Performance Review",
            status: "open",
            reviewerIds: ["e3"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    feedbacks: [],
};
const ensureDb = () => {
    const dir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
    if (!fs_1.default.existsSync(dbPath))
        fs_1.default.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf-8");
};
const normalizeDb = (parsed) => {
    const d = (parsed && typeof parsed === "object" ? parsed : {});
    return {
        employees: Array.isArray(d.employees) ? d.employees : [...defaultData.employees],
        reviews: Array.isArray(d.reviews) ? d.reviews : [...defaultData.reviews],
        feedbacks: Array.isArray(d.feedbacks) ? d.feedbacks : [...defaultData.feedbacks],
    };
};
const readDb = () => {
    ensureDb();
    const raw = fs_1.default.readFileSync(dbPath, "utf-8");
    try {
        return normalizeDb(JSON.parse(raw));
    }
    catch {
        return normalizeDb({});
    }
};
exports.readDb = readDb;
const writeDb = (data) => {
    ensureDb();
    fs_1.default.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
};
exports.writeDb = writeDb;
