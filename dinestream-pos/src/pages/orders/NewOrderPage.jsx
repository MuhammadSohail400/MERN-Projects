import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useOrders  from '../../hooks/useOrders'
import useMenu    from '../../hooks/useMenu'
import useAuth    from '../../hooks/useAuth'
import useTables  from '../../hooks/useTables'
import useStaff   from '../../hooks/useStaff'          // ← ADD
import { formatCurrency } from '../../utils/formatters'

// ─── Step indicator ───────────────────────────────────────────
const StepBar = ({ current }) => {
  const steps = ['Select Table', 'Add Items', 'Confirm']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {steps.map((step, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: done ? '#22c55e20' : active ? '#f9731620' : '#18181b',
                border: `2px solid ${done ? '#22c55e' : active ? '#f97316' : '#ffffff10'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: done ? '#22c55e' : active ? '#f97316' : '#3f3f46',
                flexShrink: 0,
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 600 : 400,
                color: active ? '#f97316' : done ? '#22c55e' : '#3f3f46',
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 18,
                background: done ? '#22c55e40' : '#ffffff08',
                minWidth: 8,
              }}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════════
// NEW ORDER PAGE
// ════════════════════════════════════════════════════════
const NewOrderPage = () => {
  const navigate             = useNavigate()
  const { createOrder }      = useOrders()
  const { items: menuItems } = useMenu()
  const { user }             = useAuth()
  const { tables }           = useTables()
  const { staff }            = useStaff()            // ← ADD

  const [step,          setStep]          = useState(0)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedWaiter, setSelectedWaiter] = useState(null)   // ← ADD
  const [cartItems,     setCartItems]     = useState([])
  const [notes,         setNotes]         = useState('')

  // ✅ Available items
  const availableItems = useMemo(() => {
    return menuItems.filter(i => i.isAvailable)
  }, [menuItems])

  // ✅ Waiter-role staff only (dropdown options)
  const waiterOptions = useMemo(() => {
    return staff.filter(s => s.role === 'waiter' && s.status !== 'off_duty')
  }, [staff])

  // ── Auto-select waiter if table already has one assigned ─────
  useEffect(() => {
    if (selectedTable?.waiter && staff.length > 0) {
      const matched = staff.find(s => s.name === selectedTable.waiter)
      if (matched) setSelectedWaiter(matched)
    } else {
      setSelectedWaiter(null)
    }
  }, [selectedTable, staff])

  const cartTotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  , [cartItems])

  const cartCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  , [cartItems])

  const addToCart = useCallback((menuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === menuItem.id)
      if (existing) {
        return prev.map(i =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...menuItem, quantity: 1, notes: '' }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing?.quantity > 1) {
        return prev.map(i =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
      }
      return prev.filter(i => i.id !== id)
    })
  }, [])

  const getItemQty = useCallback((id) => {
    return cartItems.find(i => i.id === id)?.quantity || 0
  }, [cartItems])

  // ✅ waiterId pass hoga ab createOrder ko
  const handleConfirm = useCallback(async () => {
    try {
      const orderData = {
        tableId:  selectedTable.id,
        waiterId: selectedWaiter?.id || null,
        notes,
        items: cartItems,
      }
      const newOrder = await createOrder(orderData)
      navigate(`/orders/${newOrder.id}`)
    } catch (err) {
      console.error('Order failed:', err)
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }, [createOrder, selectedTable, selectedWaiter, cartItems, notes, navigate])

  return (
    <div style={{
      maxWidth: 760, width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => step === 0 ? navigate('/orders') : setStep(s => s - 1)}
          style={{
            width: 34, height: 34, background: '#111113',
            border: '1px solid #ffffff0a', borderRadius: 8,
            cursor: 'pointer', color: '#71717a', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</button>
        <div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20, fontWeight: 700, color: '#f4f4f5',
          }}>New Order</h2>
          <p style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>
            Create a new order for a table
          </p>
        </div>
      </div>

      <StepBar current={step} />

      {/* ── STEP 0: Select Table + Waiter ── */}
      {step === 0 && (
        <div>
          <p style={{ fontSize: 13, color: '#71717a', marginBottom: 16 }}>
            Select an available table to assign this order
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 12,
          }}>
            {tables.map(table => {
              const isAvail    = table.status === 'available'
              const isSelected = selectedTable?.id === table.id
              return (
                <div
                  key={table.id}
                  onClick={() => isAvail && setSelectedTable(table)}
                  style={{
                    background: isSelected ? '#f9731620' : isAvail ? '#111113' : '#0d0d0f',
                    border: `1px solid ${isSelected ? '#f97316' : isAvail ? '#ffffff0a' : '#ffffff05'}`,
                    borderRadius: 12, padding: '18px 12px',
                    textAlign: 'center',
                    cursor: isAvail ? 'pointer' : 'not-allowed',
                    opacity: isAvail ? 1 : 0.4,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🪑</div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 15, fontWeight: 700,
                    color: isSelected ? '#f97316' : '#f4f4f5',
                  }}>
                    {table.label || `T${table.tableNumber}`}
                  </div>
                  <div style={{ fontSize: 10, color: '#52525b', marginTop: 3 }}>
                    {table.capacity} seats
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 600, marginTop: 5,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: table.status === 'available' ? '#22c55e'
                         : table.status === 'reserved'  ? '#eab308' : '#ef4444',
                  }}>
                    {table.status}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ✅ NAYA — Waiter Dropdown (table select hone ke baad dikhega) */}
          {selectedTable && (
            <div style={{
              marginTop: 20,
              background: '#111113',
              border: '1px solid #ffffff0a',
              borderRadius: 12,
              padding: 16,
            }}>
              <label style={{
                fontSize: 12, color: '#71717a',
                fontWeight: 500, display: 'block', marginBottom: 8,
              }}>
                Assign Waiter
              </label>
              <select
                value={selectedWaiter?.id || ''}
                onChange={e => {
                  const found = staff.find(s => s.id === e.target.value)
                  setSelectedWaiter(found || null)
                }}
                style={{
                  width: '100%',
                  background: '#18181b',
                  border: '1px solid #ffffff0f',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: '#f4f4f5',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <option value="" style={{ background: '#18181b' }}>
                  Use my account ({user?.name})
                </option>
                {waiterOptions.map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#18181b' }}>
                    {s.name} {s.status === 'on_break' ? '(On Break)' : ''}
                  </option>
                ))}
              </select>

              {waiterOptions.length === 0 && (
                <p style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>
                  No waiters on duty — order will be assigned to your account
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setStep(1)}
            disabled={!selectedTable}
            style={{
              marginTop: 24, width: '100%', padding: '13px',
              background: selectedTable ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#18181b',
              border: selectedTable ? 'none' : '1px solid #ffffff0a',
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: selectedTable ? 'white' : '#3f3f46',
              cursor: selectedTable ? 'pointer' : 'not-allowed',
              boxShadow: selectedTable ? '0 0 20px #f9731630' : 'none',
            }}
          >
            {selectedTable
              ? `Continue with Table ${selectedTable.tableNumber} →`
              : 'Select a table to continue'
            }
          </button>
        </div>
      )}

      {/* ── STEP 1: Add Items ── */}
      {step === 1 && (
        <div className="neworder-step1" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
            <p style={{ fontSize: 13, color: '#71717a', marginBottom: 8 }}>
              Tap items to add them to the order
            </p>

            {availableItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#52525b' }}>
                <span style={{ fontSize: 32 }}>🍽️</span>
                <p style={{ marginTop: 8, fontSize: 13 }}>No menu items available</p>
              </div>
            ) : availableItems.map(item => {
              const qty = getItemQty(item.id)
              return (
                <div key={item.id} style={{
                  background: '#111113',
                  border: `1px solid ${qty > 0 ? '#f9731625' : '#ffffff0a'}`,
                  borderRadius: 10, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji || '🍽️'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: '#f4f4f5',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, color: '#f97316', fontWeight: 600, marginTop: 2 }}>
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            width: 28, height: 28, background: '#18181b',
                            border: '1px solid #ffffff0a', borderRadius: 6,
                            cursor: 'pointer', color: '#f4f4f5', fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >−</button>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: 14, fontWeight: 700,
                          color: '#f97316', minWidth: 16, textAlign: 'center',
                        }}>
                          {qty}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: 28, height: 28,
                        background: qty > 0 ? '#f9731620' : '#18181b',
                        border: `1px solid ${qty > 0 ? '#f97316' : '#ffffff0a'}`,
                        borderRadius: 6, cursor: 'pointer',
                        color: qty > 0 ? '#f97316' : '#71717a', fontSize: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >+</button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cart */}
          <div className="neworder-cart" style={{
            background: '#111113', border: '1px solid #ffffff0a',
            borderRadius: 12, padding: 16,
            height: 'fit-content', position: 'sticky', top: 80,
          }}>
            <p style={{
              fontSize: 12, color: '#52525b',
              fontWeight: 600, letterSpacing: '0.08em', marginBottom: 14,
            }}>ORDER SUMMARY</p>

            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#71717a' }}>Table: </span>
              <span style={{ fontSize: 12, color: '#f4f4f5', fontWeight: 600 }}>
                Table {selectedTable?.tableNumber}
              </span>
            </div>

            {/* ✅ Waiter info bhi cart summary mein dikhao */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#71717a' }}>Waiter: </span>
              <span style={{ fontSize: 12, color: '#f4f4f5', fontWeight: 600 }}>
                {selectedWaiter?.name || user?.name}
              </span>
            </div>

            {cartItems.length === 0 ? (
              <p style={{ fontSize: 13, color: '#3f3f46', textAlign: 'center', padding: '20px 0' }}>
                No items added yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      fontSize: 12, color: '#a1a1aa',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.emoji} {item.name} x{item.quantity}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f4f4f5', flexShrink: 0 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              borderTop: '1px solid #ffffff08', paddingTop: 12, marginTop: 4,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>Total</span>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 16, fontWeight: 700, color: '#f97316',
              }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={cartItems.length === 0}
              style={{
                marginTop: 14, width: '100%', padding: '11px',
                background: cartItems.length > 0
                  ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#18181b',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: cartItems.length > 0 ? 'white' : '#3f3f46',
                cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Review Order ({cartCount}) →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Confirm ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <div style={{
            background: '#111113', border: '1px solid #ffffff0a',
            borderRadius: 12, padding: 20,
          }}>
            <p style={{
              fontSize: 12, color: '#52525b',
              fontWeight: 600, letterSpacing: '0.08em', marginBottom: 14,
            }}>ORDER DETAILS</p>

            {/* Table + Waiter summary */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 14, paddingBottom: 14,
              borderBottom: '1px solid #ffffff08',
            }}>
              <div>
                <p style={{ fontSize: 11, color: '#52525b' }}>Table</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', marginTop: 2 }}>
                  Table {selectedTable?.tableNumber}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#52525b' }}>Waiter</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', marginTop: 2 }}>
                  {selectedWaiter?.name || user?.name}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji || '🍽️'}</span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 500, color: '#f4f4f5',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#52525b' }}>
                        x{item.quantity} · {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 13, fontWeight: 600, color: '#f4f4f5', flexShrink: 0,
                  }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid #ffffff08', marginTop: 16, paddingTop: 16,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5' }}>Total</span>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 20, fontWeight: 700, color: '#f97316',
              }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>

          <div>
            <label style={{
              fontSize: 12, color: '#71717a',
              fontWeight: 500, display: 'block', marginBottom: 8,
            }}>
              Order Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Special instructions..."
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#111113', border: '1px solid #ffffff0a',
                borderRadius: 10, padding: '10px 12px',
                fontSize: 13, color: '#f4f4f5', outline: 'none',
                resize: 'none', fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = '#f97316'}
              onBlur={e => e.target.style.borderColor = '#ffffff0a'}
            />
          </div>

          <button
            onClick={handleConfirm}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, color: 'white',
              cursor: 'pointer', boxShadow: '0 0 24px #f9731640',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            🍽️ Place Order → Table {selectedTable?.tableNumber}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .neworder-step1 { grid-template-columns: 1fr !important; }
          .neworder-cart  { position: static !important; }
        }
      `}</style>
    </div>
  )
}

export default NewOrderPage