// ── Sirf imports + assembly — koi logic nahi ──
import useEmployeeForm    from "../hooks/useEmployeeForm";

import StatusSection       from "../components/form/StatusSection";
import ProfilePreview      from "../components/form/ProfilePreview";
import OnboardingGuide     from "../components/form/OnboardingGuide";
import PersonalInfoSection from "../components/form/PersonalInfoSection";

export default function AddEmployee() {
  const {
    form, errors, submitted, initials,
    handleChange, handleSubmit, handleCancel,
  } = useEmployeeForm();

  // Success screen
  if (submitted) {
    return (
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "var(--color-brand-50)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-500)" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="page-title" style={{ marginBottom: "8px" }}>Employee Added!</div>
          <div className="page-sub">Redirecting to Employee Directory…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">Add New Employee</div>
            <div className="page-sub">Configure professional details and system access.</div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-outline" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>Save Employee</button>
          </div>
        </div>

        {/* Form grid */}
        <div className="form-grid">

          {/* Left — form sections */}
          <div>
            <PersonalInfoSection
              form={form}
              errors={errors}
              onChange={handleChange}
            />
            <StatusSection
              form={form}
              onChange={handleChange}
            />
          </div>

          {/* Right — preview */}
          <div>
            <ProfilePreview form={form} initials={initials} />
            <OnboardingGuide />
          </div>

        </div>
      </div>

      <footer className="footer">
        <div><strong>NexusHR</strong> &copy; 2024 NexusHR. Enterprise Intelligence.</div>
      </footer>
    </div>
  );
}