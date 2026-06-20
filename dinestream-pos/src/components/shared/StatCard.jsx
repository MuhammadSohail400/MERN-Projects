import { memo } from 'react'

// 🧠 memo() — props same hon toh re-render mat karo
// Dashboard mein 4 cards hain
// Ek cheez change ho → sirf woh card re-render ho
// Baaki 3 same rahen → performance better

const StatCard = memo(({ title, value, sub, icon, trend, trendValue, color }) => {

  // trend positive hai ya negative?
  const isPositive = trendValue > 0
  const trendColor = isPositive ? '#22c55e' : '#ef4444'

  return (
    <div style={{
      background: '#111113',
      border: '1px solid #ffffff0a',
      borderRadius: 14,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      cursor: 'default',
      transition: 'border-color 0.2s, transform 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#ffffff18'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#ffffff0a'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Subtle glow background */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }}/>

      {/* Top row — icon + trend */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        {/* Icon box */}
        <div style={{
          width: 38, height: 38,
          background: `${color}18`,
          border: `1px solid ${color}25`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color, fontSize: 18,
        }}>
          {icon}
        </div>

        {/* Trend badge */}
        {trendValue !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: `${trendColor}15`,
            border: `1px solid ${trendColor}25`,
            borderRadius: 20, padding: '3px 8px',
          }}>
            <span style={{ fontSize: 10, color: trendColor }}>
              {isPositive ? '▲' : '▼'}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: trendColor }}>
              {Math.abs(trendValue)}%
            </span>
          </div>
        )}
      </div>

      {/* Bottom row — value + title */}
      <div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 24, fontWeight: 700,
          color: '#f4f4f5', letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: '#71717a', marginTop: 5 }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: '#3f3f46', marginTop: 3 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
})

// displayName — React DevTools mein naam dikhega
StatCard.displayName = 'StatCard'

export default StatCard