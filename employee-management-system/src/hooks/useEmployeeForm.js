import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmployeeContext from "./useEmployeeContext"; // ← path change // ← add
import validateEmployee, { hasErrors } from "../utils/validateEmployee";

const INITIAL_STATE = {
  name:       "",
  email:      "",
  department: "Engineering",
  salary:     "",
  status:     "active",
};

export default function useEmployeeForm() {
  const navigate = useNavigate();
  const { addEmployee } = useEmployeeContext();  // ← context se lo

  const [form, setForm]           = useState(INITIAL_STATE);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleSubmit() {
    const newErrors = validateEmployee(form);
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      return;
    }

    // ── Context mein save karo
    addEmployee(form);

    setSubmitted(true);
    setTimeout(() => navigate("/employees"), 1500);
  }

  function handleCancel() {
    navigate("/employees");
  }

  const initials = form.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    form, errors, submitted, initials,
    handleChange, handleSubmit, handleCancel,
  };
}