import { useState, useEffect } from 'react'
import useMenu from '../../hooks/useMenu'
import useToast from '../../hooks/useToast'

const EMOJIS = ['🍔', '🍕', '🍟', '🥤', '🍛', '🥩', '🍫', '🥗', '🍜', '🧆', '🥪', '🍱']

const MenuItemModal = ({ isOpen, onClose, onSave, editItem }) => {

  const { categories, addCategory } = useMenu()
  const toast = useToast()

  // ── Form State ──────────────────────────────────────────────
  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
    category:    '',
    prepTime:    '',
    emoji:       '🍔',
    isAvailable: true,
  })
  const [errors, setErrors] = useState({})

  // ── New category mini-form state ──────────────────────────────
  const [showNewCategory,  setShowNewCategory]  = useState(false)
  const [newCategoryName,  setNewCategoryName]  = useState('')
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('🍽️')
  const [addingCategory,   setAddingCategory]   = useState(false)

  // ── Set default category once categories load ─────────────────
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0].name }))
    }
  }, [categories])

  // ── Populate form on edit, reset on add ────────────────────────
  useEffect(() => {
    if (editItem) {
      setForm({
        name:        editItem.name,
        description: editItem.description || '',
        price:       editItem.price.toString(),
        category:    editItem.category,
        prepTime:    editItem.prepTime.toString(),
        emoji:       editItem.emoji || '🍔',
        isAvailable: editItem.isAvailable,
      })
    } else {
      setForm({
        name: '', description: '', price: '',
        category: categories[0]?.name || '',
        prepTime: '', emoji: '🍔', isAvailable: true,
      })
    }
    setErrors({})
    setShowNewCategory(false)
    setNewCategoryName('')
  }, [editItem, isOpen])

  // ── Validate ────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name     = 'Name is required'
    if (!form.price)        e.price    = 'Price is required'
    if (isNaN(form.price))  e.price    = 'Price must be a number'
    if (!form.prepTime)     e.prepTime = 'Prep time is required'
    if (!form.category)     e.category = 'Category is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit main item form ──────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...(editItem ? { id: editItem.id, categoryId: editItem.categoryId } : {}),
      ...form,
      price:    Number(form.price),
      prepTime: Number(form.prepTime),
    })
    onClose()
  }

  // ── Create a new category inline ───────────────────────────────
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    setAddingCategory(true)
    const result = await addCategory({
      name:  newCategoryName.trim(),
      icon:  newCategoryEmoji,
      color: '#f97316',
    })
    setAddingCategory(false)

    if (result.success) {
      toast.success(`Category "${result.category.name}" added`)
      setForm(f => ({ ...f, category: result.category.name }))
      setNewCategoryName('')
      setNewCategoryEmoji('🍽️')
      setShowNewCategory(false)
    } else {
      toast.error(result.error)
    }
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0,
        background: '#000000a0',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100, padding: 20,
      }}
    >
      <div style={{
        background: '#111113',
        border: '1px solid #ffffff12',
        borderRadius: 16,
        width: '100%', maxWidth: 480,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 18, fontWeight: 700, color: '#f4f4f5',
            }}>
              {editItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <p style={{ fontSize: 12, color: '#52525b', marginTop: 3 }}>
              {editItem ? 'Update menu item details' : 'Add a new item to your menu'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, background: '#18181b',
              border: '1px solid #ffffff0a', borderRadius: 8,
              cursor: 'pointer', color: '#71717a', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f4f4f5'}
            onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
          >
            ✕
          </button>
        </div>

        {/* ── Emoji Picker ── */}
        <div>
          <label style={{ fontSize: 12, color: '#71717a', fontWeight: 500, display: 'block', marginBottom: 8 }}>
            Choose Icon
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setForm(f => ({ ...f, emoji }))}
                style={{
                  width: 40, height: 40,
                  background: form.emoji === emoji ? '#f9731620' : '#18181b',
                  border: `1px solid ${form.emoji === emoji ? '#f97316' : '#ffffff0a'}`,
                  borderRadius: 8, fontSize: 20, cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ── Name ── */}
        <Field label="Item Name" error={errors.name}>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Smash Burger"
            style={inputStyle(errors.name)}
          />
        </Field>

        {/* ── Description ── */}
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of the item..."
            rows={2}
            style={{ ...inputStyle(), resize: 'none', lineHeight: 1.5 }}
          />
        </Field>

        {/* ── Price + PrepTime ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Price (PKR)" error={errors.price}>
            <input
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="850"
              type="number"
              style={inputStyle(errors.price)}
            />
          </Field>
          <Field label="Prep Time (min)" error={errors.prepTime}>
            <input
              value={form.prepTime}
              onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))}
              placeholder="12"
              type="number"
              style={inputStyle(errors.prepTime)}
            />
          </Field>
        </div>

        {/* ── Category — with inline "+ Add New Category" ── */}
        <Field label="Category" error={errors.category}>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={{ ...inputStyle(), cursor: 'pointer' }}
          >
            {categories.length === 0 ? (
              <option value="">Loading categories...</option>
            ) : (
              categories.map(cat => (
                <option
                  key={cat.id}
                  value={cat.name}
                  style={{ background: '#18181b', color: '#f4f4f5' }}
                >
                  {cat.icon} {cat.name}
                </option>
              ))
            )}
          </select>

          {/* Toggle inline new-category form */}
          <button
            type="button"
            onClick={() => setShowNewCategory(v => !v)}
            style={{
              marginTop: 8,
              background: 'none', border: 'none',
              color: '#f97316', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', padding: 0,
              textAlign: 'left',
            }}
          >
            {showNewCategory ? '✕ Cancel' : '+ Add New Category'}
          </button>

          {/* Inline mini-form */}
          {showNewCategory && (
            <div style={{
              marginTop: 10,
              background: '#18181b',
              border: '1px solid #ffffff0f',
              borderRadius: 10,
              padding: 12,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newCategoryEmoji}
                  onChange={e => setNewCategoryEmoji(e.target.value)}
                  maxLength={2}
                  style={{
                    width: 44, textAlign: 'center',
                    background: '#0d0d0d', border: '1px solid #ffffff0f',
                    borderRadius: 8, padding: '8px 0',
                    fontSize: 18, color: '#f4f4f5', outline: 'none',
                  }}
                />
                <input
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  style={{
                    flex: 1,
                    background: '#0d0d0d', border: '1px solid #ffffff0f',
                    borderRadius: 8, padding: '8px 10px',
                    fontSize: 13, color: '#f4f4f5', outline: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={addingCategory}
                style={{
                  background: '#f97316', border: 'none',
                  borderRadius: 8, padding: '8px 0',
                  fontSize: 12, fontWeight: 600, color: 'white',
                  cursor: addingCategory ? 'not-allowed' : 'pointer',
                  opacity: addingCategory ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {addingCategory ? 'Adding...' : 'Create Category'}
              </button>
            </div>
          )}
        </Field>

        {/* ── Availability Toggle ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#18181b', border: '1px solid #ffffff08',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#f4f4f5' }}>
              Available on Menu
            </p>
            <p style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
              Customers can order this item
            </p>
          </div>
          <div
            onClick={() => setForm(f => ({ ...f, isAvailable: !f.isAvailable }))}
            style={{
              width: 44, height: 24,
              background: form.isAvailable ? '#f97316' : '#27272a',
              borderRadius: 12, cursor: 'pointer',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3,
              left: form.isAvailable ? 23 : 3,
              width: 18, height: 18,
              background: 'white', borderRadius: '50%',
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px #00000040',
            }}/>
          </div>
        </div>

        {/* ── Footer Buttons ── */}
        <div style={{
          display: 'flex', gap: 10,
          paddingTop: 8, borderTop: '1px solid #ffffff08',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px 0',
              background: 'transparent',
              border: '1px solid #ffffff12',
              borderRadius: 10, cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#71717a',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff25'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ffffff12'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: '11px 0',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 10,
              cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: 'white',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {editItem ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helper Components ────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
      {label}
    </label>
    {children}
    {error && (
      <span style={{ fontSize: 11, color: '#ef4444' }}>⚠ {error}</span>
    )}
  </div>
)

const inputStyle = (error) => ({
  width: '100%',
  background: '#18181b',
  border: `1px solid ${error ? '#ef444440' : '#ffffff0f'}`,
  borderRadius: 8, padding: '10px 12px',
  fontSize: 13, color: '#f4f4f5',
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  transition: 'border-color 0.15s',
})

export default MenuItemModal