
function StatsCard({label,value,badge,badgeType,iconBg,iconColor,barColor}){
 return (
    <div className="card">
      {/* Icon */}
      <div className="stat-icon" style={{ background: iconBg }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* Badge */}
      <div className={`stat-badge ${badgeType === "up" ? "up" : ""}`}>
        {badgeType === "up" && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )}
        {badge}
      </div>

      {/* Label + Value */}
      <div className="stat-label">{label}</div>
      <div className="stat-num">{value}</div>

      {/* Mini bars */}
      <div className="mini-bars">
        {[40, 55, 45, 65, 70, 60, 90].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: barColor,
              borderRadius: "2px",
              opacity: i === 6 ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default StatsCard;