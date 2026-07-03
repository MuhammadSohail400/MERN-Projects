import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("404 — Not Found");
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center" }}>

        {/* Big 404 */}
        <div style={{ fontSize: "80px", fontWeight: 700, color: "var(--color-brand-100)", letterSpacing: "-4px", lineHeight: 1 }}>
          404
        </div>

        {/* Icon */}
        <div style={{ width: "64px", height: "64px", background: "var(--color-brand-50)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "16px auto" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-brand-500" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="page-title" style={{ marginBottom: "8px" }}>
          Page not found
        </div>
        <div className="page-sub" style={{ marginBottom: "24px" }}>
          The page you are looking for does not exist.
        </div>

        <button className="btn-primary" onClick={() => navigate("/")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12L12 3l9 9" />
            <path d="M9 21V12h6v9" />
          </svg>
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}