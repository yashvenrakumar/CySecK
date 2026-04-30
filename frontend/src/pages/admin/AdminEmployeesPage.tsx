import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useEmployees } from "../../hooks";
import type { Employee } from "../../shared/types";

function AdminEmployeesPage() {
  const { employees, getEmployees, postEmployee, patchEmployee, deleteEmployeeById } = useEmployees();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    void getEmployees().unwrap().catch(() => alert(" can not load employees list."));
  }, [getEmployees]);

  async function submitEmployee(e: FormEvent) {
    e.preventDefault();
    const name = employeeName.trim();
    const email = employeeEmail.trim().toLowerCase();
    if (name.length < 2) {
      alert("Name must least 2 char");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Enter valid email");
      return;
    }
    try {
      await postEmployee({ name, email, role: "employee" }, "admin").unwrap();
      setEmployeeName("");
      setEmployeeEmail("");
      await getEmployees().unwrap().catch(() => {});
      alert("employee added");
    } catch {
      alert("can not add employee ");
    }
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditEmail(emp.email);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  }

  async function saveEdit() {
    if (!editingId) return;
    const name = editName.trim();
    const email = editEmail.trim().toLowerCase();
    if (name.length < 2) {
      alert("Name must   least 2 char");
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
    } catch {
      alert("not save employee changes.");
    }
  }

  async function handlePromote(id: string) {
    try {
      await patchEmployee(id, { role: "admin" }, "admin").unwrap();
      alert("employee promoted ");
    } catch {
      alert("  not promote this person to adminm");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this employeee  ")) return;
    try {
      await deleteEmployeeById(id, "admin").unwrap();
      if (editingId === id) cancelEdit();
      alert("employee removeded");
    } catch {
      alert("C    not remove employee  ");
    }
  }

  return (
    <section className="page-card">
      <h1 className="page-title">employees</h1>

      <h2 className="section-title">add employee</h2>
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
          Add
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
                  <button type="button" className="btn-dark btn-small" onClick={() => void saveEdit()}>
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
                    {employee.name} <span className="row-role">({employee.role})</span>
                  </div>
                  <div className="row-email">{employee.email}</div>
                </div>
                <div className="row-buttons">
                  <button type="button" className="btn-outline btn-tiny" onClick={() => startEdit(employee)}>
                    Edit
                  </button>
                  {employee.role === "employee" && (
                    <button type="button" className="btn-amber btn-tiny" onClick={() => void handlePromote(employee.id)}>
                      Promote to admin
                    </button>
                  )}
                  <button type="button" className="btn-rose btn-tiny" onClick={() => void handleDelete(employee.id)}>
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
}

export default AdminEmployeesPage;
