export function getDeptTag(department) {
  const map = {
    Engineering: "eng",
    Marketing:   "mkt",
    Sales:       "sales",
    Operations:  "ops",
    HR:          "hr",
    Design:      "design",
  };
  return map[department] || "eng";
}

export function getRandomColor() {
  const colors = [
    "#6366f1", "#f43f5e", "#10b981",
    "#fb923c", "#8b5cf6", "#06b6d4",
    "#84cc16", "#f59e0b",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}