export default function PerformanceBar({ team, percent }) {
  return (
    <div className="perf-row">
      <div className="perf-label">
        <span>{team}</span>
        <span style={{ color: "var(--color-brand-500)", fontWeight: 700 }}>
          {percent}%
        </span>
      </div>
      <div className="perf-bar-bg">
        {/* ── useEffect nahi chahiye — CSS width kaam karta hai */}
        <div
          className="perf-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}