import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0b',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      fontFamily: 'Space Grotesk, sans-serif', color: '#f4f4f5'
    }}>
      <span style={{ fontSize: 64 }}>🍽️</span>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f97316' }}>404</h1>
      <p style={{ color: '#52525b', fontSize: 15 }}>Page not found</p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 8, padding: '10px 24px',
          background: '#f97316', border: 'none',
          borderRadius: 8, color: 'white',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Go Home
      </button>
    </div>
  )
}
export default NotFoundPage