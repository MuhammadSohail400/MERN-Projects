import RadioGroup from "../ui/RadioGroup";

const STATUS_OPTIONS = [
  { value: "active",   label: "Active Status" },
  { value: "inactive", label: "Inactive / On Leave" },
];

export default function StatusSection({ form, onChange }) {
  return (
    <div className="form-section">
      <div className="section-title">
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f0fdf4", display: "grid", placeItems: "center", color: "#16a34a" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        Employment Status
      </div>

      <RadioGroup
        name="status"
        value={form.status}
        onChange={onChange}
        options={STATUS_OPTIONS}
      />

      {/* Notice */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px", marginTop: "14px", fontSize: "13px" }}>
        <svg width="16" height="16" style={{ flexShrink: 0, marginTop: "1px" }} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <strong style={{ display: "block", marginBottom: "2px" }}>Status Notification</strong>
          Changing status to 'Inactive' will temporarily disable the employee's portal login and payroll processing.
        </div>
      </div>
    </div>
  );
}