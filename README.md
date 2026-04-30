# CysecK Challenge Submission

Simple fullstack app for the employee feedback challenge.

## Tech

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Storage: JSON file (`backend/data/db.json`)

## What is implemented

### Admin pages
- Add / edit / delete employees
- Create reviews
- Assign reviewers to a review
- Open/close review status
- View feedback log

### Employee page
- View pending reviews assigned to them
- Submit feedback (comment + rating)
- View previously submitted feedback

## Main APIs used

- `GET /api/employees`
- `POST /api/employees`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/reviews`
- `POST /api/reviews`
- `PATCH /api/reviews/:id`
- `POST /api/reviews/:id/assign`
- `GET /api/reviews/pending/:reviewerId`
- `POST /api/reviews/:id/feedback`
- `GET /api/feedbacks`

## Assumptions

- No login/auth flow was required, so role is passed through `x-role` header.
- JSON file persistence is enough for challenge scope.
- Reviews accept feedback only when status is `open`.
- A reviewer cannot be the same person as the review subject.

## Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`
