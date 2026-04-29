import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearEmployeeIdentity, setEmployeeId } from "../../features/session/sessionSlice";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { useEmployees, useFeedbacks, useReviews } from "../../hooks";
import { apiErrorMessage } from "../../shared/api/errorMessage";

const COMMENT_MIN = 2;

const EmployeePage = () => {
  const dispatch = useAppDispatch();
  const employeeId = useAppSelector((s) => s.session?.employeeId ?? "");
  const { employees, getEmployees } = useEmployees();
  const { myFeedbacks, getFeedbacksForReviewer, updateMyFeedback } = useFeedbacks();
  const { pendingReviews, getPendingReviews, postReviewFeedback } = useReviews();
  /** Open review you were assigned to and have not submitted yet */
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  /** Everyone in the directory can be a reviewer if assigned (includes admins). */
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
      .catch(() => toast.error("Could not load employees. Check the API and VITE_API_BASE_URL."));
  }, [getEmployees]);

  useEffect(() => {
    if (!employeeId || employees.length === 0) return;
    if (!employees.some((e) => e.id === employeeId)) {
      dispatch(clearEmployeeIdentity());
      setSelectedReviewId("");
      toast.info("Selected reviewer is no longer in the directory. Choose again.");
    }
  }, [employees, employeeId, dispatch]);

  useEffect(() => {
    if (!employeeId) return;
    void getPendingReviews(employeeId);
    void getFeedbacksForReviewer(employeeId);
  }, [getPendingReviews, getFeedbacksForReviewer, employeeId]);

  useEffect(() => {
    setEditingFeedbackId(null);
  }, [employeeId]);

  /** Drop selection if that review is no longer pending (e.g. after submit or refresh). */
  useEffect(() => {
    if (!selectedReviewId) return;
    if (!pendingReviews.some((r) => r.id === selectedReviewId)) {
      setSelectedReviewId("");
    }
  }, [pendingReviews, selectedReviewId]);

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();

    if (!employeeId) {
      toast.error("Select who is giving feedback (you).");
      return;
    }
    if (!selectedReviewId || !selectedReview) {
      toast.error(pendingReviews.length === 0 ? "No review assigned to you yet." : "Select a review from the list.");
      return;
    }
    if (selectedReview.employeeId === employeeId) {
      toast.error("You cannot send feedback about yourself in this flow.");
      return;
    }
    const trimmed = comment.trim();
    if (trimmed.length < COMMENT_MIN) {
      toast.error(`Comment must be at least ${COMMENT_MIN} characters.`);
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Choose a rating from 1 to 5 stars.");
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
      toast.success("Feedback submitted");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not submit feedback"));
    }
  };

  const formEnabled = Boolean(employeeId && selectedReviewId);

  const startEditFeedback = (row: (typeof myFeedbacks)[number]) => {
    setEditingFeedbackId(row.id);
    setEditComment(row.comment);
    setEditRating(row.rating);
  };

  const cancelEditFeedback = () => {
    setEditingFeedbackId(null);
    setEditComment("");
    setEditRating(0);
  };

  const saveEditFeedback = async () => {
    if (!employeeId || !editingFeedbackId) return;
    const trimmed = editComment.trim();
    if (trimmed.length < COMMENT_MIN) {
      toast.error(`Comment must be at least ${COMMENT_MIN} characters.`);
      return;
    }
    if (editRating < 1 || editRating > 5) {
      toast.error("Choose a rating from 1 to 5 stars.");
      return;
    }
    try {
      await updateMyFeedback({
        feedbackId: editingFeedbackId,
        reviewerId: employeeId,
        comment: trimmed,
        rating: editRating,
      }).unwrap();
      cancelEditFeedback();
      void getFeedbacksForReviewer(employeeId);
      toast.success("Feedback updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update feedback"));
    }
  };

  return (
    <section className="rounded-md bg-white p-4 shadow">
      <h1 className="mb-1 text-xl font-bold text-slate-900">My feedback</h1>
      <p className="mb-4 text-sm text-slate-600">
        Choose <strong>you</strong>, then pick one of <strong>your open reviews</strong> (each row is a colleague you
        were assigned to review). Comment and stars apply to that review only.
      </p>

      <div className="mb-6 space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            You are (giving feedback)
          </label>
          <select
            className="w-full max-w-md rounded-md border border-slate-300 bg-white p-2 text-sm"
            value={employeeId}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                dispatch(clearEmployeeIdentity());
                setSelectedReviewId("");
              } else {
                dispatch(setEmployeeId(v));
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
            <p className="mt-1 text-xs text-slate-500">Loading directory…</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Review to complete</label>
          <select
            className="w-full max-w-md rounded-md border border-slate-300 bg-white p-2 text-sm"
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
          {!employeeId && <p className="mt-1 text-xs text-slate-500">Select yourself first.</p>}
          {employeeId && pendingReviews.length === 0 && (
            <p className="mt-1 text-xs text-slate-600">Ask an admin to assign you on an open review.</p>
          )}
          {employeeId && selectedReview && revieweeForSelected && (
            <p className="mt-1 text-xs text-emerald-800">
              About: <strong>{revieweeForSelected.name}</strong>
              {revieweeForSelected.email ? <span> · {revieweeForSelected.email}</span> : null} ·{" "}
              <span className="font-medium">{selectedReview.title}</span>
            </p>
          )}
        </div>

        {currentUser && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            <span>
              Reviewer: <strong>{currentUser.name}</strong> · {currentUser.email}
            </span>
            <button
              type="button"
              className="rounded-md border border-emerald-300 bg-white px-2 py-1 font-medium"
              onClick={() => {
                dispatch(clearEmployeeIdentity());
                setSelectedReviewId("");
              }}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <FeedbackIcon />
        Pending for you (overview)
      </h2>
      {!employeeId ? (
        <p className="mb-4 text-sm text-slate-500">Select yourself above to load reviews assigned to you.</p>
      ) : pendingReviews.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">No pending reviews right now.</p>
      ) : (
        <ul className="mb-4 space-y-2 text-sm">
          {pendingReviews.map((review) => {
            const about = employees.find((e) => e.id === review.employeeId);
            return (
              <li key={review.id} className="rounded-md border border-slate-200 p-3">
                <div className="font-medium text-slate-900">{review.title}</div>
                <div className="mt-1 text-xs text-slate-600">
                  About:{" "}
                  <span className="font-medium text-slate-800">{about?.name ?? review.employeeId}</span>
                  {about?.email ? <span> · {about.email}</span> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {employeeId && (
        <div className="mb-6 border-t border-slate-100 pt-6">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <ForumOutlinedIcon />
            Feedback you submitted
          </h2>
          <p className="mb-3 text-sm text-slate-600">
            You ({currentUser?.name ?? "…"}) gave this feedback <strong>about</strong> the colleague listed. You can
            edit entries while the review is still open.
          </p>
          {myFeedbacks.length === 0 ? (
            <p className="text-sm text-slate-500">No submissions yet for your account.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                  <tr>
                    <th className="px-3 py-2">About</th>
                    <th className="px-3 py-2">Review</th>
                    <th className="px-3 py-2">Rating</th>
                    <th className="px-3 py-2">Comment</th>
                    <th className="px-3 py-2">When</th>
                    <th className="px-3 py-2"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {myFeedbacks.map((f) => {
                    const isEditing = editingFeedbackId === f.id;
                    const canEdit = f.reviewStatus === "open";
                    return (
                      <tr key={f.id}>
                        <td className="px-3 py-2">
                          <div className="font-medium text-slate-900">{f.revieweeName}</div>
                          <div className="text-xs text-slate-500">{f.revieweeEmail}</div>
                        </td>
                        <td className="px-3 py-2 text-slate-800">{f.reviewTitle}</td>
                        <td className="px-3 py-2 align-top">
                          {isEditing ? (
                            <Rating
                              name={`edit-rating-${f.id}`}
                              value={editRating}
                              onChange={(_, value) => setEditRating(value ?? 0)}
                              max={5}
                              precision={1}
                              size="small"
                            />
                          ) : (
                            `${f.rating} / 5`
                          )}
                        </td>
                        <td className="max-w-[260px] px-3 py-2 align-top text-slate-700">
                          {isEditing ? (
                            <textarea
                              className="min-h-[72px] w-full resize-y rounded-md border border-slate-300 p-2 text-sm"
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              rows={3}
                            />
                          ) : (
                            f.comment
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600 align-top">
                          <div>{new Date(f.createdAt).toLocaleString()}</div>
                          {f.updatedAt ? (
                            <div className="mt-0.5 text-slate-500">Edited {new Date(f.updatedAt).toLocaleString()}</div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-top">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white"
                                onClick={() => void saveEditFeedback()}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                onClick={cancelEditFeedback}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : canEdit ? (
                            <button
                              type="button"
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800"
                              onClick={() => startEditFeedback(f)}
                            >
                              Edit
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">Closed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <form onSubmit={submitFeedback} className="max-w-md space-y-3 border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-800">Submit feedback</h3>
        <label className="block text-sm font-medium text-slate-700" htmlFor="feedback-comment">
          Comment
        </label>
        <textarea
          id="feedback-comment"
          className="min-h-[100px] w-full resize-y rounded-md border border-slate-300 p-2 text-sm disabled:bg-slate-50"
          placeholder={`At least ${COMMENT_MIN} characters…`}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!formEnabled}
        />
        <div className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Rating (1–5 stars)</span>
          <div className="flex flex-wrap items-center gap-2">
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(_, value) => setRating(value ?? 0)}
              max={5}
              precision={1}
              size="large"
              disabled={!formEnabled}
            />
            {rating > 0 ? (
              <span className="text-sm text-slate-600">{rating} / 5</span>
            ) : (
              <span className="text-sm text-slate-500">Tap a star to choose</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!formEnabled}
        >
          Submit Feedback
        </button>
      </form>
    </section>
  );
};

export default EmployeePage;
