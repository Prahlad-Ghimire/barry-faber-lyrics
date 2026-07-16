import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import axios from "axios";

const api = (path, method = 'get', data) => axios({ method, url: `/api${path}`, data, withCredentials: true })

export default function AdminAddLyrics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState(null)
  const [lyrics, setLyrics] = useState('')
  const [saving, setSaving] = useState(false)
  const [activating, setActivating] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    api(`/songs/${id}`)
      .then(res => {
        setSong(res.data)
        setLyrics(res.data.lyrics || '')
      })
      .catch(() => { })
  }, [id])


  const saveLyrics = async () => {
    setSaving(true)
    try {
      await api(`/songs/${id}`, 'put', { lyrics })
      showToast('Lyrics saved')
    } catch { showToast('Failed to save') }
    finally { setSaving(false) }
  }

  const makeActive = async () => {
    setActivating(true)
    try {
      await saveLyrics()
      await api(`/songs/${id}/activate`, 'put')
      setSong(prev => ({ ...prev, isActive: true }))
      showToast('Song is now active on home page')
    } catch { showToast('Failed to activate') }
    finally { setActivating(false) }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: 'var(--dark)' }}
    >
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 36 }}
        >
          <p style={adminLabelStyle}>Admin - Add Lyrics</p>
          <h1 style={pageTitleStyle}>
            {song ? song.title : 'Loading...'}
          </h1>
          <div style={dividerStyle} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(201, 168, 76, 0.05)',
            border: '1px solid rgba(201, 168, 76, 0.1)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
          }}
        >
          <p style={{
            fontFamily: 'sans-serif', fontSize: '0.75rem', color: 'rgba(201, 168, 76, 0.6)', margin: 0, lineHeight: 1.6
          }}>
            Format sections with square brackets: <code style={{ color: '#c9a84c' }}>[Verse 1]</code>, {''}
            <code style={{ color: '#c9a84c' }}>[Chorus]</code>, <code style={{ color: '#c9a84c' }}>[Bridge]</code>.
            Song Lyrics can be added by typing or using paste.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label style={{ display: 'block', ...adminLabelStyle, marginBottom: 10 }}>
            Add lyrics
          </label>

          <textarea
            value={lyrics}
            onChange={e => setLyrics(e.target.value)}
            placeholder={`[Verse 1]\nLine one of the verse\nLine two of the verse \n\n[Chorus]\nChorus line one\nChorus line two\n\n[Bridge]\nBridge lyrics here`}
            rows={22}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201, 168, 76, 0.18)',
              borderRadius: 10,
              color: 'rgba(255, 255, 255, 0.2)',
              fontFamily: "'Georgia', serif",
              fontSize: '0.95rem',
              lineHeight: 1.8,
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201, 168, 76, 0.45)'}
            onBlur={e => e.target.style.borderColor = 'rgba(201, 168, 76, 0.18)'}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 18,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <motion.button
            onClick={makeActive}
            disabled={activating}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
              border: 'none',
              borderRadius: 8,
              color: '#0a0a0f',
              fontFamily: "'Georgia', serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: activating ? 'not-allowed' : 'pointer',
              opacity: activating ? 0.7 : 1,
            }}
          >
            {activating ? 'Activating...' : 'Make Active'}
          </motion.button>
          <motion.button
            onClick={saveLyrics}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: 8,
              color: '#c9a84c',
              fontFamily: "'Georgia', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
              cursor: saving ? 'not allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </motion.button>
          {song && (
            <span style={{
              fontSize: '0.75rem',
              fontFamily: 'sans-serif',
              color: song.isActive ? '#4caf7d' : 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.06em'
            }}>
              {song.isActive ? '● Live on Home page' : '○ Not yet active'}
            </span>
          )}
          <div style={{ flex: 1 }} />
          <motion.button
            onClick={() => navigate('/admin')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              color: 'rgba(255, 255, 255, 0.35)',
              fontFamily: "'Georgia', serif",
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            Return to Admin Home
          </motion.button>
        </motion.div>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 20, right: 20,
              background: 'rgba(18, 18, 26, 0.95)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: 8, padding: '10px 18px',
              color: '#e8c97a', fontFamily: "'Georgia', serif", fontSize: '0.85rem',
              zIndex: 100
            }}
          >
            {toast}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
const adminLabelStyle = {
  fontFamily: 'sans-serif', fontSize: '0.68rem',
  letterSpacing: '0.18em', color: 'rgba(201, 168, 76, 0.4)',
  textTransform: 'uppercase', marginBottom: 8,
}
const pageTitleStyle = {
  fontFamily: "'Georgia', serif", fontSize: '1.5rem',
  fontWeight: 400, color: "#e8c97a", letterSpacing: '0.02em'
}
const dividerStyle = {
  height: 1,
  background: 'linear-gradient(90deg, rgba(201, 168, 76, 0.3), transparent)',
  marginTop: 14
}