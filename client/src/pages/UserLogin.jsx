// client/src/pages/UserLogin.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// --- Particle system ---
function useParticles(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let particles = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        class Particle {
            constructor() { this.reset() }
            reset() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 1.5 + 0.3
                this.speedX = (Math.random() - 0.5) * 0.4
                this.speedY = (Math.random() - 0.5) * 0.4
                this.opacity = Math.random() * 0.5 + 0.1
                this.pulse = Math.random() * Math.PI * 2
            }
            update() {
                this.x += this.speedX
                this.y += this.speedY
                this.pulse += 0.01
                this.opacity = 0.1 + Math.abs(Math.sin(this.pulse)) * 0.4
                if (this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height) this.reset()
            }
            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`
                ctx.fill()
            }
        }

        for (let i = 0; i < 120; i++) particles.push(new Particle())

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // Draw connections
            particles.forEach((p, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p.x - p2.x, dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 100) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `rgba(201, 168, 76, ${0.08 * (1 - dist / 100)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
                p.update()
                p.draw()
            })
            animId = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [canvasRef])
}

// --- Morphing blob background ---
function MorphBlob({ style, duration = 8, delay = 0 }) {
    return (
        <motion.div
            style={style}
            animate={{
                borderRadius: [
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                    '30% 60% 70% 40% / 50% 60% 30% 60%',
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                ],
                scale: [1, 1.08, 1],
                rotate: [0, 8, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    )
}

// --- Mouse parallax ---
function useMouseParallax() {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const handler = (e) => {
            setPos({
                x: (e.clientX / window.innerWidth - 0.5) * 30,
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            })
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])
    return pos
}

export default function UserLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [siteName, setSiteName] = useState('BarryFaberLyrics.com')
    const canvasRef = useRef(null)
    const navigate = useNavigate()
    const mouse = useMouseParallax()

    useParticles(canvasRef)

    // Fetch site name from backend
    useEffect(() => {
        axios.get('/api/config/sitename')
            .then(res => { if (res.data.name) setSiteName(res.data.name) })
            .catch(() => { }) // use default if offline
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!password.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await axios.post('/api/auth/user', { password })
            if (res.data.success) {
                sessionStorage.setItem('userAuth', 'true')
                navigate('/home')
            }
        } catch {
            setError('Incorrect password. Please try again.')
            setPassword('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--dark)' }}>

            {/* Particle canvas */}
            <canvas ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 0 }} />

            {/* Morphing blobs */}
            <MorphBlob
                duration={10}
                delay={0}
                style={{
                    position: 'absolute', width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
                    top: '-10%', left: '-10%', zIndex: 0,
                }}
            />
            <MorphBlob
                duration={12}
                delay={3}
                style={{
                    position: 'absolute', width: 600, height: 600,
                    background: 'radial-gradient(circle, rgba(100,80,200,0.06) 0%, transparent 70%)',
                    bottom: '-15%', right: '-10%', zIndex: 0,
                }}
            />

            {/* Main card — parallax on mouse */}
            <motion.div
                style={{ zIndex: 1, x: mouse.x * 0.3, y: mouse.y * 0.3 }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md mx-4"
            >
                {/* Card border glow */}
                <div style={{
                    position: 'absolute', inset: -1,
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.3), transparent 50%, rgba(201,168,76,0.1))',
                    borderRadius: 20, zIndex: -1,
                }} />

                <div style={{
                    background: 'rgba(18,18,26,0.85)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: 18,
                    border: '1px solid rgba(201,168,76,0.15)',
                    padding: '52px 44px',
                }}>

                    {/* Site title — stagger reveal */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-10"
                    >
                        {/* Decorative line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
                            style={{
                                height: 1,
                                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                                marginBottom: 20,
                            }}
                        />
                        <h1 style={{
                            fontFamily: "'Georgia', serif",
                            fontSize: '1.7rem',
                            fontWeight: 400,
                            color: '#e8c97a',
                            letterSpacing: '0.04em',
                            lineHeight: 1.3,
                        }}>
                            {siteName}
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                            style={{
                                height: 1,
                                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                                marginTop: 20,
                            }}
                        />
                    </motion.div>

                    {/* Instruction */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        style={{
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: 28,
                            fontFamily: "'Georgia', serif",
                            fontStyle: 'italic',
                        }}
                    >
                        To enter site, please enter your password &amp; press Enter
                    </motion.p>

                    {/* Password form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div style={{ position: 'relative', marginBottom: 8 }}>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(201,168,76,0.25)',
                                    borderRadius: 10,
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontFamily: "'Georgia', serif",
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    letterSpacing: '0.15em',
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = 'rgba(201,168,76,0.6)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)'
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(201,168,76,0.25)'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        color: '#e05252',
                                        fontSize: '0.82rem',
                                        marginBottom: 12,
                                        textAlign: 'center',
                                        fontFamily: "'Georgia', serif",
                                    }}
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Enter button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(201,168,76,0.25)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                width: '100%',
                                padding: '13px',
                                marginTop: 6,
                                background: loading
                                    ? 'rgba(201,168,76,0.3)'
                                    : 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                                border: 'none',
                                borderRadius: 10,
                                color: '#0a0a0f',
                                fontSize: '0.95rem',
                                fontFamily: "'Georgia', serif",
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? '...' : 'ENTER'}
                        </motion.button>
                    </motion.form>

                    {/* Admin link — subtle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                        className="text-center"
                        style={{ marginTop: 32 }}
                    >
                        <a
                            href="/admin/login"
                            style={{
                                fontSize: '0.72rem',
                                color: 'rgba(255,255,255,0.2)',
                                textDecoration: 'none',
                                letterSpacing: '0.08em',
                                fontFamily: 'sans-serif',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}
                        >
                            Administrator Log-In
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}