import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
    void getEmployees().unwrap().catch((e) => alert(apiErrorMessage(e, "Could not load employees")));
  }, [getEmployees]);

  const submitEmployee = async (e: FormEvent) => {
    e.preventDefault();
    const name = employeeName.trim();
    const email = employeeEmail.trim().toLowerCase();
    if (name.length < 2) {
      alert("Name must at least 2 char");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    try {
      await postEmployee({ name, email, role: "employee" }, "admin").unwrap();
      setEmployeeName("");
      setEmployeeEmail("");
      await getEmployees().unwrap().catch(() => {});
      alert("Employee added");
    } catch (err) {
      alert(apiErrorMessage(err, "Could not add employee"));
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
      alert("Name must be at least 2 characters.");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    try {
      await patchEmployee(editingId, { name, email }, "admin").unwrap();
      cancelEdit();
      alert("Employee updated");
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update"));
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await patchEmployee(id, { role: "admin" }, "admin").unwrap();
      alert("Employee promoted to admin");
    } catch (err) {
      alert(apiErrorMessage(err, "Could not promote"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this employee from the directory?")) return;
    try {
      await deleteEmployeeById(id, "admin").unwrap();
      if (editingId === id) cancelEdit();
      alert("Employee removed");
    } catch (err) {
      alert(apiErrorMessage(err, "Could not remove"));
    }
  };

  return (
    <section className="page-card">
      <h1 className="page-title">Employees</h1>
      
      <h2 className="section-title">Add employee</h2>
      <form onSubmit={submitEmployee} className="form-block">
        <input
          className="input-basic"
          placeholder="Full name (min 2 characters)"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <input
          className="input-basic"
          placeholder="Work email"
          type="email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <button type="submit" className="btn-dark">
          Add employee
        </button>
      </form>

      <h2 className="section-caption">Directory</h2>
      <ul className="list-basic">
        {employees.map((employee) => (
          <li key={employee.id} className="list-row-card">
            {editingId === employee.id ? (
              <div className="stack-2">
                <input
                  className="input-basic input-max"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  aria-label="Edit name"
                />
                <input
                  className="input-basic input-max"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  aria-label="Edit email"
                />
                <div className="row-gap-2">
                  <button
                    type="button"
                    className="btn-dark btn-small"
                    onClick={() => void saveEdit()}
                  >
                    Save
                  </button>
                  <button type="button" className="btn-outline btn-small" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="row-split">
                <div>
                  <div className="row-name">
                    {employee.name}{" "}
                    <span className="row-role">({employee.role})</span>
                  </div>
                  <div className="row-email">{employee.email}</div>
                </div>
                <div className="row-buttons">
                  <button
                    type="button"
                    className="btn-outline btn-tiny"
                    onClick={() => startEdit(employee)}
                  >
                    Edit
                  </button>
                  {employee.role === "employee" && (
                    <button
                      type="button"
                      className="btn-amber btn-tiny"
                      onClick={() => void handlePromote(employee.id)}
                    >
                      Promote to admin
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-rose btn-tiny"
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
