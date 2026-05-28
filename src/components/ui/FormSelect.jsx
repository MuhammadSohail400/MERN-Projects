// ── Reusable select dropdown

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
}) {
  return (
    <div>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="req"> *</span>}
        </label>
      )}

      <select
        className={`form-input ${error ? "error" : ""}`}
        name={name}
        value={value}
        onChange={onChange}
        style={{ cursor: "pointer" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && (
        <div className="error-msg">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}