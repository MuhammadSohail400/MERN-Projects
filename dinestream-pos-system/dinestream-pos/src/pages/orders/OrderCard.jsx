import { memo, useCallback } from 'react'
import { formatCurrency, formatTime } from '../../utils/formatters'

// ─── Status config ────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { color: '#eab308', bg: '#eab30818', border: '#eab30830', label: 'Pending',   dot: true  },
  preparing: { color: '#3b82f6', bg: '#3b82f618', border: '#3b82f630', label: 'Preparing', dot: true  },
  served:    { color: '#a855f7', bg: '#a855f718', border: '#a855f730', label: 'Served',    dot: false },
  paid:      { color: '#22c55e', bg: '#22c55e18', border: '#22c55e30', label: 'Paid',      dot: false },
  cancelled: { color: '#ef4444', bg: '#ef444418', border: '#ef444430', label: 'Cancelled', dot: false },
}

// ─── Next status mapping ──────────────────────────────────────
const NEXT_STATUS = {
  pending:   'preparing',
  preparing: 'served',
  served:    'paid',
}

const OrderCard = memo(({ order, onView, onStatusUpdate }) => {

  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

  const handleView   = useCallback(() => onView(order),                        [order, onView])
  const handleUpdate = useCallback(() => {
    const next = NEXT_STATUS[order.status]
    if (next) onStatusUpdate(order.id, next)
  }, [order.id, order.status, onStatusUpdate])

  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="order-card" style={{
      background: '#111113',
      border: '1px solid #ffffff0a',
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      transition: 'border-color 0.15s, transform 0.15s',
      cursor: 'pointer',
    }}
      onClick={handleView}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#ffffff18'
        e.currentTarget.style.transform = 'translateX(2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#ffffff0a'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >

      {/* Order number + time */}
      <div style={{ minWidth: 100 }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 14, fontWeight: 700,
          color: '#f4f4f5',
        }}>
          {order.orderNumber}
        </div>
        <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
          {formatTime(order.createdAt)}
        </div>
      </div>

      {/* Table + waiter */}
      <div style={{ flex: '1 1 120px', minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 500 }}>
          Table {order.tableNumber}
        </div>
        <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
          {order.waiter}
        </div>
      </div>

      {/* Items count */}
      <div style={{
        fontSize: 12, color: '#71717a',
        background: '#18181b',
        border: '1px solid #ffffff08',
        borderRadius: 6, padding: '4px 10px',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {order.items.length} items
      </div>

      {/* Amount */}
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 14, fontWeight: 700,
        color: '#f4f4f5', minWidth: 90,
        textAlign: 'right', flexShrink: 0,
      }}>
        {formatCurrency(order.totalAmount)}
      </div>

      {/* Status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: 20, padding: '5px 12px',
        minWidth: 90, justifyContent: 'center',
        flexShrink: 0,
      }}>
        {s.dot && (
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: s.color,
            animation: 'pulse 2s infinite',
            flexShrink: 0,
          }}/>
        )}
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: s.color, letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>
          {s.label}
        </span>
      </div>

      {/* Action button */}
      {nextStatus && (
        <button
          onClick={e => { e.stopPropagation(); handleUpdate() }}
          style={{
            background: '#f9731618',
            border: '1px solid #f9731630',
            borderRadius: 8, padding: '7px 12px',
            fontSize: 11, fontWeight: 600,
            color: '#f97316', cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f9731628'
            e.stopPropagation()
          }}
          onMouseLeave={e => e.currentTarget.style.background = '#f9731618'}
        >
          → {STATUS_CONFIG[nextStatus]?.label}
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 640px) {
          .order-card {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  )
})

OrderCard.displayName = 'OrderCard'
export default OrderCard