
export const STATS = [
  {
    id: "total",
    label: "Total Employees",
    value: "1,248",
    badge: "+2.4%",
    badgeType: "up",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    barColor: "#7c3aed",
  },
  {
    id: "active",
    label: "Active",
    value: "1,202",
    badge: "96% of total",
    badgeType: "neutral",
    iconBg: "#f1f5f9",
    iconColor: "#475569",
    barColor: "#64748b",
  },
  {
    id: "inactive",
    label: "Inactive",
    value: "46",
    badge: "+12%",
    badgeType: "up",
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
    barColor: "#f87171",
  },
  {
    id: "salary",
    label: "Total Salary Expense",
    value: "$8.4M",
    badge: "Monthly",
    badgeType: "neutral",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    barColor: "#fb923c",
  },
];

export const ACTIVITIES = [
  {
    id: 1,
    title: "New hire: Sarah Chen",
    desc: "Sarah joined the Engineering team as a Senior Software Engineer.",
    time: "2h ago",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",   // ← sirf color string
    type: "hire",            // ← type se component mein icon decide karo
  },
  {
    id: 2,
    title: "Promotion: David Miller",
    desc: "David has been promoted to Product Lead for Core Infrastructure.",
    time: "5h ago",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    type: "promotion",
  },
  {
    id: 3,
    title: "Policy Update: 2024 Benefits",
    desc: "The 2024 health benefits package documentation has been published.",
    time: "Yesterday",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    type: "policy",
  },
];
export const DEPARTMENTS = [
  { label: "Engineering", color: "#4f46e5", percent: 45 },
  { label: "Operations",  color: "#64748b", percent: 25 },
  { label: "Product",     color: "#92400e", percent: 30 },
];
export const QUICK_ACTIONS = [
  {
    id: "add",
    title: "Add Employee",
    sub: "Onboard new talent",
    path: "/employees/add",
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-500)",
  },
  {
    id: "payroll",
    title: "Run Payroll",
    sub: "Process monthly salary",
    path: null,
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
  },
  {
    id: "report",
    title: "Generate Report",
    sub: "Compliance & Tax data",
    path: null,
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    id: "leave",
    title: "Leave Requests",
    sub: "8 pending approvals",
    path: null,
    iconBg: "#fef9c3",
    iconColor: "#92400e",
  },
];