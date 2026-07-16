import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'

import authRoutes from './routes/auth.js'
import songRoutes from './routes/songs.js'
import passwordRoutes from './routes/passwords.js'
import configRoutes from './routes/config.js'
import analyticsRoutes from './routes/analytics.js'

const app = express()
const PORT = process.env.PORT || 5000
const PgSession = connectPgSimple(session)

app.set('trust proxy', 1)

app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            'http://localhost:5173',
            process.env.FRONTEND_URL,
        ].filter(Boolean)
        if (!origin || allowed.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}))

app.use(express.json())

app.use(session({
    store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,   // ← auto creates session table in Supabase
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 8,
    },
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
    console.log(`✓ Server running on http://localhost:${PORT}`)
})