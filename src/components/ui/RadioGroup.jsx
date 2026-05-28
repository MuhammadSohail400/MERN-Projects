// ── Reusable radio group
// options = [{ value: "active", label: "Active Status" }]

export default function RadioGroup({ name, value, onChange, options = [] }) {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: "flex", alignItems: "center",
            gap: "8px", cursor: "pointer",
            fontSize: "14px", fontWeight: 500,
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            style={{ display: "none" }}
          />
          {/* Custom circle */}
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            border: `2px solid ${value === opt.value ? "var(--color-brand-500)" : "var(--color-border)"}`,
            display: "grid", placeItems: "center", transition: "all .15s",
          }}>
            {value === opt.value && (
              <div style={{
                width: "10px", height: "10px",
                borderRadius: "50%", background: "var(--color-brand-500)",
              }} />
            )}
          </div>
          {opt.label}
        </label>
      ))}
    </div>
  );
}