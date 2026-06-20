export const ORDER_STATUS = {
  PENDING:    'pending',
  PREPARING:  'preparing',
  SERVED:     'served',
  PAID:       'paid',
  CANCELLED:  'cancelled',
}

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED:  'occupied',
  RESERVED:  'reserved',
}

export const USER_ROLES = {
  ADMIN:    'admin',
  MANAGER:  'manager',
  WAITER:   'waiter',
  CHEF:     'chef',
}

export const NAV_LINKS = [
  { path: '/',         label: 'Dashboard',  icon: 'dashboard' },
  { path: '/orders',   label: 'Orders',     icon: 'orders'    },
  { path: '/menu',     label: 'Menu',       icon: 'menu'      },
  { path: '/tables',   label: 'Tables',     icon: 'tables'    },
  { path: '/staff',    label: 'Staff',      icon: 'staff'     },
  { path: '/reports',  label: 'Reports',    icon: 'reports'   },
  { path: '/settings', label: 'Settings',   icon: 'settings'  },
]