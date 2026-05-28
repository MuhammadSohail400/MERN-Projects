import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";

const DEPARTMENTS = [
  "Engineering", "Marketing", "Sales",
  "Operations", "HR", "Design",
];

export default function PersonalInfoSection({ form, errors, onChange }) {
  return (
    <div className="form-section">
      <div className="section-title">
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--color-brand-50)", display: "grid", placeItems: "center", color: "var(--color-brand-500)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        Personal Information
      </div>

      <div className="form-row">
        <FormInput
          label="Full Name"
          name="name"
          placeholder="e.g. Jane Cooper"
          value={form.name}
          onChange={onChange}
          error={errors.name}
          required
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. jane@nexushr.com"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          required
        />
      </div>

      <div className="form-row">
        <FormSelect
          label="Department"
          name="department"
          value={form.department}
          onChange={onChange}
          options={DEPARTMENTS}
        />
        <FormInput
          label="Annual Salary (USD)"
          name="salary"
          type="number"
          placeholder="95,000"
          value={form.salary}
          onChange={onChange}
          error={errors.salary}
          prefix="$"
        />
      </div>
    </div>
  );
}