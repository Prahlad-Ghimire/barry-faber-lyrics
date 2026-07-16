import { useState, useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, color } from 'framer-motion'
import axios from "axios";

const api = (path, method = 'get', data) => axios({ method, url: `/api${path}`, data, withCredentials: true })

export default function AdminPassword() {
  const navigate = useNavigate()
  const [passwords, setPasswords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    api('/passwords')
      .then(res => setPasswords(res.data))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const deletePassword = async (id, value) => {
    setDeleting(id)
    try {
      await api(`/passwords/${id}`, 'delete')
      setPasswords(prev => prev.filter(p => p._id !== id))
      showToast(`Password "${value}" deleted`)
    } catch { showToast('Failed to delete') }
    finally { setDeleting(null) }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: 'var(--dark)' }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 32
          }}
        >
          <p style={adminLabelStyle}>Admin - Passwords</p>
          <h1 style={pageTitleStyle}>List of passwords</h1>
          <div style={dividerStyle} />
          <p style={hintstyle}>
            This page displays all passwords that have been created.
            Clicking Delete next to any password eliminates that password's access to the main site.
          </p>
        </motion.div>
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 32,
          flexWrap: 'wrap'
        }}>
          <NavBtn onClick={() => navigate('/admin')}>Admin Home</NavBtn>
          <NavBtn onClick={() => navigate('/admin/analytics')}>See Analytics</NavBtn>
          <NavBtn onClick={() => navigate('/admin/about')}>Add About Info</NavBtn>
        </div>
        {loading ? (
          <p style={hintstyle}>Loading...</p>
        ) : passwords.length === 0 ? (
          <p style={hintstyle}>No passwords added yet. Go to Admin Home to add passwords.</p>
        ) : (
          <div>
            <AnimatePresence>
              {passwords.map((pwd, i) => (
                <motion.div
                  key={pwd._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(201, 168, 76, 0.07)',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      fontFamily: 'sans-serif', fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.2)', maxWidth: 24,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: '0.95rem',
                      color: 'rgba(255,255,255,0.75)',
                      letterSpacing: '0.06em'
                    }}>
                      {pwd.value}
                    </span>
                    <span style={{
                      fontFamily: 'sans-serif', fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      Added {new Date(pwd.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => deletePassword(pwd._id, pwd.value)}
                    disabled={deleting === pwd._id}
                    whileHover={{ scale: 1.04, borderColor: 'rgba(224,82,82,0.6)' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '6px 14px',
                      background: 'transparent',
                      border: '1px solid rgba(224,82,82,0.25)',
                      borderRadius: 5,
                      color: 'rgba(224,82,82,0.65)',
                      fontFamily: "'Georgia', serif",
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      cursor: deleting === pwd._id ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {deleting === pwd._id ? '...' : 'Delete'}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            <p style={{ ...hintstyle, marginTop: 20 }}>
              {passwords.length} password{passwords.length !== 1 ? 's' : ''} total
            </p>
          </div>
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'fixed', top: 20, right: 20, zIndex: 100,
              background: 'rgba(18,18,26,0.95)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 8, padding: '10px 18px',
              color: '#e8c97a', fontFamily: "'Georgria', serif", fontSize: '0.85rem',
            }}
          >
            {toast}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
const NavBtn = ({ onClick, children }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    style={{
      padding: '8px 16px', background: 'transparent',
      border: '1px solid rgba(201, 168, 76, 0.2)', borderRadius: 6,
      color: 'rgba(201,168,76,0.7)', fontFamily: "'Georgia', serif",
      fontSize: '0.82rem', letterSpacing: '0.06em', cursor: 'pointer',
    }}
  >
    {children}
  </motion.button>
)

const adminLabelStyle = { fontFamily: 'sans-serif', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginBottom: 8 }
const pageTitleStyle = { fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 400, color: '#e8c97a', letterSpacing: '0.02em' }
const dividerStyle = { height: 1, background: 'linear-gradient(90deg, rgba(201, 168, 76, 0.3), transparent)', marginTop: 14, marginBottom: 12 }
const hintstyle = { fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }