// ── Reusable input — har form mein use ho sakta hai
// Login form, Edit form, Search form — sab mein

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  prefix,        // $ sign ke liye
}) {
  return (
    <div>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="req"> *</span>}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {/* Prefix — $ sign */}
        {prefix && (
          <span style={{
            position: "absolute", left: "12px", top: "50%",
            transform: "translateY(-50%)", fontSize: "14px",
            color: "var(--color-text-muted)",
          }}>
            {prefix}
          </span>
        )}

        <input
          className={`form-input ${error ? "error" : ""}`}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={prefix ? { paddingLeft: "24px" } : {}}
        />
      </div>

      {/* Error message */}
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