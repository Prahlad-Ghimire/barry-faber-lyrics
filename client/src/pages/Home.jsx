// client/src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import ParticleBackground from '../components/ParticleBackground'
import useMouseParallax from '../hooks/useMouseParallax'
import { getSongs, getSiteConfig } from '../api'

function SongRow({ song, index, onClick }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.055, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(song)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '14px 0',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Hover shimmer */}
      <motion.div
        initial={{ x: '-110%' }}
        animate={{ x: hovered ? '110%' : '-110%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.07), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Index */}
      <span style={{
        fontFamily: 'sans-serif', fontSize: '0.72rem',
        color: hovered ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.18)',
        width: 28, flexShrink: 0, letterSpacing: '0.05em',
        transition: 'color 0.25s', userSelect: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <span style={{
        fontFamily: "'Georgia', serif", fontSize: '1.05rem',
        color: hovered ? '#e8c97a' : 'rgba(255,255,255,0.82)',
        letterSpacing: '0.02em', flex: 1,
        transition: 'color 0.25s',
      }}>
        {song.title}
      </span>

      {/* Arrow */}
      <motion.span
        animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ color: '#c9a84c', fontSize: '1rem', flexShrink: 0 }}
      >
        →
      </motion.span>
    </motion.div>
  )
}

export default function Home() {
  const [songs, setSongs] = useState([])
  const [siteName, setSiteName] = useState('BarryFaberLyrics.com')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const mouse = useMouseParallax(16)

  useEffect(() => {
    const load = async () => {
      try {
        const [songsRes, configRes] = await Promise.all([
          getSongs(),
          getSiteConfig(),
        ])
        setSongs(songsRes.data)
        if (configRes.data.siteName) setSiteName(configRes.data.siteName)
      } catch (err) {
        console.error('Home load error:', err.response?.status, err.response?.data)
        if (err.response?.status === 401) {
          // Session expired — send back to login
          sessionStorage.removeItem('userAuth')
          navigate('/')
        } else {
          setError('Could not load songs. Please refresh.')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const handleSongClick = (song) => {
    const id = song.id || song._id
    navigate(`/song/${id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45 }}
      style={{ minHeight: '100vh', background: 'var(--dark)', position: 'relative' }}
    >
      <ParticleBackground count={60} opacity={0.25} />

      {/* Parallax background */}
      <motion.div style={{
        position: 'fixed', inset: -60, zIndex: 0, pointerEvents: 'none',
        x: mouse.x * 0.4, y: mouse.y * 0.4,
      }}>
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)',
          top: '10%', left: '-10%',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,60,160,0.05) 0%, transparent 65%)',
          bottom: '5%', right: '0%',
        }} />
      </motion.div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 680, margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        {/* Header */}
        <header style={{
          paddingTop: 52, paddingBottom: 40,
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              width: 28, height: 1, background: '#c9a84c',
              marginBottom: 10, opacity: 0.7,
            }} />
            <h1 style={{
              fontFamily: "'Georgia', serif", fontSize: '1.45rem',
              fontWeight: 400, color: '#e8c97a',
              letterSpacing: '0.03em', lineHeight: 1.2,
            }}>
              {siteName}
            </h1>
          </motion.div>

          {/* About button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={() => navigate('/about')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: 4, background: 'transparent',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 6, color: 'rgba(201,168,76,0.8)',
              fontFamily: "'Georgia', serif", fontSize: '0.82rem',
              letterSpacing: '0.1em', padding: '7px 16px',
              cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.7)'
              e.currentTarget.style.color = '#e8c97a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
              e.currentTarget.style.color = 'rgba(201,168,76,0.8)'
            }}
          >
            ABOUT
          </motion.button>
        </header>

        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{
            fontFamily: "'Georgia', serif", fontStyle: 'italic',
            fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)',
            marginBottom: 8, paddingBottom: 16,
            borderBottom: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          Click any of the following song titles to see full lyrics
        </motion.p>

        {/* States: loading / error / empty / list */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              paddingTop: 60, textAlign: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: "'Georgia', serif", fontSize: '0.9rem',
              letterSpacing: '0.08em',
            }}
          >
            Loading...
          </motion.div>

        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              paddingTop: 60, textAlign: 'center',
              color: 'rgba(224,82,82,0.6)',
              fontFamily: "'Georgia', serif", fontSize: '0.9rem',
            }}
          >
            {error}
          </motion.div>

        ) : songs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              paddingTop: 60, textAlign: 'center',
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'Georgia', serif", fontSize: '0.9rem',
            }}
          >
            No songs added yet.
          </motion.div>

        ) : (
          <div>
            {songs.map((song, i) => (
              <SongRow
                key={song.id || song._id}
                song={song}
                index={i}
                onClick={handleSongClick}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}