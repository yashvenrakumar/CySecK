import { NavLink, Outlet } from "react-router-dom";
import type { CSSProperties } from "react";

const navRow: CSSProperties = {
  display: "flex",
  gap: "8px",
};

function activeLinkStyle(isActive: boolean): CSSProperties {
  return {
    fontWeight: isActive ? 700 : 400,
    textDecoration: isActive ? "underline" : "none",
  };
}

export function AppLayout() {
  return (
    <div>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "6px" }}>Cyseck</div>
        <nav style={navRow} aria-label="Main navigation">
          <NavLink to="/" end title="Start here" style={({ isActive }) => activeLinkStyle(isActive)}>
            home
          </NavLink>
          <NavLink
            to="/admin/employees"
            title="Add, edit, or remove employees"
            style={({ isActive }) => activeLinkStyle(isActive)}
          >
            employees
          </NavLink>
          <NavLink
            to="/admin/reviews"
            title="Create reviews, assign reviewers, see submitted feedback"
            style={({ isActive }) => activeLinkStyle(isActive)}
          >
            reviews
          </NavLink>
          <NavLink
            to="/employee"
            title="Submit peer feedback on reviews assigned"
            style={({ isActive }) => activeLinkStyle(isActive)}
          >
            feedback
          </NavLink>
        </nav>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
