# CysecK Fullstack Developer Challenge

This submission implements the employee performance review portal requested in the challenge with a runnable fullstack setup.

## Stack Used

- Frontend: React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + Material UI Icons + React Toastify
- Backend: Node.js + Express + TypeScript in MVC style (`server`, `route`, `middleware`, `validation`, `controller`, `service`, `model`)
- API docs: Swagger/OpenAPI at `/api-docs`
- Data storage: JSON file CRUD at `backend/data/db.json`

## Features Implemented

- Admin view:
  - Add/view/update/remove employees
  - Add/view/update performance reviews
  - Assign employees as reviewers for other employees' reviews
- Employee view:
  - List reviews requiring feedback
  - Submit feedback
- Standardized API response format across backend.
- Basic RBAC using `x-role` header (`admin` / `employee`).

## Folder Structure

- `frontend/src/features/*` uses feature-based slices for employees/reviews/session.
- `frontend/src/hooks/*` exposes REST-aligned custom hooks; API origin is `frontend/.env` → `VITE_API_BASE_URL`.
- `backend/src/*` follows MVC-like separation with middleware, validations, services, controllers, and routes.

## Run Locally

### 1) Start backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at [http://localhost:4000](http://localhost:4000) and Swagger at [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

### 2) Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at [http://localhost:5173](http://localhost:5173). Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` (default `http://localhost:4000`); the app calls `{VITE_API_BASE_URL}/api/...`.

## Implemented API Endpoints (sample)

- `GET /api/employees`
- `POST /api/employees`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/feedbacks` — admin: all; employee: `?reviewerId=` (each row includes reviewer + reviewee names/emails)
- `GET /api/reviews`
- `POST /api/reviews`
- `PATCH /api/reviews/:id`
- `POST /api/reviews/:id/assign`
- `GET /api/reviews/pending/:reviewerId`
- `POST /api/reviews/:id/feedback`

## Assumptions

- No full authentication required by prompt; role simulation is via `x-role` header from UI.
- JSON file database is acceptable for this challenge scope.
- Employee view: **My feedback** uses two dropdowns (reviewer + reviewee; reviewee excludes reviewer), validation, then submit against an assigned open review.
