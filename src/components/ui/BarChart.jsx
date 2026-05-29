export default function BarChart({ data = [], height = 180 }) {
  const maxVal   = Math.max(...data.map((d) => d.value));

  const gap      = 16;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: `${gap}px`, height: `${height}px`, padding: "0 8px" }}>
      {data.map((item, i) => {
        // ── Bar height calculate karo
        const barHeight = (item.value / maxVal) * height * 0.9;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: `${barHeight}px`,
                background: item.color,
                borderRadius: "6px 6px 0 0",
                transition: "height 0.3s ease",
              }}
            />
            {/* Label */}
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)", fontWeight: 600 }}>
              {item.dept}
            </div>
          </div>
        );
      })}
    </div>
  );
}