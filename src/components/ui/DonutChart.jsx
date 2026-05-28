import { DEPARTMENTS } from "../../data/dashboardData";

export default function DonutChart() {
  const CIRCUMFERENCE = 2 * Math.PI * 48;

  // ✅ reduce — koi variable reassign nahi, accumulator use karta hai
  const segments = DEPARTMENTS.reduce((acc, dept) => {
    const filled = (dept.percent / 100) * CIRCUMFERENCE;
    const empty = CIRCUMFERENCE - filled;
    const currentOffset = acc.totalOffset;

    return {
      totalOffset: acc.totalOffset - filled,
      items: [
        ...acc.items,
        { ...dept, filled, empty, offset: currentOffset },
      ],
    };
  }, { totalOffset: 0, items: [] }).items;

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "16px", fontWeight: 700, textAlign: "left", marginBottom: "8px" }}>
        Department Breakdown
      </div>

      <div className="donut-wrap">
        <svg
          viewBox="0 0 120 120"
          style={{ width: "120px", height: "120px", transform: "rotate(-90deg)" }}
        >
          <circle cx="60" cy="60" r="48" fill="none" stroke="#e8eaf0" strokeWidth="14" />

          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx="60" cy="60" r="48"
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${seg.filled} ${seg.empty}`}
              strokeDashoffset={seg.offset}
            />
          ))}
        </svg>

        <div className="donut-label">
          <div className="donut-num">{DEPARTMENTS.length}</div>
          <div className="donut-sub">Depts</div>
        </div>
      </div>

      <div className="dept-legend" style={{ textAlign: "left" }}>
        {DEPARTMENTS.map((dept) => (
          <div className="dept-row" key={dept.label}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="dept-dot" style={{ background: dept.color }} />
              {dept.label}
            </div>
            <div style={{ fontWeight: 600 }}>{dept.percent}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}