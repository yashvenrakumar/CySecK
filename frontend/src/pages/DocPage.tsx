import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
    <div className="space-y-4 text-sm text-slate-700">{children}</div>
  </section>
);

const Example = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">{title}</p>
    <div className="space-y-2 text-sm text-slate-800">{children}</div>
  </div>
);

const DocPage = () => {
  return (
    <div className="space-y-8">
      <header className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-900">
          <MenuBookOutlinedIcon sx={{ fontSize: 28 }} aria-hidden />
          <h1 className="text-2xl font-bold">CysecK user guide</h1>
        </div>
        <p className="max-w-3xl text-sm text-slate-600">
          This portal helps administrators run performance reviews and helps team members submit peer feedback. Below
          is a walkthrough of every screen and feature, with examples you can follow step by step.
        </p>
      </header>

      <nav
        aria-label="On this page"
        className="rounded-md border border-slate-200 bg-slate-50/80 p-5 text-sm shadow-sm"
      >
        <p className="mb-3 font-semibold text-slate-900">On this page</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ["#overview", "Overview & setup"],
            ["#home", "Home"],
            ["#employees", "Employees (admin)"],
            ["#reviews", "Reviews (admin)"],
            ["#feedback", "My feedback (reviewer)"],
            ["#tips", "Tips & API"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="overview" title="Overview and setup">
        <p>
          <strong>What the app does:</strong> Admins maintain a staff directory, create performance reviews for specific
          people, assign colleagues as peer reviewers, and read an audit log of submitted feedback. Reviewers use{" "}
          <strong>My feedback</strong> to complete assignments and optionally edit their submissions while a review
          stays open.
        </p>
        <p>
          <strong>Run the stack:</strong> Start the backend (default{" "}
          <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">http://localhost:4000</code>), then the frontend.
          Copy <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">frontend/.env.example</code> to{" "}
          <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">frontend/.env</code> and set{" "}
          <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">VITE_API_BASE_URL</code> to your API origin. If
          lists fail to load, check that URL and that the server is running.
        </p>
        <p>
          <strong>Roles:</strong> The UI sends an <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">x-role</code>{" "}
          header (<code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">admin</code> or{" "}
          <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs">employee</code>) for API access. There is no login
          screen in this demo; admin actions use the admin role automatically from the app hooks.
        </p>
        <p>
          <strong>API docs:</strong> Open{" "}
          <a
            href="http://localhost:4000/api-docs"
            className="font-medium text-slate-900 underline"
            target="_blank"
            rel="noreferrer"
          >
            Swagger at /api-docs
          </a>{" "}
          on your backend host for endpoint details.
        </p>
      </Section>

      <Section id="home" title="Home">
        <p>
          The <Link to="/" className="font-medium text-slate-900 underline">Home</Link> page is the starting point. It
          splits guidance into two tracks:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Administrators</strong> — Short checklist: add people under Employees, create and assign reviews,
            have reviewers use My feedback, then monitor the feedback table on Reviews.
          </li>
          <li>
            <strong>Employees (reviewers)</strong> — Open My feedback, select yourself, pick an assigned open review,
            submit rating and comment; you can edit until the review is closed.
          </li>
        </ul>
        <p>
          Use the cards on Home to jump directly to <Link to="/admin/employees" className="underline">Employees</Link>,{" "}
          <Link to="/admin/reviews" className="underline">Reviews</Link>, or{" "}
          <Link to="/employee" className="underline">My feedback</Link>.
        </p>
      </Section>

      <Section id="employees" title="Employees (admin)">
        <p>
          Path: <Link to="/admin/employees" className="font-medium underline">Employees</Link>. This is the staff
          directory. Anyone listed here can be the subject of a review, a peer reviewer, or the identity you pick in My
          feedback.
        </p>

        <h3 className="text-base font-semibold text-slate-900">Add employee</h3>
        <p>
          Fill <strong>Full name</strong> (at least 2 characters) and a valid <strong>work email</strong> (must contain{" "}
          <code className="rounded-md bg-slate-100 px-1 text-xs">@</code>). New rows are created with role{" "}
          <code className="rounded-md bg-slate-100 px-1 text-xs">employee</code>. Submit with <strong>Add employee</strong>.
          Success and errors appear as toast notifications.
        </p>
        <Example title="Example">
          <p>
            Name: <code className="rounded-md bg-white px-1.5 py-0.5 text-xs shadow-sm">Aisha Khan</code>
          </p>
          <p>
            Email: <code className="rounded-md bg-white px-1.5 py-0.5 text-xs shadow-sm">aisha.khan@company.test</code>
          </p>
        </Example>

        <h3 className="text-base font-semibold text-slate-900">Directory list</h3>
        <p>Each row shows name, role, and email.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Edit</strong> — Inline edit for name and email; same validation as add. Save or Cancel.
          </li>
          <li>
            <strong>Promote to admin</strong> — Shown only for users with role <code className="rounded-md bg-slate-100 px-1 text-xs">employee</code>.
            Changes their role to admin in the directory.
          </li>
          <li>
            <strong>Remove</strong> — Confirms before delete; removes the person from the directory.
          </li>
        </ul>
      </Section>

      <Section id="reviews" title="Reviews (admin)">
        <p>
          Path: <Link to="/admin/reviews" className="font-medium underline">Reviews</Link>. Manage review lifecycle:
          create, assign reviewers, open/close, and inspect all feedback in one table.
        </p>

        <h3 className="text-base font-semibold text-slate-900">New review</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Under <strong>Employee being reviewed</strong>, choose who the review is about (anyone in the directory).
          </li>
          <li>
            Enter a <strong>Review title</strong> with at least 3 characters (for example a quarter or project name).
          </li>
          <li>
            Click <strong>Create open review</strong>. The review starts in <strong>open</strong> status; only open
            reviews accept new feedback.
          </li>
        </ol>
        <Example title="Example">
          <p>
            Subject: <strong>Jordan Lee</strong> (from the dropdown)
          </p>
          <p>
            Title: <code className="rounded-md bg-white px-1.5 py-0.5 text-xs shadow-sm">H1 2026 performance</code>
          </p>
        </Example>

        <h3 className="text-base font-semibold text-slate-900">Assign peer reviewer</h3>
        <p>
          After creating a review, assign one reviewer at a time. Select the <strong>review</strong> first, then a{" "}
          <strong>reviewer</strong>. The reviewer cannot be the same person as the review subject; the dropdown excludes
          the subject automatically. Admins in the directory can also be assigned as reviewers.
        </p>
        <p>
          Click <strong>Assign reviewer</strong>. Repeat to add more peers. Assigned reviewers will see the review under
          My feedback while it is open and they have not yet submitted (pending list).
        </p>
        <Example title="Example">
          <p>
            Review: <code className="rounded-md bg-white px-1.5 py-0.5 text-xs shadow-sm">H1 2026 performance · Jordan Lee · open</code>
          </p>
          <p>
            Reviewer: <strong>Sam Rivera</strong> (a colleague, not Jordan)
          </p>
        </Example>

        <h3 className="text-base font-semibold text-slate-900">All reviews</h3>
        <p>
          Lists every review with title, subject name/email, <strong>Open</strong> or <strong>Closed</strong> status,
          and reviewer count. Use <strong>Close review</strong> to stop new feedback and lock reviewer edits; use{" "}
          <strong>Reopen review</strong> to allow submissions and edits again.
        </p>
        <p>
          Data refreshes when you navigate back to this page and when the browser tab becomes visible again, so leaving
          and returning can pick up changes from other sessions.
        </p>

        <h3 className="text-base font-semibold text-slate-900">Feedback log (who → whom)</h3>
        <p>
          Admin-only table of every submitted feedback row. <strong>From</strong> is the reviewer; <strong>To</strong> is
          the person whose review it is about. Columns include review title, rating (out of 5), comment, and timestamps
          (including an &quot;Edited&quot; line when a row was updated).
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Search log</strong> — Filters rows by a single text query across names, emails, review title,
            comment, and rating.
          </li>
          <li>
            <strong>Sort</strong> — Click a column header to sort; click again to flip ascending/descending. The{" "}
            <strong>When</strong> column defaults to newest first.
          </li>
          <li>
            The counter shows how many rows match the filter out of the total loaded.
          </li>
        </ul>
      </Section>

      <Section id="feedback" title="My feedback (reviewer)">
        <p>
          Path: <Link to="/employee" className="font-medium underline">My feedback</Link>. Use this when you have been
          assigned as a peer reviewer on an <strong>open</strong> review.
        </p>

        <h3 className="text-base font-semibold text-slate-900">You are (giving feedback)</h3>
        <p>
          Choose your identity from the directory dropdown. This tells the API which reviewer you are.{" "}
          <strong>Clear selection</strong> resets your choice and the review picker. If your account was removed from
          the directory, the app clears the selection and asks you to pick again.
        </p>

        <h3 className="text-base font-semibold text-slate-900">Review to complete</h3>
        <p>
          After you select yourself, the second dropdown lists <strong>pending</strong> reviews: open reviews you are
          assigned to and have not submitted feedback for yet. Pick one to enable the form; a summary line shows who the
          review is about and the review title.
        </p>
        <p>If there are no pending items, ask an admin to assign you on an open review.</p>

        <h3 className="text-base font-semibold text-slate-900">Pending for you (overview)</h3>
        <p>
          A read-only list of the same pending assignments (title and reviewee). Useful when you have several tasks.
        </p>

        <h3 className="text-base font-semibold text-slate-900">Submit feedback</h3>
        <p>Requirements:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Comment: at least 2 characters after trimming.</li>
          <li>Rating: 1–5 stars (use the star control).</li>
          <li>You cannot submit feedback on a review that is about yourself in this flow.</li>
        </ul>
        <p>
          Click <strong>Submit Feedback</strong>. The pending list updates; the review may disappear from pending if
          you completed your assignment for it.
        </p>
        <Example title="Example">
          <p>Selected reviewer: yourself (e.g. Sam Rivera)</p>
          <p>Review: Jordan Lee · H1 2026 performance</p>
          <p>
            Comment: <code className="rounded-md bg-white px-1.5 py-0.5 text-xs shadow-sm">Strong collaboration; clear ownership of the API redesign.</code>
          </p>
          <p>Rating: 4 / 5</p>
        </Example>

        <h3 className="text-base font-semibold text-slate-900">Feedback you submitted</h3>
        <p>
          Table of feedback you already gave: reviewee, review title, rating, comment, time, and an <strong>Edit</strong>{" "}
          action when the parent review is still <strong>open</strong>. Closed reviews show &quot;Closed&quot; instead
          of edit. Saving updates sends your new text and stars; timestamps can show an edited time.
        </p>
        <p>
          The submit form at the bottom is enabled only when both &quot;you&quot; and a pending review are selected, so
          you always know which assignment you are completing.
        </p>
      </Section>

      <Section id="tips" title="Tips, navigation, and support">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Top navigation</strong> — <Link to="/" className="underline">Home</Link>,{" "}
            <Link to="/admin/employees" className="underline">Employees</Link>,{" "}
            <Link to="/admin/reviews" className="underline">Reviews</Link>,{" "}
            <Link to="/employee" className="underline">My feedback</Link>, and this{" "}
            <Link to="/doc" className="underline">guide</Link>. Active links are highlighted.
          </li>
          <li>
            <strong>Toasts</strong> — Success and error messages appear top-right; they help confirm saves, validation,
            and API failures.
          </li>
          <li>
            <strong>Typical admin flow</strong> — Add all employees → create an open review → assign each peer → watch
            the Feedback log fill in → close the review when the cycle ends.
          </li>
          <li>
            <strong>Typical reviewer flow</strong> — Select your name → pick the pending review → write comment and stars
            → submit → use Edit if you need to fix something before the admin closes the review.
          </li>
        </ul>
      </Section>
    </div>
  );
};

export default DocPage;
