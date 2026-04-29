import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HomePage = () => {
  return (
    <div className="space-y-8">
      

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">For administrators</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Add employees under <strong>Employees</strong>.</li>
            <li>
              Under <strong>Reviews</strong>, create a review for the person being evaluated, then assign colleagues as
              reviewers (not the same person).
            </li>
            <li>Reviewers complete feedback under <strong>My feedback</strong>.</li>
            <li>Track submissions in the feedback table on the Reviews page.</li>
          </ol>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/employees"
              className="group flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white p-4 shadow transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-slate-900">Employees</h3>
                <p className="mt-1 text-sm text-slate-600">View, add, edit, remove, promote.</p>
              </div>
              <ArrowForwardIcon className="text-slate-400 transition group-hover:text-slate-900" />
            </Link>
            <Link
              to="/admin/reviews"
              className="group flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white p-4 shadow transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-slate-900">Reviews</h3>
                <p className="mt-1 text-sm text-slate-600">Create, assign, close, audit feedback.</p>
              </div>
              <ArrowForwardIcon className="text-slate-400 transition group-hover:text-slate-900" />
            </Link>
          </div>
        </section>

        <section className="rounded-md border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-800">For employees</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Open <strong>My feedback</strong>.</li>
            <li>Select yourself, then choose an open review you were assigned to.</li>
            <li>Submit your comment and rating; you can edit submissions until the review is closed.</li>
          </ol>
          <Link
            to="/employee"
            className="group flex items-center justify-between rounded-md border border-emerald-200 bg-white p-5 shadow transition hover:border-emerald-300 hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold text-slate-900">My feedback</h3>
              <p className="mt-1 text-sm text-slate-600">Pending reviews and your submissions.</p>
            </div>
            <ArrowForwardIcon className="text-emerald-600 transition group-hover:text-emerald-900" />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
