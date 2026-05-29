import { useState } from "react";
import { EmployeeContext } from "./EmployeeContextValue";
import { getDeptTag, getRandomColor } from "../utils/employeeHelpers";
import { EMPLOYEES } from "../data/employees";

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(EMPLOYEES);

  function addEmployee(formData) {
    const newEmployee = {
      id:          employees.length + 1,
      name:        formData.name,
      email:       formData.email,
      initials:    formData.name
                    .split(" ")
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2),
      avatarColor:  getRandomColor(),
      department:   formData.department,
      deptTag:      getDeptTag(formData.department),
      salary:       `$${Number(formData.salary).toLocaleString()}`,
      status:       formData.status,
    };
    setEmployees((prev) => [...prev, newEmployee]);
  }

  function editEmployee(id, updatedData) {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              ...updatedData,
              deptTag: getDeptTag(updatedData.department || emp.department),
              salary:  updatedData.salary
                        ? `$${Number(updatedData.salary).toLocaleString()}`
                        : emp.salary,
            }
          : emp
      )
    );
  }

  function deleteEmployee(id) {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }

  function toggleStatus(id) {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
          : emp
      )
    );
  }

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, editEmployee, deleteEmployee, toggleStatus }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}