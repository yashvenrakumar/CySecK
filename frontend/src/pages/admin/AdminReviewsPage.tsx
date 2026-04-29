import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { toast } from "react-toastify";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { useLocation } from "react-router-dom";
import { useEmployees, useFeedbacks, useReviews } from "../../hooks";
import { apiErrorMessage } from "../../shared/api/errorMessage";
import type { FeedbackEnriched } from "../../shared/types";

type FeedbackSortKey = "from" | "to" | "review" | "rating" | "comment" | "when";

const AdminReviewsPage = () => {
  const location = useLocation();
  const { employees, getEmployees } = useEmployees();
  const { adminFeedbacks, getAllFeedbacks } = useFeedbacks();
  const { reviews, getReviews, postReview, postReviewAssign, patchReview } = useReviews();
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewEmployeeId, setReviewEmployeeId] = useState("");
  const [assignReviewId, setAssignReviewId] = useState("");
  const [assignReviewerId, setAssignReviewerId] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("");
  const [feedbackSort, setFeedbackSort] = useState<{ key: FeedbackSortKey; dir: "asc" | "desc" }>({
    key: "when",
    dir: "desc",
  });

  const selectedReview = useMemo(
    () => reviews.find((r) => r.id === assignReviewId),
    [reviews, assignReviewId],
  );

  /** Anyone in the directory except the review subject may be a peer reviewer (admins included). */
  const assignReviewerOptions = useMemo(() => {
    const subjectId = selectedReview?.employeeId;
    if (!subjectId) return employees;
    return employees.filter((e) => e.id !== subjectId);
  }, [employees, selectedReview?.employeeId]);

  const loadAdminData = useCallback(() => {
    void getEmployees().unwrap().catch((e) => toast.error(apiErrorMessage(e, "Could not load employees")));
    void getReviews().unwrap().catch((e) => toast.error(apiErrorMessage(e, "Could not load reviews")));
    void getAllFeedbacks().unwrap().catch((e) => toast.error(apiErrorMessage(e, "Could not load feedback log")));
  }, [getEmployees, getReviews, getAllFeedbacks]);

  useEffect(() => {
    loadAdminData();
  }, [location.key, loadAdminData]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      loadAdminData();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadAdminData]);

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
      toast.error("Choose whose performance review this is.");
      return;
    }
    if (title.length < 3) {
      toast.error("Review title must be at least 3 characters.");
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
      toast.success("Review created (open). Assign reviewers next.");
      refreshAdminData();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not create review"));
    }
  };

  const submitAssign = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignReviewId || !assignReviewerId) {
      toast.error("Select both a review and a reviewer.");
      return;
    }
    if (selectedReview && assignReviewerId === selectedReview.employeeId) {
      toast.error("The person being reviewed cannot be their own peer reviewer.");
      return;
    }
    try {
      await postReviewAssign(assignReviewId, assignReviewerId, "admin").unwrap();
      setAssignReviewerId("");
      toast.success("Reviewer assigned");
      refreshAdminData();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not assign reviewer"));
    }
  };

  const toggleFeedbackSort = (key: FeedbackSortKey) => {
    setFeedbackSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "when" ? "desc" : "asc" },
    );
  };

  const filteredSortedFeedbacks = useMemo(() => {
    const q = feedbackFilter.trim().toLowerCase();
    let rows: FeedbackEnriched[] = adminFeedbacks;
    if (q) {
      rows = rows.filter((f) => {
        const blob = [
          f.reviewerName,
          f.reviewerEmail,
          f.revieweeName,
          f.revieweeEmail,
          f.reviewTitle,
          f.comment,
          String(f.rating),
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      });
    }
    const mul = feedbackSort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (feedbackSort.key) {
        case "from":
          return mul * a.reviewerName.localeCompare(b.reviewerName, undefined, { sensitivity: "base" });
        case "to":
          return mul * a.revieweeName.localeCompare(b.revieweeName, undefined, { sensitivity: "base" });
        case "review":
          return mul * a.reviewTitle.localeCompare(b.reviewTitle, undefined, { sensitivity: "base" });
        case "rating":
          return mul * (a.rating - b.rating);
        case "comment":
          return mul * a.comment.localeCompare(b.comment, undefined, { sensitivity: "base" });
        case "when":
          return mul * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return 0;
      }
    });
  }, [adminFeedbacks, feedbackFilter, feedbackSort]);

  const toggleStatus = async (id: string, currentlyOpen: boolean) => {
    try {
      await patchReview(id, currentlyOpen ? "closed" : "open", "admin").unwrap();
      toast.success(currentlyOpen ? "Review closed" : "Review reopened");
      refreshAdminData();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update review"));
    }
  };

  return (
    <section className="rounded-md bg-white p-4 shadow">
      <h1 className="mb-1 text-xl font-bold text-slate-900">Performance reviews</h1>
      <p className="mb-4 text-sm text-slate-600">
        Create a review for one employee, assign other employees as reviewers, then monitor feedback. Only{" "}
        <strong>open</strong> reviews accept new submissions.
      </p>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <RateReviewIcon />
        New review
      </h2>
      <form onSubmit={submitReview} className="mb-8 max-w-md space-y-2">
        <label className="block text-xs font-medium text-slate-600" htmlFor="review-subject">
          Employee being reviewed
        </label>
        <select
          id="review-subject"
          className="w-full rounded-md border border-slate-300 p-2"
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
          className="w-full rounded-md border border-slate-300 p-2"
          placeholder="Review title (e.g. Q2 2026)"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
        />
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-white">
          Create open review
        </button>
      </form>

      <h3 className="mb-2 text-sm font-semibold text-slate-800">Assign peer reviewer</h3>
      <p className="mb-3 text-xs text-slate-600">
        Pick the review, then a colleague who should give feedback. They cannot be the same person as the review
        subject.
      </p>
      <form onSubmit={submitAssign} className="mb-8 max-w-md space-y-2 border-t border-slate-100 pt-4">
        <select
          className="w-full rounded-md border border-slate-300 p-2"
          value={assignReviewId}
          onChange={(e) => {
            setAssignReviewId(e.target.value);
            setAssignReviewerId("");
          }}
        >
          <option value="">Select review</option>
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
          className="w-full rounded-md border border-slate-300 p-2"
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
          className="rounded-md bg-slate-700 px-3 py-2 text-white disabled:opacity-50"
          disabled={!assignReviewId || !assignReviewerId}
        >
          Assign reviewer
        </button>
      </form>

      <h3 className="mb-2 text-sm font-semibold text-slate-800">All reviews</h3>
      <ul className="mb-8 space-y-2 text-sm">
        {reviews.map((r) => {
          const subject = employees.find((e) => e.id === r.employeeId);
          const open = r.status === "open";
          return (
            <li key={r.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-900">{r.title}</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    About: <span className="font-medium">{subject?.name ?? r.employeeId}</span>
                    {subject?.email ? ` · ${subject.email}` : ""} ·{" "}
                    <span className={open ? "text-emerald-700" : "text-slate-500"}>
                      {open ? "Open" : "Closed"}
                    </span>
                    {r.reviewerIds.length > 0 && (
                      <span className="text-slate-500"> · {r.reviewerIds.length} reviewer(s)</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium"
                  onClick={() => void toggleStatus(r.id, open)}
                >
                  {open ? "Close review" : "Reopen review"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <ForumOutlinedIcon sx={{ fontSize: 20 }} />
        Feedback log (who → whom)
      </h3>
      <p className="mb-3 text-xs text-slate-600">
        <strong>From</strong> = who wrote feedback · <strong>To</strong> = employee whose review it is about. Use search
        to narrow rows; click a column header to sort.
      </p>
      {adminFeedbacks.length === 0 ? (
        <p className="text-sm text-slate-500">No feedback submitted yet.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="block max-w-md flex-1 text-xs font-medium text-slate-600">
              Search log
              <input
                type="search"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
                placeholder="Name, email, review title, comment, rating…"
                value={feedbackFilter}
                onChange={(e) => setFeedbackFilter(e.target.value)}
                autoComplete="off"
              />
            </label>
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">{filteredSortedFeedbacks.length}</span> of{" "}
              {adminFeedbacks.length}
            </p>
          </div>
          {filteredSortedFeedbacks.length === 0 ? (
            <p className="text-sm text-slate-500">No rows match your search.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                  <tr>
                    {(
                      [
                        ["from", "From"] as const,
                        ["to", "To (about)"] as const,
                        ["review", "Review"] as const,
                        ["rating", "Rating"] as const,
                        ["comment", "Comment"] as const,
                        ["when", "When"] as const,
                      ] as const
                    ).map(([key, label]) => {
                      const active = feedbackSort.key === key;
                      const arrow = !active ? "" : feedbackSort.dir === "asc" ? " ↑" : " ↓";
                      return (
                        <th key={key} className="px-3 py-2">
                          <button
                            type="button"
                            className={`flex w-full items-center gap-1 text-left font-semibold uppercase tracking-wide hover:text-slate-900 ${active ? "text-slate-900" : ""}`}
                            onClick={() => toggleFeedbackSort(key)}
                          >
                            {label}
                            <span className="font-normal normal-case text-slate-500">{arrow}</span>
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredSortedFeedbacks.map((f) => (
                    <tr key={f.id}>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{f.reviewerName}</div>
                        <div className="text-xs text-slate-500">{f.reviewerEmail}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{f.revieweeName}</div>
                        <div className="text-xs text-slate-500">{f.revieweeEmail}</div>
                      </td>
                      <td className="px-3 py-2 text-slate-800">{f.reviewTitle}</td>
                      <td className="px-3 py-2">{f.rating} / 5</td>
                      <td className="max-w-[200px] truncate px-3 py-2 text-slate-700" title={f.comment}>
                        {f.comment}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                        <div>{new Date(f.createdAt).toLocaleString()}</div>
                        {f.updatedAt ? (
                          <div className="mt-0.5 text-slate-500">Edited {new Date(f.updatedAt).toLocaleString()}</div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminReviewsPage;
