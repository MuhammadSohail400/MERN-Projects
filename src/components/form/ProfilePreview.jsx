export default function ProfilePreview({ form, initials }) {
  return (
    <div className="profile-card">
      {/* Avatar */}
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 12px", border: "3px solid #818cf8", background: "var(--color-brand-600)", display: "grid", placeItems: "center", fontSize: "22px", fontWeight: 700, color: "#fff" }}>
        {initials || "?"}
      </div>

      <div className="profile-name">{form.name || "Full Name"}</div>
      <div className="profile-role">{form.department}</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.12)", fontSize: "12px" }}>
        <div style={{ color: "#a5b4fc" }}>
          <div>Status</div>
          <div>Salary</div>
        </div>
        <div style={{ textAlign: "right", fontWeight: 600 }}>
          <div style={{ textTransform: "capitalize" }}>{form.status}</div>
          <div>{form.salary ? `$${Number(form.salary).toLocaleString()}` : "—"}</div>
        </div>
      </div>
    </div>
  );
}