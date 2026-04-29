"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
/**
 * OpenAPI 3.0 spec for Swagger UI. Examples match runtime JSON shapes.
 */
exports.swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "CysecK Performance Review API",
        version: "1.0.0",
        description: "REST API for employee performance reviews and peer feedback. " +
            "Admin mutations require `x-role: admin`. Pending reviews and feedback require `x-role: employee` or `admin`.",
    },
    servers: [{ url: "http://localhost:4000", description: "Local dev" }],
    tags: [
        { name: "Health", description: "Service health" },
        { name: "Employees", description: "Employee directory (CRUD)" },
        { name: "Feedbacks", description: "Submitted feedback with reviewer and reviewee" },
        { name: "Reviews", description: "Reviews, assignments, and feedback" },
    ],
    components: {
        securitySchemes: {
            RoleHeader: {
                type: "apiKey",
                in: "header",
                name: "x-role",
                description: "Simulated RBAC: `admin` or `employee`",
            },
        },
        schemas: {
            Employee: {
                type: "object",
                required: ["id", "name", "email", "role"],
                properties: {
                    id: { type: "string", example: "e2" },
                    name: { type: "string", example: "Ethan Employee" },
                    email: { type: "string", format: "email", example: "ethan@company.com" },
                    role: { type: "string", enum: ["admin", "employee"], example: "employee" },
                },
            },
            Review: {
                type: "object",
                required: ["id", "employeeId", "title", "status", "reviewerIds", "createdAt", "updatedAt"],
                properties: {
                    id: { type: "string", example: "r1" },
                    employeeId: { type: "string", example: "e2" },
                    title: { type: "string", example: "Q2 Performance Review" },
                    status: { type: "string", enum: ["open", "closed"], example: "open" },
                    reviewerIds: {
                        type: "array",
                        items: { type: "string" },
                        example: ["e3"],
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            Feedback: {
                type: "object",
                required: ["id", "reviewId", "reviewerId", "comment", "rating", "createdAt"],
                properties: {
                    id: { type: "string", example: "f1" },
                    reviewId: { type: "string", example: "r1" },
                    reviewerId: { type: "string", example: "e3" },
                    comment: { type: "string", example: "Great collaboration and clear communication." },
                    rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            ApiSuccess: {
                type: "object",
                required: ["success", "message"],
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Employees fetched" },
                    data: {},
                },
            },
            ApiError: {
                type: "object",
                required: ["success", "message", "data"],
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Employee not found" },
                    data: { nullable: true, example: null },
                },
            },
            CreateEmployeeRequest: {
                type: "object",
                required: ["name", "email"],
                properties: {
                    name: { type: "string", minLength: 2, example: "Jordan Lee" },
                    email: { type: "string", format: "email", example: "jordan@company.com" },
                    role: { type: "string", enum: ["admin", "employee"], default: "employee", example: "employee" },
                },
            },
            UpdateEmployeeRequest: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Jordan L. Updated" },
                    email: { type: "string", format: "email", example: "jordan.new@company.com" },
                    role: { type: "string", enum: ["admin", "employee"], example: "admin" },
                },
            },
            CreateReviewRequest: {
                type: "object",
                required: ["employeeId", "title"],
                properties: {
                    employeeId: { type: "string", example: "e2" },
                    title: { type: "string", minLength: 3, example: "H1 Performance Review" },
                    status: { type: "string", enum: ["open", "closed"], default: "open", example: "open" },
                    reviewerIds: { type: "array", items: { type: "string" }, example: [] },
                },
            },
            UpdateReviewRequest: {
                type: "object",
                properties: {
                    employeeId: { type: "string", example: "e2" },
                    title: { type: "string", example: "H1 Performance Review (revised)" },
                    status: { type: "string", enum: ["open", "closed"], example: "closed" },
                    reviewerIds: { type: "array", items: { type: "string" }, example: ["e3"] },
                },
            },
            AssignReviewerRequest: {
                type: "object",
                required: ["reviewerId"],
                properties: {
                    reviewerId: { type: "string", example: "e3" },
                },
            },
            SubmitFeedbackRequest: {
                type: "object",
                required: ["reviewerId", "comment", "rating"],
                properties: {
                    reviewerId: { type: "string", example: "e3" },
                    comment: { type: "string", minLength: 2, example: "Strong ownership of deliverables." },
                    rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health check",
                responses: {
                    "200": {
                        description: "Service is up",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { ok: { type: "boolean", example: true } },
                                },
                                example: { ok: true },
                            },
                        },
                    },
                },
            },
        },
        "/api/employees": {
            get: {
                tags: ["Employees"],
                summary: "List all employees",
                description: "No `x-role` required.",
                responses: {
                    "200": {
                        description: "Standard wrapped list",
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: [
                                        { $ref: "#/components/schemas/ApiSuccess" },
                                        {
                                            type: "object",
                                            properties: {
                                                data: { type: "array", items: { $ref: "#/components/schemas/Employee" } },
                                            },
                                        },
                                    ],
                                },
                                example: {
                                    success: true,
                                    message: "Employees fetched",
                                    data: [
                                        {
                                            id: "e1",
                                            name: "Alice Admin",
                                            email: "alice@company.com",
                                            role: "admin",
                                        },
                                        {
                                            id: "e2",
                                            name: "Ethan Employee",
                                            email: "ethan@company.com",
                                            role: "employee",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Employees"],
                summary: "Create employee",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                        description: "Must be `admin`",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateEmployeeRequest" },
                            example: {
                                name: "Jordan Lee",
                                email: "jordan@company.com",
                                role: "employee",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Employee created",
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: [
                                        { $ref: "#/components/schemas/ApiSuccess" },
                                        {
                                            type: "object",
                                            properties: { data: { $ref: "#/components/schemas/Employee" } },
                                        },
                                    ],
                                },
                                example: {
                                    success: true,
                                    message: "Employee created",
                                    data: {
                                        id: "e7b2c4d1-8f3a-4e2b-9c1d-000000000001",
                                        name: "Jordan Lee",
                                        email: "jordan@company.com",
                                        role: "employee",
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                                example: { success: false, message: "Invalid email", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Missing or wrong role",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/employees/{id}": {
            patch: {
                tags: ["Employees"],
                summary: "Update employee",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                    },
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "e2",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateEmployeeRequest" },
                            example: { role: "admin", name: "Ethan Employee" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Updated employee",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Employee updated",
                                    data: {
                                        id: "e2",
                                        name: "Ethan Employee",
                                        email: "ethan@company.com",
                                        role: "admin",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Employee not found", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Employees"],
                summary: "Delete employee",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                    },
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "e2",
                    },
                ],
                responses: {
                    "200": {
                        description: "Deleted (data may be omitted)",
                        content: {
                            "application/json": {
                                example: { success: true, message: "Employee deleted" },
                            },
                        },
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Employee not found", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/feedbacks": {
            get: {
                tags: ["Feedbacks"],
                summary: "List feedback with reviewer → reviewee context",
                description: "Admin: all rows. Employee: pass `reviewerId` query (must match the reviewer). Each item includes who gave feedback and who it is about (review subject).",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin", "employee"] },
                        example: "admin",
                    },
                    {
                        name: "reviewerId",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Required when `x-role: employee` — only feedback from this reviewer.",
                        example: "e3",
                    },
                ],
                responses: {
                    "200": {
                        description: "Newest first",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Feedbacks fetched",
                                    data: [
                                        {
                                            id: "f1",
                                            reviewId: "r1",
                                            reviewTitle: "Q2 Performance Review",
                                            reviewerId: "e3",
                                            reviewerName: "Emma Employee",
                                            reviewerEmail: "emma@company.com",
                                            revieweeId: "e2",
                                            revieweeName: "Ethan Employee",
                                            revieweeEmail: "ethan@company.com",
                                            comment: "Great collaboration.",
                                            rating: 5,
                                            createdAt: "2026-04-29T16:00:00.000Z",
                                            reviewStatus: "open",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Employee role without reviewerId",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Query parameter reviewerId is required", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Missing x-role",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: set x-role to admin or employee", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/feedbacks/{id}": {
            patch: {
                tags: ["Feedbacks"],
                summary: "Update submitted feedback",
                description: "Change comment or rating on feedback you authored. `reviewerId` in the body must match the stored reviewer. Only allowed while the linked review is **open**.",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Feedback id",
                    },
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["employee", "admin"] },
                        example: "employee",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["reviewerId", "comment", "rating"],
                                properties: {
                                    reviewerId: { type: "string" },
                                    comment: { type: "string", minLength: 2 },
                                    rating: { type: "number", minimum: 1, maximum: 5 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Updated raw feedback row",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Feedback updated",
                                    data: {
                                        id: "f1",
                                        reviewId: "r1",
                                        reviewerId: "e3",
                                        comment: "Updated comment.",
                                        rating: 4,
                                        createdAt: "2026-04-29T16:00:00.000Z",
                                        updatedAt: "2026-04-29T18:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation failed or review is closed",
                        content: {
                            "application/json": {
                                example: { success: false, message: "This review is closed; feedback can no longer be edited", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Not the author",
                        content: {
                            "application/json": {
                                example: { success: false, message: "You can only edit your own feedback", data: null },
                            },
                        },
                    },
                    "404": {
                        description: "Feedback id not found",
                    },
                },
            },
        },
        "/api/reviews": {
            get: {
                tags: ["Reviews"],
                summary: "List all reviews",
                description: "No `x-role` required.",
                responses: {
                    "200": {
                        description: "Standard wrapped list",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Reviews fetched",
                                    data: [
                                        {
                                            id: "r1",
                                            employeeId: "e2",
                                            title: "Q2 Performance Review",
                                            status: "open",
                                            reviewerIds: ["e3"],
                                            createdAt: "2026-04-28T10:00:00.000Z",
                                            updatedAt: "2026-04-28T10:00:00.000Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Reviews"],
                summary: "Create performance review",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateReviewRequest" },
                            example: {
                                employeeId: "e2",
                                title: "H1 Performance Review",
                                status: "open",
                                reviewerIds: [],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Review created",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Review created",
                                    data: {
                                        id: "r9a1b2c3-4d5e-6f70-8192-abcdefabcdef",
                                        employeeId: "e2",
                                        title: "H1 Performance Review",
                                        status: "open",
                                        reviewerIds: [],
                                        createdAt: "2026-04-29T12:00:00.000Z",
                                        updatedAt: "2026-04-29T12:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                example: { success: false, message: "String must contain at least 3 character(s)", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/reviews/{id}": {
            patch: {
                tags: ["Reviews"],
                summary: "Update review",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                    },
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "r1",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateReviewRequest" },
                            example: { status: "closed", title: "Q2 Performance Review (final)" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Updated review",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Review updated",
                                    data: {
                                        id: "r1",
                                        employeeId: "e2",
                                        title: "Q2 Performance Review (final)",
                                        status: "closed",
                                        reviewerIds: ["e3"],
                                        createdAt: "2026-04-28T10:00:00.000Z",
                                        updatedAt: "2026-04-29T14:30:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Review not found",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Review not found", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/reviews/{id}/assign": {
            post: {
                tags: ["Reviews"],
                summary: "Assign reviewer to review",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["admin"] },
                        example: "admin",
                    },
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Review id",
                        example: "r1",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AssignReviewerRequest" },
                            example: { reviewerId: "e3" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Reviewer added to reviewerIds",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Reviewer assigned",
                                    data: {
                                        id: "r1",
                                        employeeId: "e2",
                                        title: "Q2 Performance Review",
                                        status: "open",
                                        reviewerIds: ["e3"],
                                        createdAt: "2026-04-28T10:00:00.000Z",
                                        updatedAt: "2026-04-29T15:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Review not found",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Review not found", data: null },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/reviews/pending/{reviewerId}": {
            get: {
                tags: ["Reviews"],
                summary: "List open reviews pending feedback from this reviewer",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["employee", "admin"] },
                        example: "employee",
                        description: "Use `employee` (or `admin` for testing)",
                    },
                    {
                        name: "reviewerId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "e3",
                    },
                ],
                responses: {
                    "200": {
                        description: "Reviews assigned to reviewer without submitted feedback yet",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Pending reviews fetched",
                                    data: [
                                        {
                                            id: "r1",
                                            employeeId: "e2",
                                            title: "Q2 Performance Review",
                                            status: "open",
                                            reviewerIds: ["e3"],
                                            createdAt: "2026-04-28T10:00:00.000Z",
                                            updatedAt: "2026-04-28T10:00:00.000Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
        "/api/reviews/{id}/feedback": {
            post: {
                tags: ["Reviews"],
                summary: "Submit feedback for a review",
                description: "Reviewer must appear in the review's `reviewerIds`.",
                security: [{ RoleHeader: [] }],
                parameters: [
                    {
                        name: "x-role",
                        in: "header",
                        required: true,
                        schema: { type: "string", enum: ["employee", "admin"] },
                        example: "employee",
                    },
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Review id",
                        example: "r1",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/SubmitFeedbackRequest" },
                            example: {
                                reviewerId: "e3",
                                comment: "Excellent partner on cross-team initiatives.",
                                rating: 5,
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Feedback stored",
                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Feedback submitted",
                                    data: {
                                        id: "f8e7d6c5-b4a3-2010-fedc-ba9876543210",
                                        reviewId: "r1",
                                        reviewerId: "e3",
                                        comment: "Excellent partner on cross-team initiatives.",
                                        rating: 5,
                                        createdAt: "2026-04-29T16:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Reviewer not assigned or invalid review",
                        content: {
                            "application/json": {
                                example: {
                                    success: false,
                                    message: "Invalid review or reviewer not assigned for this review",
                                    data: null,
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                example: { success: false, message: "Forbidden: insufficient permissions", data: null },
                            },
                        },
                    },
                },
            },
        },
    },
};
