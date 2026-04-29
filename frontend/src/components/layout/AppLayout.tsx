import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <NavLink to="/" className="text-lg font-bold text-slate-900 no-underline">
              CysecK · Performance reviews
            </NavLink>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">Admins:</span> Staff &amp; reviews ·{" "}
              <span className="font-medium text-slate-700">Team:</span> My feedback
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Main navigation">
            <NavLink to="/" end className={navClass} title="Start here">
              <HomeOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              Home
            </NavLink>
            <NavLink to="/doc" className={navClass} title="How to use the app and every feature">
              <MenuBookOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              Docs
            </NavLink>
            <div
              className="flex flex-wrap items-center gap-1 rounded-md border border-slate-200 bg-slate-50/80 p-1"
              role="group"
              aria-label="Administration"
            >
              <NavLink
                to="/admin/employees"
                className={navClass}
                title="Add, edit, or remove employees"
              >
                <GroupOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
                Employees
              </NavLink>
              <NavLink
                to="/admin/reviews"
                className={navClass}
                title="Create reviews, assign reviewers, see submitted feedback"
              >
                <RateReviewOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
                Reviews
              </NavLink>
            </div>
            <NavLink
              to="/employee"
              className={navClass}
              title="Submit peer feedback on reviews assigned to you"
            >
              <FeedbackOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              My feedback
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 pb-10">
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={2800} />
    </div>
  );
};
