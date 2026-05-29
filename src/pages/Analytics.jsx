import { useState } from "react";
import LineChart      from "../components/ui/LineChart";
import BarChart       from "../components/ui/BarChart";
import PerformanceBar from "../components/ui/PerformanceBar";

import {
  SALARY_TREND,
  TOP_PERFORMERS,
  HEADCOUNT,
  PERFORMANCE,
} from "../data/analyticsData";
import usePageTitle from "../hooks/usePageTitle";
import Footer from "../components/ui/Footer";

// ── Time filter options
const TIME_FILTERS = ["Last 3 Months", "Last 6 Months", "Last 12 Months"];

export default function Analytics() {
  usePageTitle("Analytics")
  const [timeFilter, setTimeFilter] = useState("Last 12 Months");

  // ── Derived — filter ke hisaab se data slice karo
  const filteredTrend = (() => {
    if (timeFilter === "Last 3 Months") return SALARY_TREND.slice(-3);
    if (timeFilter === "Last 6 Months") return SALARY_TREND.slice(-6);
    return SALARY_TREND; // Last 12 Months — sab
  })();

  // ── Latest salary value
  const latestSalary = SALARY_TREND[SALARY_TREND.length - 1].value;
  const firstSalary  = SALARY_TREND[0].value;
  const yoyGrowth    = (((latestSalary - firstSalary) / firstSalary) * 100).toFixed(1);

  return (
    <div>
      <div className="page-content">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <div className="page-title">Employee Analytics</div>
            <div className="page-sub">
              Comprehensive insights into workforce performance and compensation.
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>

            {/* Time filter buttons */}
            <div style={{ display: "flex", gap: "4px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "4px" }}>
              {TIME_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  style={{
                    padding: "4px 10px", borderRadius: "6px", border: "none",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    background: timeFilter === f ? "var(--color-brand-500)" : "transparent",
                    color:      timeFilter === f ? "#fff" : "var(--color-text-secondary)",
                    transition: "all .15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <button className="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Report
            </button>

          </div>
        </div>

        {/* ── Top Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px", marginBottom: "16px" }}>

          {/* Salary Trend Chart */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>Salary Trends</div>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                  Average base salary growth across all departments
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-brand-500)", letterSpacing: "-.5px" }}>
                  ${latestSalary.toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#16a34a", marginTop: "2px" }}>
                  +{yoyGrowth}% YOY
                </div>
              </div>
            </div>

            {/* Line Chart — filtered data */}
            <div style={{ height: "200px" }}>
              <LineChart data={filteredTrend} />
            </div>
          </div>

          {/* Top Performers */}
          <div className="card">
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
              Top Performers
            </div>

            {TOP_PERFORMERS.map((p) => (
              <div className="performer-row" key={p.id}>
                <div
                  className="performer-av"
                  style={{ background: p.color + "20", color: p.color, display: "grid", placeItems: "center", fontSize: "14px", fontWeight: 600 }}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="performer-name">{p.name}</div>
                  <div className="performer-dept">{p.dept}</div>
                </div>
                <div className="score-badge">{p.score}/10</div>
              </div>
            ))}

            <button className="btn-outline" style={{ width: "100%", marginTop: "14px", justifyContent: "center" }}>
              View Full Rankings
            </button>
          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>

          {/* Headcount Bar Chart */}
          <div className="card">
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
              Headcount by Department
            </div>
            <BarChart data={HEADCOUNT} />
          </div>

          {/* Performance Overview */}
          <div className="card">
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "18px" }}>
              Performance Overview
            </div>
            {PERFORMANCE.map((item) => (
              <PerformanceBar
                key={item.team}
                team={item.team}
                percent={item.percent}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Footer */}
     <Footer/>
    </div>
  );
}