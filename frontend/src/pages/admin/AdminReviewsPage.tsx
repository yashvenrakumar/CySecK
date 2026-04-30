import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useEmployees, useFeedbacks, useReviews } from "../../hooks";
import { apiErrorMessage } from "../../shared/api/errorMessage";

const AdminReviewsPage = () => {
  const { employees, getEmployees } = useEmployees();
  const { adminFeedbacks, getAllFeedbacks } = useFeedbacks();
  const { reviews, getReviews, postReview, postReviewAssign, patchReview } = useReviews();
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewEmployeeId, setReviewEmployeeId] = useState("");
  const [assignReviewId, setAssignReviewId] = useState("");
  const [assignReviewerId, setAssignReviewerId] = useState("");

  const selectedReview = useMemo(
    () => reviews.find((r) => r.id === assignReviewId),
    [reviews, assignReviewId],
  );

   const assignReviewerOptions = useMemo(() => {
    const subjectId = selectedReview?.employeeId;
    if (!subjectId) return employees;
    return employees.filter((e) => e.id !== subjectId);
  }, [employees, selectedReview?.employeeId]);

  const loadAdminData = () => {
    void getEmployees().unwrap().catch((e) => alert(apiErrorMessage(e, "Could not load employees")));
    void getReviews().unwrap().catch((e) => alert(apiErrorMessage(e, "Could not load reviews")));
    void getAllFeedbacks().unwrap().catch((e) => alert(apiErrorMessage(e, "Could not load feedback log")));
  };

  useEffect(() => {
    loadAdminData();
  }, [getEmployees, getReviews, getAllFeedbacks]);

  useEffect(() => {
    if (assignReviewerId && selectedReview && assignReviewerId === selectedReview.employeeId) {
      setAssignReviewerId("");
    }
  }, [assignReviewerId, selectedReview]);

  useEffect(() => {
    if (!assignReviewerId) return;
    if (!assignReviewerOptions.some((e) => e.id === assignReviewerId)) {
      setAssignReviewerId("");
    }
  }, [assignReviewerId, assignReviewerOptions]);

  const refreshAdminData = () => {
    void getEmployees().unwrap().catch(() => {});
    void getReviews().unwrap().catch(() => {});
    void getAllFeedbacks().unwrap().catch(() => {});
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    const title = reviewTitle.trim();
    if (!reviewEmployeeId) {
      alert("Choose whose performance review this is.");
      return;
    }
    if (title.length < 3) {
      alert("Review title must be at least 3 characters.");
      return;
    }
    try {
      await postReview(
        {
          employeeId: reviewEmployeeId,
          title,
          reviewerIds: [],
          status: "open",
        },
        "admin",
      ).unwrap();
      setReviewTitle("");
      setReviewEmployeeId("");
      alert("Review created (open). Assign reviewers next.");
      refreshAdminData();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not create review"));
    }
  };

  const submitAssign = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignReviewId || !assignReviewerId) {
      alert("Select both a review and a reviewer.");
      return;
    }
    if (selectedReview && assignReviewerId === selectedReview.employeeId) {
      alert("The person being reviewed cannot be their own peer reviewer.");
      return;
    }
    try {
      await postReviewAssign(assignReviewId, assignReviewerId, "admin").unwrap();
      setAssignReviewerId("");
      alert("Reviewer assigned");
      refreshAdminData();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not assign reviewer"));
    }
  };

  const toggleStatus = async (id: string, currentlyOpen: boolean) => {
    try {
      await patchReview(id, currentlyOpen ? "closed" : "open", "admin").unwrap();
      alert(currentlyOpen ? "Review closed" : "Review reopened");
      refreshAdminData();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update review"));
    }
  };

  return (
    <section className="page-card">
      <h1 className="page-title">Performance</h1>
      

      <h2 className="section-title">New review</h2>
      <form onSubmit={submitReview} className="form-block">
        <label className="label-small" htmlFor="review-subject">
          Employee reviewed
        </label>
        <select
          id="review-subject"
          className="input-basic"
          value={reviewEmployeeId}
          onChange={(e) => setReviewEmployeeId(e.target.value)}
        >
          <option value="">Select person</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {e.email} ({e.role})
            </option>
          ))}
        </select>
        <input
          className="input-basic"
          placeholder="Review title (e.g. Q2 2026)"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
        />
        <button type="submit" className="btn-dark">
          Create open review
        </button>
      </form>

      <h3 className="section-subtitle">Assign reviewer</h3>
    
      <form onSubmit={submitAssign} className="form-block form-top-border">
        <select
          className="input-basic"
          value={assignReviewId}
          onChange={(e) => {
            setAssignReviewId(e.target.value);
            setAssignReviewerId("");
          }}
        >
          <option value="">Select</option>
          {reviews.map((r) => {
            const subject = employees.find((e) => e.id === r.employeeId);
            return (
              <option key={r.id} value={r.id}>
                {r.title} · {subject?.name ?? r.employeeId} · {r.status}
              </option>
            );
          })}
        </select>
        <select
          className="input-basic"
          value={assignReviewerId}
          onChange={(e) => setAssignReviewerId(e.target.value)}
          disabled={!assignReviewId}
        >
          <option value="">
            {!assignReviewId ? "Select a review first" : "Select reviewer (peer)"}
          </option>
          {assignReviewerOptions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {e.email}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn-mid"
          disabled={!assignReviewId || !assignReviewerId}
        >
          Assign reviewer
        </button>
      </form>

      <h3 className="section-subtitle">All review</h3>
      <ul className="list-basic">
        {reviews.map((r) => {
          const subject = employees.find((e) => e.id === r.employeeId);
          const open = r.status === "open";
          return (
            <li key={r.id} className="list-row-card">
              <div className="row-split">
                <div>
                  <div className="row-name">{r.title}</div>
                  <div className="row-email">
                    About: <span className="row-name-inline">{subject?.name ?? r.employeeId}</span>
                    {subject?.email ? ` · ${subject.email}` : ""} ·{" "}
                    <span className={open ? "text-open" : "text-closed"}>
                      {open ? "Open" : "Closed"}
                    </span>
                    {r.reviewerIds.length > 0 && (
                      <span className="text-muted"> · {r.reviewerIds.length} reviewer(s)</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-light btn-tiny"
                  onClick={() => void toggleStatus(r.id, open)}
                >
                  {open ? "Close review" : "Reopen review"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <h3 className="section-subtitle">Feedback log  </h3>
      
      {adminFeedbacks.length === 0 ? (
        <p className="empty-note">No feedback submitted</p>
      ) : (
        <div className="table-wrap">
          <table className="table-basic">
            <thead className="table-head">
              <tr>
                <th>From</th>
                <th>To (about)</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {adminFeedbacks.map((f) => (
                <tr key={f.id}>
                  <td>
                    <div className="row-name">{f.reviewerName}</div>
                    <div className="row-email">{f.reviewerEmail}</div>
                  </td>
                  <td>
                    <div className="row-name">{f.revieweeName}</div>
                    <div className="row-email">{f.revieweeEmail}</div>
                  </td>
                  <td>{f.reviewTitle}</td>
                  <td>{f.rating} / 5</td>
                  <td className="cell-comment" title={f.comment}>
                    {f.comment}
                  </td>
                  <td className="cell-time">
                    <div>{new Date(f.createdAt).toLocaleString()}</div>
                    {f.updatedAt ? (
                      <div className="text-muted">Edited {new Date(f.updatedAt).toLocaleString()}</div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminReviewsPage;
