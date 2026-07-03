const TIPS = [
  "Complete all required fields marked with an asterisk.",
  "The welcome email will be sent automatically upon saving.",
  "Salary information is encrypted and only visible to HR Managers.",
];

export default function OnboardingGuide() {
  return (
    <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "20px", marginTop: "16px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--color-brand-500)", marginBottom: "12px" }}>
        Onboarding Guide
      </div>

      {TIPS.map((tip, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "var(--color-brand-50)", color: "var(--color-brand-500)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: "1px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          {tip}
        </div>
      ))}
    </div>
  );
}