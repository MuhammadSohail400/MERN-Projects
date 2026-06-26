import { useState, useCallback, useMemo } from 'react'
import useMenu from '../../hooks/useMenu'
import MenuItemCard  from '../../features/menu/MenuItemCard'
import MenuItemModal from '../../features/menu/MenuItemModal'
import { MENU_CATEGORIES } from '../../utils/mockData'

// ─── Empty State ──────────────────────────────────────────────
const EmptyState = ({ query }) => (
  <div style={{
    gridColumn: '1 / -1',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', gap: 12,
    textAlign: 'center',
  }}>
    <span style={{ fontSize: 40 }}>🍽️</span>
    <p style={{
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: 16, fontWeight: 600, color: '#f4f4f5',
    }}>
      {query ? `No items found for "${query}"` : 'No menu items yet'}
    </p>
    <p style={{ fontSize: 13, color: '#52525b' }}>
      {query ? 'Try a different search' : 'Add your first menu item'}
    </p>
  </div>
)

// ─── Skeleton Card ────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: '#111113',
    border: '1px solid #ffffff0a',
    borderRadius: 14, padding: 18,
    display: 'flex', flexDirection: 'column', gap: 14,
  }}>
    {['48px', '60px', '40px', '36px'].map((h, i) => (
      <div key={i} style={{
        height: h, background: '#18181b',
        borderRadius: 8,
        animation: 'shimmer 1.5s infinite',
      }}/>
    ))}
    <style>{`
      @keyframes shimmer {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1;   }
      }
    `}</style>
  </div>
)

// ════════════════════════════════════════════════════════
// MENU PAGE
// ════════════════════════════════════════════════════════
const MenuPage = () => {
  const { items, isLoading, addItem, editItem, deleteItem, toggleAvailability,getCategoryId,fetchMenu } = useMenu()

  const [search,       setSearch]       = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingItem,  setEditingItem]  = useState(null)

  const filteredItems = useMemo(() => {
  return items.filter(item => {
    // ✅ Null check add karo
    const itemCategory = item.category || ''
    const itemName     = item.name || ''
    const itemDesc     = item.description || ''

    const matchSearch = itemName.toLowerCase().includes(search.toLowerCase()) ||
                        itemDesc.toLowerCase().includes(search.toLowerCase())

    const matchCategory = activeCategory === 'All' ||
                          itemCategory.toLowerCase() === activeCategory.toLowerCase()

    return matchSearch && matchCategory
  })
}, [items, search, activeCategory])

  const stats = useMemo(() => ({
    total:     items.length,
    available: items.filter(i => i.isAvailable).length,
    unavailable: items.filter(i => !i.isAvailable).length,
  }), [items])

  const handleEdit = useCallback((item) => {
    setEditingItem(item)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this item?')) {
      deleteItem(id)
    }
  }, [deleteItem])

  const handleToggle = useCallback((id) => {
    toggleAvailability(id)
  }, [toggleAvailability])

  const handleSave = useCallback((formData) => {
    if (editingItem) {
      editItem(formData)
    } else {
      addItem(formData)
    }
  }, [editingItem, editItem, addItem])

  const handleAddNew = useCallback(() => {
    setEditingItem(null)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingItem(null)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      fontFamily: 'DM Sans, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* ── Header ── */}
      <div className="menu-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>

        <div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20, fontWeight: 700,
            color: '#f4f4f5', letterSpacing: '-0.02em',
          }}>
            Menu Management
          </h2>
          <p style={{ fontSize: 13, color: '#52525b', marginTop: 3 }}>
            {stats.total} items · {stats.available} available · {stats.unavailable} unavailable
          </p>
        </div>
        <button
            onClick={fetchMenu}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 text-xs"
          >
            🔄 Refresh
          </button>
        <button
          onClick={handleAddNew}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 10,
            padding: '10px 18px',
            fontSize: 13, fontWeight: 600, color: 'white',
            cursor: 'pointer',
            boxShadow: '0 0 20px #f9731630',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + Add Item
        </button>
      </div>

      {/* ── Search + Filter ── */}
      <div className="menu-filters" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>

        {/* Search */}
        <div style={{
          flex: '1 1 200px', minWidth: 0,
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: '#3f3f46', fontSize: 14,
          }}>
            🔍
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search menu items..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#111113',
              border: '1px solid #ffffff0a',
              borderRadius: 10, padding: '10px 12px 10px 36px',
              fontSize: 13, color: '#f4f4f5',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onFocus={e => e.target.style.borderColor = '#f97316'}
            onBlur={e => e.target.style.borderColor = '#ffffff0a'}
          />
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        }}>
          {MENU_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 14px',
                background: activeCategory === cat ? '#f9731620' : '#111113',
                border: `1px solid ${activeCategory === cat ? '#f97316' : '#ffffff0a'}`,
                borderRadius: 8,
                fontSize: 12, fontWeight: activeCategory === cat ? 600 : 400,
                color: activeCategory === cat ? '#f97316' : '#71717a',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="menu-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14,
      }}>
        {isLoading
          ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filteredItems.length === 0
            ? <EmptyState query={search} />
            : filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))
        }
      </div>

      {/* ── Modal ── */}
      <MenuItemModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editItem={editingItem}
      />

      <style>{`
        @media (max-width: 480px) {
          .menu-header button {
            width: 100%;
            justify-content: center;
          }
          .menu-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MenuPage