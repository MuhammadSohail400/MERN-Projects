import { useNavigate } from "react-router-dom";
import { QUICK_ACTIONS } from "../../data/dashboardData";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="card">
      {/* Title */}
      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
        Recent Actions
      </div>

      {/* Actions Grid */}
      <div className="action-grid">
        {QUICK_ACTIONS.map((action) => (
          <div
            key={action.id}
            className="action-card"
            onClick={() => action.path && navigate(action.path)}
          >
            {/* Icon */}
            <div
              className="action-icon"
              style={{ background: action.iconBg, color: action.iconColor }}
            >
              {getIcon(action.id)}
            </div>

            {/* Text */}
            <div>
              <div className="action-title">{action.title}</div>
              <div className="action-sub">{action.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Icon function — id se sahi icon return karo ──
function getIcon(id) {
  if (id === "add") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  );

  if (id === "payroll") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M16 10a2 2 0 0 1-2 2H10a2 2 0 0 1 0-4h4a2 2 0 0 1 2 2z" />
    </svg>
  );

  if (id === "report") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );

  if (id === "leave") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}