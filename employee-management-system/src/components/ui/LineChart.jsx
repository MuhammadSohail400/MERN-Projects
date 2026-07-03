export default function LineChart({ data = [], width = 540, height = 180 }) {
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range  = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minVal) / range) * (height * 0.8) - height * 0.1;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height}` +
    ` L ${points[0].x} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height + 30}`}
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4f46e5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"   />
        </linearGradient>
      </defs>

      {/* Area */}
      <path d={areaPath} fill="url(#lineGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r="4"
          fill="#4f46e5"
          opacity={i === points.length - 1 ? 1 : 0.5}
        />
      ))}

      {/* X axis labels — ✅ fontFamily fix */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={height + 22}
          textAnchor="middle"
          fontSize="11"
          fill="#9ca3af"
        >
          {p.month}
        </text>
      ))}
    </svg>
  );
}