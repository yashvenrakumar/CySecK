import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useEmployees, useFeedbacks, useReviews } from "../../hooks";
import { apiErrorMessage } from "../../shared/api/errorMessage";

const COMMENT_MIN = 2;

const EmployeePage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const { employees, getEmployees } = useEmployees();
  const { myFeedbacks, getFeedbacksForReviewer } = useFeedbacks();
  const { pendingReviews, getPendingReviews, postReviewFeedback } = useReviews();
   const [selectedReviewId, setSelectedReviewId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

   const employeeOptions = useMemo(() => employees, [employees]);
  const currentUser = useMemo(() => employees.find((e) => e.id === employeeId), [employees, employeeId]);

  const selectedReview = useMemo(
    () => pendingReviews.find((r) => r.id === selectedReviewId),
    [pendingReviews, selectedReviewId],
  );
  const revieweeForSelected = useMemo(
    () => (selectedReview ? employees.find((e) => e.id === selectedReview.employeeId) : undefined),
    [employees, selectedReview],
  );

  useEffect(() => {
    void getEmployees()
      .unwrap()
      .catch(() => alert("Could not load employees. Check the API and VITE_API_BASE_URL."));
  }, [getEmployees]);

  useEffect(() => {
    if (!employeeId || employees.length === 0) return;
    if (!employees.some((e) => e.id === employeeId)) {
      setEmployeeId("");
      setSelectedReviewId("");
      alert("Selected reviewer is no longer in the directory. Choose again.");
    }
  }, [employees, employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    void getPendingReviews(employeeId);
    void getFeedbacksForReviewer(employeeId);
  }, [getPendingReviews, getFeedbacksForReviewer, employeeId]);

   useEffect(() => {
    if (!selectedReviewId) return;
    if (!pendingReviews.some((r) => r.id === selectedReviewId)) {
      setSelectedReviewId("");
    }
  }, [pendingReviews, selectedReviewId]);

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();

    if (!employeeId) {
      alert("Select who is giving feedback (you).");
      return;
    }
    if (!selectedReviewId || !selectedReview) {
      alert(pendingReviews.length === 0 ? "No review assigned to you yet." : "Select a review from the list.");
      return;
    }
    if (selectedReview.employeeId === employeeId) {
      alert("You cannot send feedback about yourself in this flow.");
      return;
    }
    const trimmed = comment.trim();
    if (trimmed.length < COMMENT_MIN) {
      alert(`Comment must be at least ${COMMENT_MIN} characters.`);
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Choose a rating from 1 to 5 stars.");
      return;
    }

    try {
      await postReviewFeedback({
        reviewId: selectedReviewId,
        reviewerId: employeeId,
        comment: trimmed,
        rating,
      }).unwrap();
      setComment("");
      setRating(0);
      setSelectedReviewId("");
      void getFeedbacksForReviewer(employeeId);
      void getPendingReviews(employeeId);
      alert("Feedback submitted");
    } catch (err) {
      alert(apiErrorMessage(err, "Could not submit feedback"));
    }
  };

  const formEnabled = Boolean(employeeId && selectedReviewId);

  return (
    <section className="page-card">
      <h1 className="page-title">My feedback</h1>
     

      <div className="panel-soft">
        <div>
          <label className="label-main">You are (giving feedback)</label>
          <select
            className="input-basic input-max"
            value={employeeId}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setEmployeeId("");
                setSelectedReviewId("");
              } else {
                setEmployeeId(v);
              }
            }}
          >
            <option value="">— Select current employee —</option>
            {employeeOptions.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.email}
              </option>
            ))}
          </select>
          {employees.length === 0 && (
            <p className="small-note">Loading directory…</p>
          )}
        </div>

        <div>
          <label className="label-main">Review to complete</label>
          <select
            className="input-basic input-max"
            value={selectedReviewId}
            onChange={(e) => setSelectedReviewId(e.target.value)}
            disabled={!employeeId || pendingReviews.length === 0}
          >
            <option value="">
              {pendingReviews.length === 0 ? "— No open reviews for you —" : "— Choose a review —"}
            </option>
            {pendingReviews.map((r) => {
              const about = employees.find((e) => e.id === r.employeeId);
              const label = about ? `${about.name} · ${r.title}` : `${r.employeeId} · ${r.title}`;
              return (
                <option key={r.id} value={r.id}>
                  {label}
                </option>
              );
            })}
          </select>
          {!employeeId && <p className="small-note">Select yourself first.</p>}
          {employeeId && pendingReviews.length === 0 && (
            <p className="small-note">Ask admin to assign you on open review.</p>
          )}
          {employeeId && selectedReview && revieweeForSelected && (
            <p className="small-note text-open">
              About: <strong>{revieweeForSelected.name}</strong>
              {revieweeForSelected.email ? <span> · {revieweeForSelected.email}</span> : null} ·{" "}
              <span className="row-name-inline">{selectedReview.title}</span>
            </p>
          )}
        </div>

        {currentUser && (
          <div className="panel-green row-split">
            <span>
              Reviewer: <strong>{currentUser.name}</strong> · {currentUser.email}
            </span>
            <button
              type="button"
              className="btn-outline btn-tiny"
              onClick={() => {
                setEmployeeId("");
                setSelectedReviewId("");
              }}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      <h2 className="section-title">Pending for you (overview)</h2>
      {!employeeId ? (
        <p className="empty-note">Select yourself above to load reviews assigned to you.</p>
      ) : pendingReviews.length === 0 ? (
        <p className="empty-note">No pending reviews right now.</p>
      ) : (
        <ul className="list-basic">
          {pendingReviews.map((review) => {
            const about = employees.find((e) => e.id === review.employeeId);
            return (
              <li key={review.id} className="list-row-card">
                <div className="row-name">{review.title}</div>
                <div className="row-email">
                  About:{" "}
                  <span className="row-name-inline">{about?.name ?? review.employeeId}</span>
                  {about?.email ? <span> · {about.email}</span> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {employeeId && (
        <div className="panel-top-border">
          <h2 className="section-title">Feedback you submitted</h2>
          <p className="page-subtitle">
            You ({currentUser?.name ?? "…"}) gave this feedback <strong>about</strong> the colleague listed.
          </p>
          {myFeedbacks.length === 0 ? (
            <p className="empty-note">No submissions yet for your account.</p>
          ) : (
            <div className="table-wrap">
              <table className="table-basic table-medium">
                <thead className="table-head">
                  <tr>
                    <th>About</th>
                    <th>Review</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {myFeedbacks.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div className="row-name">{f.revieweeName}</div>
                        <div className="row-email">{f.revieweeEmail}</div>
                      </td>
                      <td>{f.reviewTitle}</td>
                      <td>{f.rating} / 5</td>
                      <td className="cell-comment">{f.comment}</td>
                      <td className="cell-time">
                        <div>{new Date(f.createdAt).toLocaleString()}</div>
                        {f.updatedAt ? <div className="text-muted">Edited</div> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <form onSubmit={submitFeedback} className="form-block form-top-border">
        <h3 className="section-subtitle">Submit feedback</h3>
        <label className="label-main" htmlFor="feedback-comment">
          Comment
        </label>
        <textarea
          id="feedback-comment"
          className="input-basic textarea-basic"
          placeholder={`At least ${COMMENT_MIN} characters…`}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!formEnabled}
        />
        <div className="stack-1">
          <span className="label-main">Rating (1–5 stars)</span>
          <div className="row-gap-2">
            <input
              type="number"
              min={1}
              max={5}
              step={1}
              className="input-basic"
              style={{ width: "90px" }}
              value={rating === 0 ? "" : rating}
              onChange={(e) => setRating(Number(e.target.value) || 0)}
              disabled={!formEnabled}
            />
            {rating > 0 ? (
              <span className="small-note">{rating} / 5</span>
            ) : (
              <span className="small-note">Tap a star to choose</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn-dark"
          disabled={!formEnabled}
        >
          Submit Feedback
        </button>
      </form>
    </section>
  );
};

export default EmployeePage;
