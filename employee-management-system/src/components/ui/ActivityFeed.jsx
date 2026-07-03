// ActivityFeed.jsx mein type se icon decide karo
function getIcon(type, color) {
  if (type === "hire") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 14v6" />
      <path d="M15 17l-3-3-3 3" />
    </svg>
  );
  if (type === "promotion") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
  if (type === "policy") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

export default function ActivityFeed({ title, desc, time, iconBg, iconColor, type }) {
  return (
    <div className="feed-item">
      <div className="feed-icon" style={{ background: iconBg }}>
        {getIcon(type, iconColor)}   {/* ← type se sahi icon milega */}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="feed-title">{title}</div>
          <div className="feed-time">{time}</div>
        </div>
        <div className="feed-desc">{desc}</div>
      </div>
    </div>
  );
}