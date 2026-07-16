import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import ParticleBackground from "../components/ParticleBackground";
import { getSong, trackSongClick } from "../api";


function parseLyrics(raw) {
  if (!raw) return []
  const lines = raw.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const match = line.match(/^\[(.+?)\]$/)
    if (match) {
      if (current) sections.push(current)
      current = { label: match[1], lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      if (!current) current = { label: '', lines: [] }
      current.lines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections.filter(s => s.lines.some(l => l.trim))
}

function LyricsSection({ section, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.88,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ marginBottom: 36 }}
    >
      {section.label && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.1, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ width: 16, height: 1, background: '#c9a84c', opacity: 0.6 }} />

          <span style={{
            fontFamily: 'sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: '#c9a84c',
            textTransform: 'uppercase',
            opacity: 0.75,
          }}>
            {section.label}
          </span>
        </motion.div>
      )}

      <div style={{
        fontFamily: "'Georgia, serif'",
        fontSize: '1.05rem',
        lineHeight: 1.9,
        color: 'rgba(255,255,255,0.78)',
      }}>
        {section.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{
              delay: index * 0.08 + i * 0.02 + 0.15,
              duration: 0.4,
            }}
            style={{
              minHeight: line.trim() ? undefined : 12,
              margin: 0,
            }}
          >
            {line || '\u00A0'}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

export default function SongLyrics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, -80])


  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSong(id)
        setSong(res.data)

        trackSongClick(id).catch(() => { })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])


  const sections = song ? parseLyrics(song.lyrics) : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45 }}
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        position: 'relative'
      }}
    >
      <ParticleBackground count={45} opacity={0.2} />


      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          y: bgY,
        }}
      >
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05)0%, transparent 70%)',
          top: '20%', right: '-15%',
        }} />
      </motion.div>

      <div ref={containerRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 620,
          margin: '0 auto',
          padding: '0 24px 120px',
        }}
      >
        {loading ? (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: "'Georgia', serif"
            }}
          >
            Loading...
          </div>
        ) : error ? (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Georgia', serif",
            }}>
              Song not found.
            </p>
            <button onClick={() => navigate('/home')} style={returnBtnStyle}>
              Return to Home
            </button>
          </div>
        ) : (
          <>
            <motion.header
              style={{ paddingTop: 64, paddingBottom: 48 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.16em',
                  color: 'rgba(201, 168, 76, 0.5)',
                  marginBottom: 18,
                  textTransform: 'uppercase',
                }}
              >
                Song Lyrics
              </motion.p>

              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, #c9a84c, transparent)',
                  marginBottom: 22,
                }}
              />
              <h1 style={{
                fontFamily: "'Georgia', serif",
                fontWeight: 400,
                fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
                color: '#e8c97a',
                letterSpacing: '0.02em',
                lineHeight: 1.25,
                marginBottom: 0
              }}>
                {song.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.07,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ display: 'inline-block', marginRight: '0.28em' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 0.36, 1] }}
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)',
                  marginTop: 24,
                }}
              />
            </motion.header>

            <div>
              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <LyricsSection key={i} section={section} index={i} />
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontFamily: "'Geogria', serif",
                    color: 'rgba(255,255,255,0.3)',
                    fontStyle: 'italic'
                  }}
                >
                  Lyrics Coming Soon.
                </motion.p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginTop: 64, textAlign: 'center' }}
            >
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.2), transparent)',
                marginBottom: 36,
              }} />
              <motion.button
                onClick={() => navigate('/home')}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 0 30px rgba(201, 168, 76, 0.18)'
                }}
                whileTap={{ scale: 0.97 }}
                style={returnBtnStyle}
              >
                Return to Home
              </motion.button>
            </motion.div>
          </>
        )}
      </div>

    </motion.div >
  )
}

const returnBtnStyle = {
  padding: '15px 44px',
  background: 'transparent',
  border: '1px solid rgba(201, 168, 76, 0.4)',
  borderRadius: 8,
  color: '#c9a84c',
  fontFamily: "'Georgia', serif",
  fontSize: '0.95rem',
  letterSpacing: '0.1em',
  cursor: 'pointer',
  transition: 'border-color 0.2s, color 0.2s'
}