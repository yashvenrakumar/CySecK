import { NavLink, Outlet } from "react-router-dom";
import type { CSSProperties } from "react";

const navRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  
 
};

 

export const AppLayout = () => {
  return (
    <div>
       <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "6px" }}>Cyseck</div>
          <nav style={navRowStyle} aria-label="Main navigation">
            <NavLink
              to="/"
              end
              title="Start here"
              style={({ isActive }) => ({  fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              home
            </NavLink>
            <NavLink
              to="/admin/employees"
              title="Add, edit, or remove employees"
              style={({ isActive }) => ({  fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              employees
            </NavLink>
            <NavLink
              to="/admin/reviews"
              title="Create reviews, assign reviewers, see submitted feedback"
              style={({ isActive }) => ({  fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
              reviews
            </NavLink>
            <NavLink
              to="/employee"
              title="Submit peer feedback on reviews assigned to you"
              style={({ isActive }) => ({  fontWeight: isActive ? 700 : 400, textDecoration: isActive ? "underline" : "none" })}
            >
            feedback
            </NavLink>
          </nav>
        </div>
      <main  >
        <Outlet />
      </main>
    </div>
  );
};
