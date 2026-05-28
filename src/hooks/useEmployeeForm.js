import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validateEmployee, { hasErrors } from "../utils/validateEmployee";

const INITIAL_STATE = {
  name: "",
  email: "",
  department: "Engineering",
  salary: "",
  status: "active",
};

export default function useEmployeeForm() {
  const navigate = useNavigate();
  const [form, setForm]           = useState(INITIAL_STATE);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Single change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Type karte hi error hatao
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // ── Submit handler
  function handleSubmit() {
    const newErrors = validateEmployee(form);

    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    setTimeout(() => navigate("/employees"), 1500);
  }

  // ── Cancel handler
  function handleCancel() {
    navigate("/employees");
  }

  // ── Initials — profile preview ke liye
  const initials = form.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    form,
    errors,
    submitted,
    initials,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}