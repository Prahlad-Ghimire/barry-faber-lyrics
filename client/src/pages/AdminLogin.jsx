import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, scale } from 'framer-motion'
import axios from "axios";

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/api/auth/admin', { password }, { withCredentials: true })

      if (res.data.success) {
        sessionStorage.setItem('adminAuth', 'true')
        navigate('/admin')
      }
    } catch {
      setError('Incorrect administrator password.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, margin: '0 24px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              borderRadius: 20,
              fontFamily: 'sans-serif',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              color: 'rgba(201, 168, 76, 0.6)',
              textTransform: 'uppercase'
            }}
          >
            Administrator Access
          </span>
        </motion.div>
        <div
          style={{
            background: 'rgba(18,18,26,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(201, 168, 76, 0.12)',
            borderRadius: 16,
            padding: '40px 36px'
          }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
              marginBottom: 10
            }} />

            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: '1.3rem',
              fontWeight: 400,
              color: '#e8c97a',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}>
              Administrator Log-In
            </h1>

            <p style={{
              textAlign: 'center',
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.35)',
              marginTop: 0
            }}>
              To reach administrator page, enter password &amp; press Enter.
            </p>
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent)',
              marginTop: 18,
            }} />
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >

            <input type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin Password"
              autoFocus
              style={{
                width: '100%',
                padding: '13px 16px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: 8,
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: "'Georgia', serif",
                outline: "none",
                marginBottom: 8,
                letterSpacing: '0.12em',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201, 168, 76, 0.55)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "#e05252",
                    fontSize: "0.8rem",
                    marginBottom: 10,
                    textAlign: 'center',
                    fontFamily: "'Georgia', serif"
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 4,
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.08))',
                border: '1px solid rgba(201, 168, 76, 0.35)',
                borderRadius: 8,
                color: '#c9a84c',
                fontFamily: "'Georgia', serif",
                fontSize: '0.9rem',
                letterSpacing: '0.12em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '....' : 'ENTER'}
            </motion.button>
          </motion.form>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ textAlign: 'center', marginTop: 20 }}
        >
          <a href="/" style={{
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.2)',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            letterSpacing: '0.08em',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = 'rgba(255, 255, 255, 0.45)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.2)'}
          >
            Back to main site
          </a>
        </motion.div>
      </motion.div >
    </motion.div >
  )
}