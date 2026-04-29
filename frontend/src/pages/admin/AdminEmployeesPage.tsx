import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import GroupIcon from "@mui/icons-material/Group";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "react-toastify";
import { useEmployees } from "../../hooks";
import { apiErrorMessage } from "../../shared/api/errorMessage";
import type { Employee } from "../../shared/types";

const AdminEmployeesPage = () => {
  const { employees, getEmployees, postEmployee, patchEmployee, deleteEmployeeById } = useEmployees();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    void getEmployees().unwrap().catch((e) => toast.error(apiErrorMessage(e, "Could not load employees")));
  }, [getEmployees]);

  const submitEmployee = async (e: FormEvent) => {
    e.preventDefault();
    const name = employeeName.trim();
    const email = employeeEmail.trim().toLowerCase();
    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    try {
      await postEmployee({ name, email, role: "employee" }, "admin").unwrap();
      setEmployeeName("");
      setEmployeeEmail("");
      await getEmployees().unwrap().catch(() => {});
      toast.success("Employee added");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not add employee"));
    }
  };

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditEmail(emp.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const name = editName.trim();
    const email = editEmail.trim().toLowerCase();
    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    try {
      await patchEmployee(editingId, { name, email }, "admin").unwrap();
      cancelEdit();
      toast.success("Employee updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update employee"));
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await patchEmployee(id, { role: "admin" }, "admin").unwrap();
      toast.success("Employee promoted to admin");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not promote"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this employee from the directory?")) return;
    try {
      await deleteEmployeeById(id, "admin").unwrap();
      if (editingId === id) cancelEdit();
      toast.success("Employee removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not remove"));
    }
  };

  return (
    <section className="rounded-md bg-white p-4 shadow">
      <h1 className="mb-1 text-xl font-bold text-slate-900">Employees</h1>
      <p className="mb-4 text-sm text-slate-600">
        Maintain the staff directory. People listed here can appear in reviews and in <strong>My feedback</strong>.
      </p>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <GroupIcon />
        Add employee
      </h2>
      <form onSubmit={submitEmployee} className="mb-8 max-w-md space-y-2">
        <input
          className="w-full rounded-md border border-slate-300 p-2"
          placeholder="Full name (min 2 characters)"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-slate-300 p-2"
          placeholder="Work email"
          type="email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-white">
          Add employee
        </button>
      </form>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Directory</h2>
      <ul className="space-y-2 text-sm">
        {employees.map((employee) => (
          <li key={employee.id} className="rounded-md border border-slate-200 p-3">
            {editingId === employee.id ? (
              <div className="space-y-2">
                <input
                  className="w-full max-w-md rounded-md border border-slate-300 p-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  aria-label="Edit name"
                />
                <input
                  className="w-full max-w-md rounded-md border border-slate-300 p-2"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  aria-label="Edit email"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white"
                    onClick={() => void saveEdit()}
                  >
                    Save
                  </button>
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-900">
                    {employee.name}{" "}
                    <span className="font-normal text-slate-500">({employee.role})</span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-600">{employee.email}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium"
                    onClick={() => startEdit(employee)}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    Edit
                  </button>
                  {employee.role === "employee" && (
                    <button
                      type="button"
                      className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium"
                      onClick={() => void handlePromote(employee.id)}
                    >
                      Promote to admin
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-md bg-rose-100 px-2 py-1 text-xs font-medium"
                    onClick={() => void handleDelete(employee.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminEmployeesPage;
