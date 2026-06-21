import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useToast from '../../hooks/useToast'

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { key: 'profile',     label: 'Profile',      icon: '👤' },
  { key: 'security',    label: 'Security',     icon: '🔒' },
  { key: 'restaurant',  label: 'Restaurant',   icon: '🍽️' },
]

// ─── Reusable Input ────────────────────────────────────────────
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12px] text-zinc-500 font-medium">{label}</label>
    <input
      {...props}
      className={`
        w-full bg-[#18181b] border rounded-lg py-2.5 px-3.5
        text-[13px] text-zinc-100 placeholder-zinc-600 outline-none
        transition-colors duration-150 font-body
        ${error ? 'border-red-500/40' : 'border-zinc-700 focus:border-orange-500'}
      `}
    />
    {error && <span className="text-[11px] text-red-400">⚠ {error}</span>}
  </div>
)

// ════════════════════════════════════════════════════════
// SETTINGS PAGE
// ════════════════════════════════════════════════════════
const SettingsPage = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('profile')

  // ── Profile form state ──────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
  })
  const [profileErrors, setProfileErrors]   = useState({})
  const [profileLoading, setProfileLoading] = useState(false)

  // ── Password form state ─────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors]   = useState({})
  const [passwordLoading, setPasswordLoading] = useState(false)

  // ── Restaurant form state (local only — future backend hook) ──
  const [restaurantForm, setRestaurantForm] = useState({
    name:    'DineStream Restaurant',
    address: 'Karachi, Pakistan',
    phone:   '+92 300 0000000',
  })

  // ── Profile validation ───────────────────────────────────────
  const validateProfile = () => {
    const e = {}
    if (!profileForm.name.trim())  e.name  = 'Name is required'
    if (!profileForm.email.trim()) e.email = 'Email is required'
    if (profileForm.email && !profileForm.email.includes('@')) {
      e.email = 'Enter a valid email'
    }
    setProfileErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Profile submit ────────────────────────────────────────────
  const handleProfileSave = async () => {
    if (!validateProfile()) return
    setProfileLoading(true)
    const result = await updateProfile(profileForm)
    setProfileLoading(false)

    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.error)
    }
  }

  // ── Password validation ───────────────────────────────────────
  const validatePassword = () => {
    const e = {}
    if (!passwordForm.currentPassword) e.currentPassword = 'Current password is required'
    if (!passwordForm.newPassword)     e.newPassword     = 'New password is required'
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      e.newPassword = 'Must be at least 6 characters'
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      e.confirmPassword = 'Passwords do not match'
    }
    setPasswordErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Password submit ───────────────────────────────────────────
  const handlePasswordSave = async () => {
    if (!validatePassword()) return
    setPasswordLoading(true)
    const result = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword:     passwordForm.newPassword,
    })
    setPasswordLoading(false)

    if (result.success) {
      toast.success('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      toast.error(result.error)
    }
  }

  // ── Restaurant submit (local for now) ─────────────────────────
  const handleRestaurantSave = () => {
    toast.success('Restaurant info saved')
    // Future: API call to persist restaurant settings
  }

  return (
    <div className="flex flex-col gap-5 font-body max-w-3xl">

      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-zinc-100 tracking-tight">
          Settings
        </h2>
        <p className="text-[13px] text-zinc-500 mt-1">
          Manage your account and restaurant preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-zinc-800 pb-0">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2.5
              text-[13px] font-medium cursor-pointer
              border-b-2 transition-all duration-150
              ${activeTab === tab.key
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }
            `}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">

          <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl font-bold text-white font-heading shadow-lg shadow-orange-500/25">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-zinc-100">{user?.name}</p>
              <p className="text-[12px] text-zinc-500 capitalize mt-0.5">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>

          <Input
            label="Full Name"
            value={profileForm.name}
            onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
            error={profileErrors.name}
            placeholder="Your full name"
          />

          <Input
            label="Email Address"
            type="email"
            value={profileForm.email}
            onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
            error={profileErrors.email}
            placeholder="your@email.com"
          />

          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="
              w-fit px-5 py-2.5 mt-2
              bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-[13px] font-semibold
              rounded-xl border-none cursor-pointer
              transition-all duration-150 active:scale-95
            "
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === 'security' && (
        <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <p className="text-[14px] font-semibold text-zinc-100">Change Password</p>
            <p className="text-[12px] text-zinc-500 mt-1">
              Use a strong password you don't use elsewhere
            </p>
          </div>

          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
            error={passwordErrors.currentPassword}
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
            error={passwordErrors.newPassword}
            placeholder="At least 6 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
            error={passwordErrors.confirmPassword}
            placeholder="Re-enter new password"
          />

          <button
            onClick={handlePasswordSave}
            disabled={passwordLoading}
            className="
              w-fit px-5 py-2.5 mt-2
              bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-[13px] font-semibold
              rounded-xl border-none cursor-pointer
              transition-all duration-150 active:scale-95
            "
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

      {/* ── RESTAURANT TAB ── */}
      {activeTab === 'restaurant' && (
        <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <p className="text-[14px] font-semibold text-zinc-100">Restaurant Information</p>
            <p className="text-[12px] text-zinc-500 mt-1">
              This appears on receipts and customer-facing screens
            </p>
          </div>

          <Input
            label="Restaurant Name"
            value={restaurantForm.name}
            onChange={e => setRestaurantForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. DineStream Restaurant"
          />

          <Input
            label="Address"
            value={restaurantForm.address}
            onChange={e => setRestaurantForm(f => ({ ...f, address: e.target.value }))}
            placeholder="Full address"
          />

          <Input
            label="Phone Number"
            value={restaurantForm.phone}
            onChange={e => setRestaurantForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+92 300 0000000"
          />

          <button
            onClick={handleRestaurantSave}
            className="
              w-fit px-5 py-2.5 mt-2
              bg-orange-500 hover:bg-orange-600
              text-white text-[13px] font-semibold
              rounded-xl border-none cursor-pointer
              transition-all duration-150 active:scale-95
            "
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

export default SettingsPage