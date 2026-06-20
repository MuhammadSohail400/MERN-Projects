import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validators'

// ─── Eye Icons ────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

// ─── Spinner ──────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
  </svg>
)

// ─── Logo ─────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div style={{
      width: 36, height: 36,
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 20px #f9731640'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2h18v4H3z"/><path d="M3 10h18v4H3z"/>
        <path d="M3 18h18v4H3z"/>
      </svg>
    </div>
    <span style={{
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700, fontSize: 20,
      color: '#f4f4f5', letterSpacing: '-0.3px'
    }}>
      DineStream
    </span>
  </div>
)

// ─── Input Field Component ────────────────────────────────────
const InputField = ({ label, type, value, onChange, placeholder, error, icon, rightElement }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{
      fontSize: 13, fontWeight: 500,
      color: '#a1a1aa', letterSpacing: '0.01em'
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)',
          color: error ? '#ef4444' : '#52525b',
          display: 'flex', pointerEvents: 'none'
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: '#18181b',
          border: `1px solid ${error ? '#ef444440' : '#ffffff12'}`,
          borderRadius: 10,
          padding: icon ? '12px 44px' : '12px 16px',
          paddingLeft: icon ? 42 : 16,
          paddingRight: rightElement ? 44 : 16,
          fontSize: 14,
          color: '#f4f4f5',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          fontFamily: 'DM Sans, sans-serif',
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? '#ef4444' : '#f97316'
          e.target.style.boxShadow = error
            ? '0 0 0 3px #ef444418'
            : '0 0 0 3px #f9731618'
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? '#ef444440' : '#ffffff12'
          e.target.style.boxShadow = 'none'
        }}
      />
      {rightElement && (
        <div style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)'
        }}>
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <span style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </span>
    )}
  </div>
)

// ════════════════════════════════════════════════════════
// MAIN LOGIN PAGE COMPONENT
// ════════════════════════════════════════════════════════
const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()

  // ── Form State ──────────────────────────────────────────
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors,   setErrors]   = useState({})
  const [mounted,  setMounted]  = useState(false)

  // ── Mount animation ──────────────────────────────────────
  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  // ── Redirect if already logged in ───────────────────────
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  // ── Validate ────────────────────────────────────────────
  const validate = () => {
    const newErrors = {}
    const emailErr  = validateEmail(email)
    const passErr   = validatePassword(password)
    if (emailErr) newErrors.email    = emailErr
    if (passErr)  newErrors.password = passErr
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return
    const result = await login(email, password)
    if (result.success) navigate('/')
  }

  // ── Enter key ───────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  // ── Email change — clear server error ───────────────────
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) clearError()          // ← Option 2: direct call
  }

  // ── Password change — clear server error ────────────────
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) clearError()          // ← Option 2: direct call
  }

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0b',
      display: 'flex',
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: 1,
        display: 'none',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #111113 0%, #0a0a0b 100%)',
      }}
        className="flex-col justify-between p-12 lg:flex"
      >
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(#ffffff06 1px, transparent 1px),
            linear-gradient(90deg, #ffffff06 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}/>

        {/* Orange glow */}
        <div style={{
          position: 'absolute',
          width: 400, height: 400,
          background: 'radial-gradient(circle, #f9731618 0%, transparent 70%)',
          top: '20%', left: '-10%',
          borderRadius: '50%',
        }}/>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo />
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#f9731618', border: '1px solid #f9731630',
            borderRadius: 20, padding: '6px 14px', marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }}/>
            <span style={{ fontSize: 12, color: '#f97316', fontWeight: 500, letterSpacing: '0.05em' }}>
              TRUSTED BY 500+ RESTAURANTS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 700, color: '#f4f4f5',
            lineHeight: 1.15, marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            The POS built for<br />
            <span style={{ color: '#f97316' }}>Pakistan's restaurants</span>
          </h1>

          <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.7, maxWidth: 360 }}>
            From Burns Road dhabas to upscale dine-ins —
            manage orders, staff, and revenue from one powerful dashboard.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32 }}>
            {['Order Management', 'Live Reports', 'Table Tracking', 'Staff Roles'].map(f => (
              <span key={f} style={{
                background: '#18181b', border: '1px solid #ffffff10',
                borderRadius: 20, padding: '6px 14px',
                fontSize: 13, color: '#a1a1aa',
              }}>✓ {f}</span>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        }}>
          {[
            { label: 'Restaurants', value: '500+' },
            { label: 'Orders/day',  value: '12K+' },
            { label: 'Uptime',      value: '99.9%'},
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#18181b', border: '1px solid #ffffff0f',
              borderRadius: 12, padding: 16,
            }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 22, fontWeight: 700, color: '#f97316',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        borderLeft: '1px solid #ffffff08',
        background: '#0d0d0f',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? 'translateY(0)' : 'translateY(12px)',
      }}
        className="mx-auto lg:mx-0"
      >
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <Logo />
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 26, fontWeight: 700,
            color: '#f4f4f5', letterSpacing: '-0.02em', marginBottom: 8,
          }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>
            Sign in to your DineStream dashboard
          </p>
        </div>

        {/* Server error banner */}
        {error && (
          <div style={{
            background: '#ef444412', border: '1px solid #ef444430',
            borderRadius: 10, padding: '12px 14px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          onKeyDown={handleKeyDown}
        >
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="admin@dinestream.com"
            error={errors.email}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-10 7L2 7"/>
              </svg>
            }
          />

          <InputField
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            error={errors.password}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  color: '#52525b', cursor: 'pointer',
                  background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          {/* Remember + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', fontSize: 13, color: '#71717a',
            }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#f97316', width: 15, height: 15 }}
              />
              Remember me for 30 days
            </label>
            <Link to="/forgot-password" style={{
              fontSize: 13, color: '#f97316',
              textDecoration: 'none', fontWeight: 500,
            }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading
                ? '#f9731680'
                : 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none', borderRadius: 10,
              padding: '13px 24px',
              fontSize: 14, fontWeight: 600, color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.15s',
              boxShadow: isLoading ? 'none' : '0 0 20px #f9731640',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.01em', marginTop: 4,
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseDown={e => {
              if (!isLoading) e.currentTarget.style.transform = 'scale(0.98)'
            }}
            onMouseUp={e => {
              if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            {isLoading
              ? <><Spinner /> Signing in...</>
              : <>Sign In
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
            }
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: '#ffffff0a' }}/>
          <span style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '0.08em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#ffffff0a' }}/>
        </div>

        {/* Demo credentials */}
        <div style={{
          background: '#18181b', border: '1px solid #ffffff0f',
          borderRadius: 10, padding: '14px 16px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: '#52525b', marginBottom: 8, fontWeight: 500 }}>
            DEMO CREDENTIALS
          </p>
          <p style={{ fontSize: 13, color: '#71717a', fontFamily: 'monospace' }}>
            admin@dinestream.com
          </p>
          <p style={{ fontSize: 13, color: '#71717a', fontFamily: 'monospace' }}>
            Admin@123
          </p>
        </div>

        {/* Sign up */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#52525b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{
            color: '#f97316', fontWeight: 600, textDecoration: 'none',
          }}>
            Request access
          </Link>
        </p>

        {/* Footer links */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 20,
          marginTop: 32, paddingTop: 24,
          borderTop: '1px solid #ffffff06',
        }}>
          {['Privacy', 'Terms', 'Support'].map(link => (
            <a key={link} href="#" style={{
              fontSize: 12, color: '#3f3f46', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#71717a'}
              onMouseLeave={e => e.currentTarget.style.color = '#3f3f46'}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoginPage