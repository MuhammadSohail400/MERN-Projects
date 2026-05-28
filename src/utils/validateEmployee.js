// ── Pure function — koi React nahi, sirf logic
// Kisi bhi form mein reuse ho sakta hai
// Test likhna bhi easy hai

export default function validateEmployee(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!form.email.includes("@") || !form.email.includes(".")) {
    errors.email = "Please enter a valid company email address";
  }

  if (!form.salary) {
    errors.salary = "Salary is required";
  } else if (isNaN(form.salary) || Number(form.salary) <= 0) {
    errors.salary = "Please enter a valid salary";
  }

  return errors;
}

// ── Helper — errors hain ya nahi
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}