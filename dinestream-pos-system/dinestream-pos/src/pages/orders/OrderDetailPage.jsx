import { useParams, useNavigate } from 'react-router-dom'
import useOrders from '../../hooks/useOrders'
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters'

const STATUS_STEPS = ['pending', 'preparing', 'served', 'paid']

const STATUS_CONFIG = {
  pending:   { color: '#eab308', label: 'Pending'   },
  preparing: { color: '#3b82f6', label: 'Preparing' },
  served:    { color: '#a855f7', label: 'Served'    },
  paid:      { color: '#22c55e', label: 'Paid'      },
  cancelled: { color: '#ef4444', label: 'Cancelled' },
}

const NEXT_STATUS = {
  pending:   'preparing',
  preparing: 'served',
  served:    'paid',
}

const OrderDetailPage = () => {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { orders, updateStatus } = useOrders()

  // Find order by id from URL params
  const order = orders.find(o => o.id === id)

  if (!order) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 12,
      fontFamily: 'Space Grotesk, sans-serif',
      textAlign: 'center', padding: '0 16px',
    }}>
      <span style={{ fontSize: 40 }}>🔍</span>
      <h3 style={{ color: '#f4f4f5', fontSize: 18 }}>Order not found</h3>
      <button
        onClick={() => navigate('/orders')}
        style={{
          background: '#f97316', border: 'none',
          borderRadius: 8, padding: '10px 20px',
          color: 'white', fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
        }}
      >
        Back to Orders
      </button>
    </div>
  )

  const s        = STATUS_CONFIG[order.status]
  const nextSt   = NEXT_STATUS[order.status]
  const stepIdx  = STATUS_STEPS.indexOf(order.status)

  return (
    <div style={{
      maxWidth: 700,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 20,
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* ── Header ── */}
      <div className="orderdetail-header" style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <button
          onClick={() => navigate('/orders')}
          style={{
            width: 34, height: 34,
            background: '#111113',
            border: '1px solid #ffffff0a',
            borderRadius: 8, cursor: 'pointer',
            color: '#71717a', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f4f4f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
        >
          ←
        </button>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20, fontWeight: 700,
            color: '#f4f4f5', letterSpacing: '-0.02em',
          }}>
            {order.orderNumber}
          </h2>
          <p style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>
            {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
          </p>
        </div>

        {/* Status badge */}
        <div style={{
          marginLeft: 'auto',
          background: `${s.color}18`,
          border: `1px solid ${s.color}30`,
          borderRadius: 20, padding: '6px 14px',
          fontSize: 12, fontWeight: 600, color: s.color,
          whiteSpace: 'nowrap',
        }}>
          {s.label}
        </div>
      </div>

      {/* ── Status Timeline ── */}
      {order.status !== 'cancelled' && (
        <div style={{
          background: '#111113',
          border: '1px solid #ffffff0a',
          borderRadius: 12, padding: 20,
          overflowX: 'auto',
        }}>
          <p style={{ fontSize: 12, color: '#52525b', marginBottom: 16, fontWeight: 500 }}>
            ORDER PROGRESS
          </p>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 320 }}>
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= stepIdx
              const current = i === stepIdx
              const sc      = STATUS_CONFIG[step]
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                  {/* Step circle */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: done ? `${sc.color}20` : '#18181b',
                      border: `2px solid ${done ? sc.color : '#ffffff10'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                      boxShadow: current ? `0 0 12px ${sc.color}40` : 'none',
                      transition: 'all 0.3s',
                      flexShrink: 0,
                    }}>
                      {done ? (i < stepIdx ? '✓' : '●') : '○'}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: done ? 600 : 400,
                      color: done ? sc.color : '#3f3f46',
                      whiteSpace: 'nowrap',
                    }}>
                      {sc.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, marginBottom: 22,
                      background: i < stepIdx ? '#f97316' : '#ffffff0a',
                      transition: 'background 0.3s',
                      minWidth: 16,
                    }}/>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Info Cards ── */}
      <div className="orderdetail-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Table',  value: `Table ${order.tableNumber}`, icon: '🪑' },
          { label: 'Waiter', value: order.waiter,                 icon: '👤' },
        ].map(info => (
          <div key={info.label} style={{
            background: '#111113',
            border: '1px solid #ffffff0a',
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            minWidth: 0,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{info.icon}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: '#52525b' }}>{info.label}</p>
              <p style={{
                fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Order Items ── */}
      <div style={{
        background: '#111113',
        border: '1px solid #ffffff0a',
        borderRadius: 12, padding: 20,
      }}>
        <p style={{
          fontSize: 12, color: '#52525b',
          fontWeight: 600, letterSpacing: '0.08em',
          marginBottom: 16,
        }}>
          ORDER ITEMS
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 8px', borderRadius: 8,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#ffffff05'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 500, color: '#f4f4f5',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </p>
                {item.notes && (
                  <p style={{
                    fontSize: 11, color: '#52525b', marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    📝 {item.notes}
                  </p>
                )}
              </div>
              <span style={{ fontSize: 12, color: '#52525b', flexShrink: 0 }}>
                x{item.quantity}
              </span>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 13, fontWeight: 600, color: '#f4f4f5',
                minWidth: 70, textAlign: 'right', flexShrink: 0,
              }}>
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16, paddingTop: 16,
          borderTop: '1px solid #ffffff08',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>
            Total
          </span>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20, fontWeight: 700, color: '#f97316',
          }}>
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      {nextSt && (
        <button
          onClick={() => updateStatus(order.id, nextSt)}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 600, color: 'white',
            cursor: 'pointer',
            boxShadow: '0 0 20px #f9731630',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Mark as {STATUS_CONFIG[nextSt]?.label} →
        </button>
      )}

      <style>{`
        @media (max-width: 480px) {
          .orderdetail-info {
            grid-template-columns: 1fr !important;
          }
          .orderdetail-header {
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default OrderDetailPage