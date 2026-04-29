import fs from "fs";
import path from "path";
import { DatabaseSchema } from "../types";

const dbPath = path.join(__dirname, "../../data/db.json");

const defaultData: DatabaseSchema = {
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
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), "utf-8");
};

const normalizeDb = (parsed: unknown): DatabaseSchema => {
  const d = (parsed && typeof parsed === "object" ? parsed : {}) as Partial<DatabaseSchema>;
  return {
    employees: Array.isArray(d.employees) ? d.employees : [...defaultData.employees],
    reviews: Array.isArray(d.reviews) ? d.reviews : [...defaultData.reviews],
    feedbacks: Array.isArray(d.feedbacks) ? d.feedbacks : [...defaultData.feedbacks],
  };
};

export const readDb = (): DatabaseSchema => {
  ensureDb();
  const raw = fs.readFileSync(dbPath, "utf-8");
  try {
    return normalizeDb(JSON.parse(raw));
  } catch {
    return normalizeDb({});
  }
};

export const writeDb = (data: DatabaseSchema) => {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
};
