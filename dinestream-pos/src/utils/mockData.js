// ─── Dashboard Stats ──────────────────────────────────────────
export const MOCK_STATS = {
  todayRevenue:    284500,
  totalOrders:     47,
  activeOrders:    8,
  activeTables:    12,
  totalTables:     20,
  totalStaff:      14,
  avgOrderValue:   6053,
  revenueGrowth:   12.5,   // % vs yesterday
  ordersGrowth:    8.3,
  tablesGrowth:    -4.2,
}

// ─── Area Chart — Last 7 Days Revenue ─────────────────────────
export const MOCK_REVENUE_DATA = [
  { day: 'Mon', revenue: 198000, orders: 32 },
  { day: 'Tue', revenue: 245000, orders: 41 },
  { day: 'Wed', revenue: 189000, orders: 28 },
  { day: 'Thu', revenue: 312000, orders: 52 },
  { day: 'Fri', revenue: 398000, orders: 67 },
  { day: 'Sat', revenue: 445000, orders: 78 },
  { day: 'Sun', revenue: 284500, orders: 47 },
]

// ─── Bar Chart — Orders by Hour ───────────────────────────────
export const MOCK_HOURLY_DATA = [
  { hour: '10am', orders: 4  },
  { hour: '11am', orders: 8  },
  { hour: '12pm', orders: 18 },
  { hour: '1pm',  orders: 24 },
  { hour: '2pm',  orders: 16 },
  { hour: '3pm',  orders: 9  },
  { hour: '4pm',  orders: 6  },
  { hour: '5pm',  orders: 11 },
  { hour: '6pm',  orders: 19 },
  { hour: '7pm',  orders: 28 },
  { hour: '8pm',  orders: 32 },
  { hour: '9pm',  orders: 21 },
]

// ─── Pie Chart — Sales by Category ───────────────────────────
export const MOCK_CATEGORY_DATA = [
  { name: 'Burgers',  value: 35, color: '#f97316' },
  { name: 'Drinks',   value: 22, color: '#3b82f6' },
  { name: 'Pizza',    value: 18, color: '#22c55e' },
  { name: 'Deals',    value: 15, color: '#eab308' },
  { name: 'Desserts', value: 10, color: '#a855f7' },
]

// ─── Recent Orders ────────────────────────────────────────────
export const MOCK_RECENT_ORDERS = [
  {
    id: '1', orderNumber: 'ORD-0041',
    table: 'Table 4', items: 3,
    amount: 8500, status: 'preparing',
    time: '2 min ago', waiter: 'Ali',
  },
  {
    id: '2', orderNumber: 'ORD-0040',
    table: 'Table 7', items: 5,
    amount: 14200, status: 'served',
    time: '8 min ago', waiter: 'Sara',
  },
  {
    id: '3', orderNumber: 'ORD-0039',
    table: 'Table 2', items: 2,
    amount: 4800, status: 'paid',
    time: '15 min ago', waiter: 'Usman',
  },
  {
    id: '4', orderNumber: 'ORD-0038',
    table: 'Table 9', items: 4,
    amount: 11000, status: 'pending',
    time: '18 min ago', waiter: 'Ali',
  },
  {
    id: '5', orderNumber: 'ORD-0037',
    table: 'Table 1', items: 6,
    amount: 18500, status: 'paid',
    time: '24 min ago', waiter: 'Sara',
  },
]
// ─── Mock Menu Items ──────────────────────────────────────────
export const MOCK_MENU_ITEMS = [
  {
    id: '1', name: 'Smash Burger',
    description: 'Double smash patty, cheddar, special sauce',
    price: 850, category: 'Burgers',
    isAvailable: true, prepTime: 12,
    emoji: '🍔',
  },
  {
    id: '2', name: 'Crispy Fries',
    description: 'Golden crispy fries with dipping sauce',
    price: 320, category: 'Sides',
    isAvailable: true, prepTime: 8,
    emoji: '🍟',
  },
  {
    id: '3', name: 'Margherita Pizza',
    description: 'Fresh tomato, mozzarella, basil',
    price: 1200, category: 'Pizza',
    isAvailable: true, prepTime: 20,
    emoji: '🍕',
  },
  {
    id: '4', name: 'Zinger Burger',
    description: 'Crispy chicken, coleslaw, mayo',
    price: 750, category: 'Burgers',
    isAvailable: true, prepTime: 10,
    emoji: '🍔',
  },
  {
    id: '5', name: 'Chocolate Shake',
    description: 'Thick creamy chocolate milkshake',
    price: 450, category: 'Drinks',
    isAvailable: true, prepTime: 5,
    emoji: '🥤',
  },
  {
    id: '6', name: 'Chicken Karahi',
    description: 'Traditional spicy chicken karahi',
    price: 1800, category: 'Mains',
    isAvailable: false, prepTime: 25,
    emoji: '🍛',
  },
  {
    id: '7', name: 'Brownie + Ice Cream',
    description: 'Warm brownie with vanilla scoop',
    price: 550, category: 'Desserts',
    isAvailable: true, prepTime: 7,
    emoji: '🍫',
  },
  {
    id: '8', name: 'BBQ Platter',
    description: 'Mix grill: seekh, tikka, chops',
    price: 2800, category: 'Mains',
    isAvailable: true, prepTime: 30,
    emoji: '🥩',
  },
]

export const MENU_CATEGORIES = [
  'All', 'Burgers', 'Pizza', 'Mains', 'Sides', 'Drinks', 'Desserts'
]
// ─── Mock Orders ──────────────────────────────────────────────
export const MOCK_ORDERS = [
  {
    id: '1', orderNumber: 'ORD-0041',
    tableNumber: 4, waiter: 'Ali Hassan',
    status: 'preparing', totalAmount: 8500,
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    items: [
      { id: '1', name: 'Smash Burger', emoji: '🍔', quantity: 2, price: 850,  notes: 'Extra sauce' },
      { id: '2', name: 'Crispy Fries', emoji: '🍟', quantity: 2, price: 320,  notes: '' },
      { id: '5', name: 'Chocolate Shake', emoji: '🥤', quantity: 2, price: 450, notes: '' },
    ],
  },
  {
    id: '2', orderNumber: 'ORD-0040',
    tableNumber: 7, waiter: 'Sara Khan',
    status: 'served', totalAmount: 14200,
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    items: [
      { id: '3', name: 'Margherita Pizza', emoji: '🍕', quantity: 1, price: 1200, notes: 'Well done' },
      { id: '8', name: 'BBQ Platter',      emoji: '🥩', quantity: 1, price: 2800, notes: '' },
      { id: '5', name: 'Chocolate Shake',  emoji: '🥤', quantity: 4, price: 450,  notes: '' },
    ],
  },
  {
    id: '3', orderNumber: 'ORD-0039',
    tableNumber: 2, waiter: 'Usman Ali',
    status: 'paid', totalAmount: 4800,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      { id: '4', name: 'Zinger Burger', emoji: '🍔', quantity: 2, price: 750, notes: '' },
      { id: '2', name: 'Crispy Fries',  emoji: '🍟', quantity: 2, price: 320, notes: 'No salt' },
    ],
  },
  {
    id: '4', orderNumber: 'ORD-0038',
    tableNumber: 9, waiter: 'Ali Hassan',
    status: 'pending', totalAmount: 11000,
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    items: [
      { id: '6', name: 'Chicken Karahi', emoji: '🍛', quantity: 1, price: 1800, notes: 'Extra spicy' },
      { id: '3', name: 'Margherita Pizza', emoji: '🍕', quantity: 1, price: 1200, notes: '' },
      { id: '5', name: 'Chocolate Shake',  emoji: '🥤', quantity: 2, price: 450,  notes: '' },
    ],
  },
  {
    id: '5', orderNumber: 'ORD-0037',
    tableNumber: 1, waiter: 'Sara Khan',
    status: 'paid', totalAmount: 18500,
    createdAt: new Date(Date.now() - 24 * 60000).toISOString(),
    items: [
      { id: '8', name: 'BBQ Platter',      emoji: '🥩', quantity: 2, price: 2800, notes: '' },
      { id: '7', name: 'Brownie + Ice Cream', emoji: '🍫', quantity: 3, price: 550, notes: '' },
      { id: '5', name: 'Chocolate Shake',  emoji: '🥤', quantity: 4, price: 450,  notes: '' },
    ],
  },
  {
    id: '6', orderNumber: 'ORD-0036',
    tableNumber: 5, waiter: 'Usman Ali',
    status: 'cancelled', totalAmount: 3200,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    items: [
      { id: '1', name: 'Smash Burger', emoji: '🍔', quantity: 2, price: 850, notes: '' },
      { id: '2', name: 'Crispy Fries', emoji: '🍟', quantity: 2, price: 320, notes: '' },
    ],
  },
]

// ─── Mock Tables for NewOrder ─────────────────────────────────
export const MOCK_TABLES_LIST = [
  { id: '1',  tableNumber: 1,  label: 'T-01', capacity: 2,  status: 'occupied',  floor: 1, waiter: 'Marcus',  duration: '45m',    zone: ''        },
  { id: '2',  tableNumber: 2,  label: 'T-02', capacity: 4,  status: 'available', floor: 1, waiter: null,      duration: null,     zone: ''        },
  { id: '3',  tableNumber: 3,  label: 'T-03', capacity: 2,  status: 'reserved',  floor: 1, waiter: 'Sara',    duration: null,     zone: ''        },
  { id: '4',  tableNumber: 4,  label: 'T-04', capacity: 6,  status: 'available', floor: 1, waiter: null,      duration: null,     zone: 'VIP Area' },
  { id: '5',  tableNumber: 5,  label: 'T-05', capacity: 4,  status: 'occupied',  floor: 1, waiter: 'Leo',     duration: '12m',    zone: ''        },
  { id: '6',  tableNumber: 6,  label: 'T-06', capacity: 2,  status: 'available', floor: 1, waiter: null,      duration: null,     zone: ''        },
  { id: '7',  tableNumber: 7,  label: 'T-07', capacity: 2,  status: 'available', floor: 1, waiter: null,      duration: null,     zone: ''        },
  { id: '8',  tableNumber: 8,  label: 'T-08', capacity: 8,  status: 'occupied',  floor: 1, waiter: 'Marcus',  duration: '1h 20m', zone: ''        },
  { id: '9',  tableNumber: 9,  label: 'T-09', capacity: 4,  status: 'available', floor: 2, waiter: null,      duration: null,     zone: ''        },
  { id: '10', tableNumber: 10, label: 'T-10', capacity: 2,  status: 'occupied',  floor: 2, waiter: 'Ali',     duration: '30m',    zone: ''        },
  { id: '11', tableNumber: 11, label: 'T-11', capacity: 6,  status: 'reserved',  floor: 2, waiter: null,      duration: null,     zone: ''        },
  { id: '12', tableNumber: 12, label: 'T-12', capacity: 4,  status: 'available', floor: 2, waiter: null,      duration: null,     zone: ''        },
  { id: '13', tableNumber: 13, label: 'T-13', capacity: 8,  status: 'occupied',  floor: 2, waiter: 'Sara',    duration: '55m',    zone: ''        },
  { id: '14', tableNumber: 14, label: 'T-14', capacity: 2,  status: 'available', floor: 2, waiter: null,      duration: null,     zone: ''        },
  { id: '15', tableNumber: 15, label: 'T-15', capacity: 4,  status: 'available', floor: 2, waiter: null,      duration: null,     zone: ''        },
]

export const MOCK_STAFF = [
  {
    id: '1', name: 'Ahmed Raza', email: 'ahmed@dinestream.com',
    phone: '+92 300 1234567', role: 'admin',
    status: 'on_duty', shift: '9AM - 6PM',
    shiftStart: '09:00', shiftEnd: '18:00',
    startedAgo: 'Started 4h ago', ordersToday: 0,
    maxOrders: 30, avatarColor: '#f97316',
  },
  {
    id: '2', name: 'Sara Khan', email: 'sara@dinestream.com',
    phone: '+92 301 2345678', role: 'manager',
    status: 'on_duty', shift: '10AM - 8PM',
    shiftStart: '10:00', shiftEnd: '20:00',
    startedAgo: 'Started 3h ago', ordersToday: 12,
    maxOrders: 20, avatarColor: '#3b82f6',
  },
  {
    id: '3', name: 'Ali Hassan', email: 'ali@dinestream.com',
    phone: '+92 302 3456789', role: 'waiter',
    status: 'on_duty', shift: '11AM - 9PM',
    shiftStart: '11:00', shiftEnd: '21:00',
    startedAgo: 'Started 2h ago', ordersToday: 8,
    maxOrders: 20, avatarColor: '#22c55e',
  },
  {
    id: '4', name: 'Usman Ali', email: 'usman@dinestream.com',
    phone: '+92 303 4567890', role: 'waiter',
    status: 'on_break', shift: '12PM - 10PM',
    shiftStart: '12:00', shiftEnd: '22:00',
    startedAgo: 'Paused 15m ago', ordersToday: 5,
    maxOrders: 20, avatarColor: '#a855f7',
  },
  {
    id: '5', name: 'Fatima Malik', email: 'fatima@dinestream.com',
    phone: '+92 304 5678901', role: 'chef',
    status: 'on_duty', shift: '8AM - 4PM',
    shiftStart: '08:00', shiftEnd: '16:00',
    startedAgo: 'Started 5h ago', ordersToday: 23,
    maxOrders: 25, avatarColor: '#ec4899',
  },
  {
    id: '6', name: 'Bilal Ahmed', email: 'bilal@dinestream.com',
    phone: '+92 305 6789012', role: 'chef',
    status: 'on_duty', shift: '2PM - 10PM',
    shiftStart: '14:00', shiftEnd: '22:00',
    startedAgo: 'Started 1h ago', ordersToday: 18,
    maxOrders: 25, avatarColor: '#14b8a6',
  },
  {
    id: '7', name: 'Maria Sheikh', email: 'maria@dinestream.com',
    phone: '+92 306 7890123', role: 'waiter',
    status: 'off_duty', shift: '6AM - 2PM',
    shiftStart: '06:00', shiftEnd: '14:00',
    startedAgo: 'Ended 2h ago', ordersToday: 0,
    maxOrders: 20, avatarColor: '#f59e0b',
  },
]