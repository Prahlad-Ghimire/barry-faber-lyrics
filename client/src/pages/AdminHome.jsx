// client/src/pages/AdminHome.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// ── Axios helper with credentials ─────────────────
// Dynamically construct absolute URL using the Vercel environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const api = (path, method = 'get', data) =>
  axios({ method, url: `${backendUrl}/api${path}`, data, withCredentials: true })

// ── Admin nav bar ──────────────────────────────────
function AdminNav({ navigate }) {
  const logout = () => {
    sessionStorage.removeItem('adminAuth')
    navigate('/admin/login')
  }

  return (
    <div style={{
      display: 'flex', gap: 10, flexWrap: 'wrap',
      marginBottom: 36, paddingBottom: 20,
      borderBottom: '1px solid rgba(201,168,76,0.1)',
    }}>
      {[
        { label: 'See Passwords', path: '/admin/passwords' },
        { label: 'Analytics', path: '/admin/analytics' },
        { label: 'Edit About', path: '/admin/about' },
      ].map(({ label, path }) => (
        <motion.button
          key={path}
          onClick={() => navigate(path)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={navBtnStyle}
        >
          {label}
        </motion.button>
      ))}
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{ ...navBtnStyle, borderColor: 'rgba(224,82,82,0.3)', color: 'rgba(224,82,82,0.7)' }}
      >
        Log Out
      </motion.button>
    </div>
  )
}

// ── Main component ─────────────────────────────────
export default function AdminHome() {
  const navigate = useNavigate()
  const [siteName, setSiteName] = useState('')
  const [siteNameInput, setSiteNameInput] = useState('')
  const [songs, setSongs] = useState(
    Array(50).fill('').map((_, i) => ({ slot: i + 1, title: '', _id: null, isActive: false }))
  )
  const [passwordInput, setPasswordInput] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  // ── Load config + songs on mount ──────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [configRes, songsRes] = await Promise.all([
          api('/config'),
          api('/songs/all'),
        ])

        setSiteName(configRes.data.siteName || '')
        setSiteNameInput(configRes.data.siteName || '')

        // Merge DB songs into the 50-slot grid
        const filled = Array(50).fill(null).map((_, i) => {
          const found = songsRes.data.find(s => s.order === i + 1)
          return found
            ? { slot: i + 1, title: found.title, _id: found.id, isActive: found.isActive }
            : { slot: i + 1, title: '', _id: null, isActive: false }
        })
        setSongs(filled)
      } catch (err) {
        console.error('Admin load error:', err.response?.status, err.response?.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Update site name ──────────────────────────────
  const updateSiteName = async () => {
    if (!siteNameInput.trim()) return
    try {
      await api('/config/sitename', 'put', { name: siteNameInput.trim() })
      setSiteName(siteNameInput.trim())
      showToast('Site name updated')
    } catch (err) {
      console.error('Site name error:', err.response?.status, err.response?.data)
      showToast('Failed to update site name')
    }
  }

  // ── Add a new song ────────────────────────────────
  const handleSongAdd = async (slot) => {
    const title = songs[slot - 1].title.trim()
    if (!title) return
    try {
      const res = await api('/songs', 'post', { title, order: slot })

      const newId = res.data.id
      setSongs(prev => prev.map(s =>
        s.slot === slot ? { ...s, _id: newId, isActive: false } : s
      ))
      showToast(`"${title}" added`)
      navigate(`/admin/song/${newId}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add song'
      showToast(msg)
      console.error('Add song error:', err.response?.status, err.response?.data)
    }
  }

  // ── Update a song title in local state ────────────
  const handleSongTitleChange = (slot, value) => {
    setSongs(prev => prev.map(s => s.slot === slot ? { ...s, title: value } : s))
  }

  // ── Add a new user password ───────────────────────
  const handleAddPassword = async () => {
    const pwd = passwordInput.trim()
    if (!pwd) return
    try {
      await api('/passwords', 'post', { password: pwd })
      setPasswordInput('')
      showToast('Password added')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add password'
      showToast(msg)
      console.error('Add password error:', err.response?.status, err.response?.data)
    }
  }

  // ── Render ────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: 'var(--dark)' }}
    >
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 760, margin: '0 auto',
        padding: '48px 24px 80px',
      }}>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 32 }}
        >
          <p style={adminLabelStyle}>Administrator Panel</p>
          <h1 style={pageTitleStyle}>{siteName || 'Admin Home'}</h1>
          <div style={dividerStyle} />
        </motion.div>

        <AdminNav navigate={navigate} />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 20, right: 20, zIndex: 100,
                background: 'rgba(18,18,26,0.95)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 8, padding: '10px 18px',
                color: '#e8c97a',
                fontFamily: "'Georgia', serif",
                fontSize: '0.85rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <Section label="Website name">
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={siteNameInput}
              onChange={e => setSiteNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && updateSiteName()}
              placeholder="e.g. BarryFaberLyrics.com"
              style={inputStyle}
            />
            <ActionBtn onClick={updateSiteName}>Enter</ActionBtn>
          </div>
          <p style={hintStyle}>
            Filling in name &amp; clicking Enter changes the name at the top of each page.
          </p>
        </Section>

        <Section label="Song titles">
          <p style={hintStyle}>
            Add up to 50 song titles. Click{' '}
            <strong style={{ color: '#c9a84c' }}>Add</strong>{' '}
            to open the lyrics editor for that song.
          </p>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Georgia', serif", fontSize: '0.85rem' }}>
              Loading...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {songs.map((song, i) => (
                <motion.div
                  key={song.slot}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.012, duration: 0.35 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{
                    width: 28, flexShrink: 0, textAlign: 'right',
                    fontFamily: 'sans-serif', fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.2)',
                  }}>
                    {song.slot}
                  </span>

                  <input
                    value={song.title}
                    onChange={e => handleSongTitleChange(song.slot, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !song._id) handleSongAdd(song.slot)
                    }}
                    placeholder={song._id ? '(saved)' : 'Song title...'}
                    disabled={!!song._id}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      opacity: song._id ? 0.55 : 1,
                      cursor: song._id ? 'default' : 'text',
                    }}
                  />

                  {song._id ? (
                    <ActionBtn onClick={() => navigate(`/admin/song/${song._id}`)}>
                      Edit Lyrics
                    </ActionBtn>
                  ) : (
                    <ActionBtn onClick={() => handleSongAdd(song.slot)}>
                      Add
                    </ActionBtn>
                  )}

                  {song._id && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: song.isActive ? '#4caf7d' : 'rgba(255,255,255,0.25)',
                      fontFamily: 'sans-serif',
                      minWidth: 56,
                      flexShrink: 0,
                    }}>
                      {song.isActive ? '● Active' : '○ Draft'}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        <Section label="Add password">
          <p style={hintStyle}>
            Typing in a password &amp; clicking Add creates a new password
            that allows access to the main site.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPassword()}
              placeholder="New access password"
              style={inputStyle}
            />
            <ActionBtn onClick={handleAddPassword}>Add</ActionBtn>
          </div>
        </Section>

      </div>
    </motion.div>
  )
}

function Section({ label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 44 }}
    >
      <h2 style={{
        fontFamily: "'Georgia', serif",
        fontSize: '1rem',
        fontWeight: 400,
        color: '#c9a84c',
        letterSpacing: '0.08em',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        {label}
      </h2>
      {children}
    </motion.div>
  )
}

function ActionBtn({ onClick, children, danger }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: '9px 18px',
        background: 'transparent',
        border: danger
          ? '1px solid rgba(224,82,82,0.4)'
          : '1px solid rgba(201,168,76,0.3)',
        borderRadius: 6,
        color: danger ? 'rgba(224,82,82,0.8)' : '#c9a84c',
        fontFamily: "'Georgia', serif",
        fontSize: '0.82rem',
        letterSpacing: '0.06em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </motion.button>
  )
}

const inputStyle = {
  padding: '9px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.18)',
  borderRadius: 6,
  color: '#fff',
  fontFamily: "'Georgia', serif",
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const navBtnStyle = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: 6,
  color: 'rgba(201,168,76,0.7)',
  fontFamily: "'Georgia', serif",
  fontSize: '0.82rem',
  letterSpacing: '0.06em',
  cursor: 'pointer',
}

const adminLabelStyle = {
  fontFamily: 'sans-serif',
  fontSize: '0.68rem',
  letterSpacing: '0.18em',
  color: 'rgba(201,168,76,0.4)',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const pageTitleStyle = {
  fontFamily: "'Georgia', serif",
  fontSize: '1.6rem',
  fontWeight: 400,
  color: '#e8c97a',
  letterSpacing: '0.02em',
}

const dividerStyle = {
  height: 1,
  background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)',
  marginTop: 14,
}

const hintStyle = {
  fontFamily: "'Georgia', serif",
  fontStyle: 'italic',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.3)',
  marginBottom: 14,
}