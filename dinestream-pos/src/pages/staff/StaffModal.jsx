import { useState, useEffect } from 'react'

const ROLES = ['admin', 'manager', 'waiter', 'chef']

const StaffModal = ({ isOpen, onClose, onSave, editMember }) => {

  const [form, setForm] = useState({
    name:        '',
    email:       '',
    phone:       '',
    role:        'waiter',
    shiftStart:  '',
    shiftEnd:    '',
    status:      'on_duty',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editMember) {
      setForm({
        name:       editMember.name,
        email:      editMember.email,
        phone:      editMember.phone       || '',
        role:       editMember.role,
        shiftStart: editMember.shiftStart  || '',
        shiftEnd:   editMember.shiftEnd    || '',
        status:     editMember.status,
      })
    } else {
      setForm({
        name: '', email: '', phone: '',
        role: 'waiter', shiftStart: '',
        shiftEnd: '', status: 'on_duty',
      })
    }
    setErrors({})
  }, [editMember, isOpen])

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.email.includes('@')) e.email = 'Enter valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...(editMember ? { id: editMember.id } : {}),
      ...form,
      shift: `${form.shiftStart || '--'} - ${form.shiftEnd || '--'}`,
    })
    onClose()
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
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100, padding: 20,
      }}
    >
      <div style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        borderRadius: 16,
        width: '100%', maxWidth: 460,
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 18, fontWeight: 700,
            color: '#f4f4f5',
          }}>
            {editMember ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: '#27272a', border: 'none',
              color: '#71717a', cursor: 'pointer',
              fontSize: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f4f4f5'}
            onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
          >
            ✕
          </button>
        </div>

        {/* Full Name */}
        <Field label="Full Name" error={errors.name}>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. John Doe"
            style={inputSt(errors.name)}
          />
        </Field>

        {/* Email + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Email Address" error={errors.email}>
            <input
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="john@company.com"
              style={inputSt(errors.email)}
            />
          </Field>
          <Field label="Phone Number">
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              style={inputSt()}
            />
          </Field>
        </div>

        {/* Role + Shift */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Role">
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{ ...inputSt(), cursor: 'pointer' }}
            >
              {ROLES.map(r => (
                <option key={r} value={r}
                  style={{ background: '#18181b', color: '#f4f4f5' }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Shift Start">
            <input
              type="time"
              value={form.shiftStart}
              onChange={e => setForm(f => ({ ...f, shiftStart: e.target.value }))}
              style={{
                ...inputSt(),
                colorScheme: 'dark',
              }}
            />
          </Field>
        </div>

        {/* Active Status Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>
              Active Status
            </p>
            <p style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>
              Enable to set staff as on duty immediately
            </p>
          </div>
          <div
            onClick={() => setForm(f => ({
              ...f,
              status: f.status === 'on_duty' ? 'off_duty' : 'on_duty'
            }))}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: form.status === 'on_duty' ? '#f97316' : '#27272a',
              cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3,
              left: form.status === 'on_duty' ? 23 : 3,
              width: 18, height: 18,
              background: 'white', borderRadius: '50%',
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}/>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 10,
          paddingTop: 4,
          borderTop: '1px solid #27272a',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px',
              background: 'transparent',
              border: '1px solid #3f3f46',
              borderRadius: 10, cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              color: '#71717a', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#71717a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#3f3f46'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: '11px',
              background: '#f97316',
              border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 13,
              fontWeight: 600, color: 'white',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ea6c10'}
            onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
          >
            {editMember ? 'Save Changes' : 'Add Staff'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────
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

const inputSt = (error) => ({
  width: '100%',
  background: '#0d0d0d',
  border: `1px solid ${error ? '#ef444440' : '#2a2a2a'}`,
  borderRadius: 8, padding: '10px 12px',
  fontSize: 13, color: '#f4f4f5',
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  transition: 'border-color 0.15s',
})

export default StaffModal