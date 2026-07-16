import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const api = (path, method = 'get', data) => axios({ method, url: `/api${path}`, data, withCredentials: true })

export default function AdminAbout() {
    const navigate = useNavigate()
    const [aboutText, setAboutText] = useState('')
    const [email, setEmail] = useState('')
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

    useEffect(() => {
        api('/config')
            .then(res => {
                setAboutText(res.data.aboutText || '')
                setEmail(res.data.contactEmail || '')
            })
            .catch(() => { })
    }, [])

    const makeActive = async () => {
        setSaving(true)
        try {
            await api('/config/about', 'put', { aboutText, contactEmail: email })
            showToast('About page updated and now active')
        } catch {
            showToast('Failed to save')
        } finally {
            setSaving(false)
        }
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
                    animate={{ opacity: 1, Y: 0 }}
                    style={{ marginBottom: 32 }}
                >
                    <p style={labelStyle}>Admin - About Page</p>
                    <h1 style={titleStyle}>Edit about info</h1>
                    <div style={divider} />
                </motion.div>
                <NavBtn onClick={() => navigate('/admin')}>
                    Admin Home
                </NavBtn>
                <div style={{ marginTop: 32 }}>
                    <label style={{ ...labelStyle, display: 'block', marginBottom: 10 }}>About text</label>
                    <p style={hintStyle}>
                        Admin can type in text &amp; it will display on the About page once the Make Active button is clicked.
                        After the first time text is made active, active text will appear here and can be edited or replaced.
                    </p>
                    <textarea
                        value={aboutText}
                        onChange={e => setAboutText(e.target.value)}
                        placeholder="Write about information here..."
                        rows={12}
                        style={{
                            width: '100%', padding: '14px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(201,168,76,0.18)',
                            borderRadius: 10,
                            color: 'rgba(255,255,255,0.82)',
                            fontFamily: "'Georgia', serif",
                            fontSize: '0.95rem', lineHeight: 1.8,
                            outline: 'none', resize: 'vertical',
                            boxSizing: 'border-box', marginBottom: 28,
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.18)'}
                    />

                    <label style={{ ...labelStyle, display: 'block', marginBottom: 10 }}>Email Address</label>
                    <p style={hintStyle}>
                        Email address to be displayed on the About page. Can be entered or changed here.
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="contact@example.com"
                            style={{
                                flex: 1, padding: '10px 14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(201,168,76,0.18)',
                                borderRadius: 6,
                                color: '#ffff', fontFamily: "'Georgia', serif",
                                fontSize: '0.9rem', outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.18)'}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <motion.button
                            onClick={makeActive}
                            disabled={saving}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,168,76,0.2)' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '13px 30px',
                                background: 'linear-gradient(135deg, #c9a94c, #e8c97a)',
                                border: 'none', borderRadius: 8,
                                color: '#0a0a0f',
                                fontFamily: "'Georgia', serif",
                                fontSize: '0.9rem', fontWeight: 600,
                                letterSpacing: '0.08em',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? 'Saving...' : 'Make Active'}
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/admin')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '13px 22px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8, color: 'rgba(255,255,255,0.3)',
                                fontFamily: "'Georgia', serif", fontSize: '0.85rem',
                                cursor: 'pointer', letterSpacing: '0.06em',
                            }}
                        >
                            Return to Admin Home
                        </motion.button>
                    </div>
                </div>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{
                            position: 'fixed', top: 20, right: 20, zIndex: 100,
                            background: 'rgba(18,18,26,0.95)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: 8, padding: '10px 18px',
                            color: '#e8c97a', fontFamily: "'Georgia', serif", fontSize: '0.85rem',
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
    <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, color: 'rgba(201,168,76,0.7)', fontFamily: "'Georgia', serif", fontSize: '0.82rem', letterSpacing: '0.06em', cursor: 'pointer' }}>
        {children}
    </motion.button>
)
const labelStyle = { fontFamily: 'sans-serif', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginBottom: 8 }
const titleStyle = { fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 400, color: '#e8c97a', letterSpacing: '0.02em' }
const divider = { height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)', marginTop: 14, marginBottom: 12 }
const hintStyle = { fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }