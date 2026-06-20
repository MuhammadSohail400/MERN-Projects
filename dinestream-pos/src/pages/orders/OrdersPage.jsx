import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useOrders from '../../hooks/useOrders'
import OrderCard from './OrderCard'
import { formatCurrency } from '../../utils/formatters'

const STATUS_TABS = ['all', 'pending', 'preparing', 'served', 'paid', 'cancelled']

const SkeletonRow = () => (
  <div style={{
    background: '#111113', border: '1px solid #ffffff0a',
    borderRadius: 12, padding: 16, height: 64,
    animation: 'shimmer 1.5s infinite',
  }}>
    <style>{`@keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
  </div>
)

const OrdersPage = () => {
  const navigate = useNavigate()
  const { orders, isLoading, updateStatus } = useOrders()

  const [activeTab, setActiveTab] = useState('all')
  const [search,    setSearch]    = useState('')

  // 🧠 useMemo — filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchTab    = activeTab === 'all' || order.status === activeTab
      const matchSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                          order.waiter.toLowerCase().includes(search.toLowerCase()) ||
                          String(order.tableNumber).includes(search)
      return matchTab && matchSearch
    })
  }, [orders, activeTab, search])

  // 🧠 useMemo — tab counts
  const tabCounts = useMemo(() => {
    return STATUS_TABS.reduce((acc, tab) => {
      acc[tab] = tab === 'all'
        ? orders.length
        : orders.filter(o => o.status === tab).length
      return acc
    }, {})
  }, [orders])

  // 🧠 useCallback — stable handlers
  const handleView = useCallback((order) => {
    navigate(`/orders/${order.id}`)
  }, [navigate])

  const handleStatusUpdate = useCallback((id, status) => {
    updateStatus(id, status)
  }, [updateStatus])

  // Stats
  const stats = useMemo(() => ({
    total:    orders.length,
    active:   orders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
    revenue:  orders.filter(o => o.status === 'paid')
                    .reduce((s, o) => s + o.totalAmount, 0),
  }), [orders])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      fontFamily: 'DM Sans, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* Header */}
      <div className="orders-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20, fontWeight: 700, color: '#f4f4f5',
          }}>
            Orders
          </h2>
          <p style={{ fontSize: 13, color: '#52525b', marginTop: 3 }}>
            {stats.active} active · {formatCurrency(stats.revenue)} collected today
          </p>
        </div>
        <button
          onClick={() => navigate('/orders/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 10,
            padding: '10px 18px',
            fontSize: 13, fontWeight: 600, color: 'white',
            cursor: 'pointer', boxShadow: '0 0 20px #f9731630',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          + New Order
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', color: '#3f3f46',
        }}>
          🔍
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order number, table, or waiter..."
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#111113',
            border: '1px solid #ffffff0a', borderRadius: 10,
            padding: '10px 12px 10px 36px',
            fontSize: 13, color: '#f4f4f5', outline: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onFocus={e => e.target.style.borderColor = '#f97316'}
          onBlur={e => e.target.style.borderColor = '#ffffff0a'}
        />
      </div>

      {/* Status tabs */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'nowrap',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        paddingBottom: 2,
      }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '7px 14px',
              background: activeTab === tab ? '#f9731620' : '#111113',
              border: `1px solid ${activeTab === tab ? '#f97316' : '#ffffff0a'}`,
              borderRadius: 8,
              fontSize: 12, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#f97316' : '#71717a',
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tabCounts[tab] > 0 && (
              <span style={{
                background: activeTab === tab ? '#f97316' : '#27272a',
                color: activeTab === tab ? 'white' : '#71717a',
                fontSize: 10, fontWeight: 700,
                padding: '1px 6px', borderRadius: 10,
              }}>
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading
          ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
          : filteredOrders.length === 0
            ? (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
                background: '#111113', border: '1px solid #ffffff0a',
                borderRadius: 12,
              }}>
                <span style={{ fontSize: 36 }}>📋</span>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 15, fontWeight: 600,
                  color: '#f4f4f5', marginTop: 12,
                }}>
                  No orders found
                </p>
                <p style={{ fontSize: 13, color: '#52525b', marginTop: 6 }}>
                  {search ? 'Try different search' : 'No orders in this category'}
                </p>
              </div>
            )
            : filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={handleView}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
        }
      </div>

      <style>{`
        @media (max-width: 480px) {
          .orders-header button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default OrdersPage