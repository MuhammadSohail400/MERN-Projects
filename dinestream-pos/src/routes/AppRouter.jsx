import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout       from '../components/layout/AppLayout'
import ProtectedRoute  from '../components/shared/ProtectedRoute'
import LoginPage       from '../pages/auth/LoginPage'
import DashboardPage  from '../pages/dashboard/DashboardPage'
import NotFoundPage    from '../pages/NotFoundPage'
import MenuPage from '../pages/menu/MenuPage'
import OrdersPage       from '../pages/orders/OrdersPage'
import OrderDetailPage  from '../pages/orders/OrderDetailPage'
import NewOrderPage     from '../pages/orders/NewOrderPage'
import TablesPage from '../pages/tables/TablesPage'
import StaffPage from '../pages/staff/StaffPage'
import ReportsPage from '../pages/reports/ReportsPage'




// Route update karo:
<Route path="/menu" element={<MenuPage />} />  // ← UPDATED

// ─── Placeholder pages (Phase 3+ mein real banenge) ──────────
const Placeholder = ({ title }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: 12,
    fontFamily: 'Space Grotesk, sans-serif',
  }}>
    <div style={{
      width: 48, height: 48,
      background: '#f9731618',
      border: '1px solid #f9731630',
      borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22,
    }}>
      🍽️
    </div>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f4f4f5' }}>
      {title}
    </h2>
    <p style={{ fontSize: 13, color: '#52525b' }}>
      Coming in next phase ✅
    </p>
  </div>
)

// ════════════════════════════════════════════════════════
// APP ROUTER
// ════════════════════════════════════════════════════════
const AppRouter = () => (
  <BrowserRouter future={{
    v7_startTransition:   true,
    v7_relativeSplatPath: true,
  }}>
    <Routes>

      {/* ── Public Routes ── */}
      <Route path="/login" element={<LoginPage />} />

      {/* ── Protected Routes ──
          ProtectedRoute check kare token
          AppLayout → Sidebar + Topbar + Outlet
          Har nested route Outlet mein render hoga */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
           <Route path="/"         element={<DashboardPage />} />  {/* ← UPDATED */}
          <Route path="/menu" element={<MenuPage />} />  // ← UPDATED
           <Route path="/orders"        element={<OrdersPage />}      />
          <Route path="/orders/new"    element={<NewOrderPage />}    />
          <Route path="/orders/:id"    element={<OrderDetailPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<Placeholder title="Settings"   />} />

        </Route>
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  </BrowserRouter>
)

export default AppRouter