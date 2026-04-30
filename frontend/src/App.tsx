import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import AdminEmployeesPage from "./pages/admin/AdminEmployeesPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import EmployeePage from "./pages/employee/EmployeePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="admin/employees" element={<AdminEmployeesPage />} />
          <Route path="admin/reviews" element={<AdminReviewsPage />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
