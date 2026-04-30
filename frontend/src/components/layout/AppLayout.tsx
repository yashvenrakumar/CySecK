import { NavLink, Outlet } from "react-router-dom";
import type { CSSProperties } from "react";

const navRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
};

const navBtnStyle: CSSProperties = {
  padding: "2px 4px",
  textDecoration: "none",
  fontSize: "14px",
};

export const AppLayout = () => {
  return (
    <div>
      <header style={{ padding: "10px 12px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "6px" }}>Cyseck</div>
          <nav style={navRowStyle} aria-label="Main navigation">
            <NavLink
              to="/"
              end
              title="Start here"
              style={({ isActive }) => ({ ...navBtnStyle, fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              Home
            </NavLink>
            <NavLink
              to="/admin/employees"
              title="Add, edit, or remove employees"
              style={({ isActive }) => ({ ...navBtnStyle, fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              Employees
            </NavLink>
            <NavLink
              to="/admin/reviews"
              title="Create reviews, assign reviewers, see submitted feedback"
              style={({ isActive }) => ({ ...navBtnStyle, fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              Reviews
            </NavLink>
            <NavLink
              to="/employee"
              title="Submit peer feedback on reviews assigned to you"
              style={({ isActive }) => ({ ...navBtnStyle, fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              My feedback
            </NavLink>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 16px 40px" }}>
        <Outlet />
      </main>
    </div>
  );
};
