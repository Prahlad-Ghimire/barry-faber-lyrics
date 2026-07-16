import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import songRoutes from './routes/songs.js'
import passwordRoutes from './routes/passwords.js'
import configRoutes from './routes/config.js'
import analyticsRoutes from './routes/analytics.js'


const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again later.' }
})
app.use('/api', limiter)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8
    }
}))

app.use('/api/auth', authRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/passwords', passwordRoutes)
app.use('/api/config', configRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})