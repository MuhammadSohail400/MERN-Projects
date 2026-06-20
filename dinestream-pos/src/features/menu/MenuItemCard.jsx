import { memo, useCallback } from 'react'
import { formatCurrency } from '../../utils/formatters'

// 🧠 memo → props same hain toh re-render mat karo
// 50 menu items hain → ek item delete hone par
// sirf woh item remove ho, baaki 49 re-render na karein
const MenuItemCard = memo(({ item, onEdit, onDelete, onToggle }) => {

  // 🧠 useCallback inside memo'd component
  // Yeh handlers stable rahein
  const handleEdit   = useCallback(() => onEdit(item),      [item, onEdit])
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete])
  const handleToggle = useCallback(() => onToggle(item.id), [item.id, onToggle])

  return (
    <div style={{
      background: '#111113',
      border: `1px solid ${item.isAvailable ? '#ffffff0a' : '#ef444420'}`,
      borderRadius: 14,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      transition: 'border-color 0.2s, transform 0.2s',
      opacity: item.isAvailable ? 1 : 0.6,
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = item.isAvailable ? '#ffffff18' : '#ef444435'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = item.isAvailable ? '#ffffff0a' : '#ef444420'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Unavailable overlay tag */}
      {!item.isAvailable && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: '#ef444418',
          border: '1px solid #ef444430',
          borderRadius: 20, padding: '3px 8px',
          fontSize: 10, fontWeight: 600,
          color: '#ef4444', letterSpacing: '0.05em',
        }}>
          UNAVAILABLE
        </div>
      )}

      {/* Top — emoji + category */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 48, height: 48,
          background: '#18181b',
          border: '1px solid #ffffff08',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>
          {item.emoji}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600,
          color: '#52525b',
          background: '#18181b',
          border: '1px solid #ffffff08',
          borderRadius: 20, padding: '3px 10px',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {item.category}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <h4 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 15, fontWeight: 700,
          color: '#f4f4f5', letterSpacing: '-0.01em',
          marginBottom: 4,
        }}>
          {item.name}
        </h4>
        <p style={{
          fontSize: 12, color: '#52525b', lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>
      </div>

      {/* Price + prep time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 17, fontWeight: 700,
          color: '#f97316',
        }}>
          {formatCurrency(item.price)}
        </span>
        <span style={{ fontSize: 11, color: '#3f3f46' }}>
          ⏱ {item.prepTime} min
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 8,
        paddingTop: 12,
        borderTop: '1px solid #ffffff08',
      }}>

        {/* Toggle availability */}
        <button
          onClick={handleToggle}
          style={{
            flex: 1,
            background: item.isAvailable ? '#22c55e15' : '#ffffff08',
            border: `1px solid ${item.isAvailable ? '#22c55e25' : '#ffffff10'}`,
            borderRadius: 8, padding: '8px 0',
            fontSize: 11, fontWeight: 600,
            color: item.isAvailable ? '#22c55e' : '#52525b',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
        </button>

        {/* Edit */}
        <button
          onClick={handleEdit}
          style={{
            width: 36, height: 36,
            background: '#3b82f615',
            border: '1px solid #3b82f625',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#3b82f6',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#3b82f625'}
          onMouseLeave={e => e.currentTarget.style.background = '#3b82f615'}
          title="Edit item"
        >
          ✏️
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          style={{
            width: 36, height: 36,
            background: '#ef444415',
            border: '1px solid #ef444425',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ef4444',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ef444425'}
          onMouseLeave={e => e.currentTarget.style.background = '#ef444415'}
          title="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  )
})

MenuItemCard.displayName = 'MenuItemCard'

export default MenuItemCard