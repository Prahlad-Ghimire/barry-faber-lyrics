import { Router } from 'express'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import prisma from '../lib/prisma.js'

const router = Router()

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { message: 'Too many login attempts, please try again after 15 minutes' }
})

router.post('/user', authLimiter, async (req, res) => {
    const { password } = req.body

    if (!password) {
        return res.status(400).json({ message: 'Password Required' })
    }
    try {
        const found = await prisma.password.findUnique({
            where: { value: password.trim() },
        })
        if (!found) {
            return res.status(401).json({ message: 'Invalid Password' })
        }

        req.session.userAuth = true
        req.session.passwordUsed = found.value

        req.session.sessionId = found.sessionId + '_' + Date.now()
        req.session.songsClicked = []

        await prisma.analytics.create({
            data: {
                passwordUsed: found.value,
                songsClicked: [],
            }
        })
        req.session.analyticsId = (await prisma.analytics.findFirst({
            where: { passwordUsed: found.value },
            orderBy: { dateAccessed: 'desc' },
        })).id

        return res.json({ success: true })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server Error' })
    }
})

router.post('/admin', authLimiter, (req, res) => {
    const { password } = req.body

    if (!password) {
        return res.status(400).json({ message: 'Password Required' })
    }

    try {
        const inputBuffer = Buffer.from(password.trim())
        const envBuffer = Buffer.from(process.env.ADMIN_PASSWORD)
        
        if (inputBuffer.length !== envBuffer.length || !crypto.timingSafeEqual(inputBuffer, envBuffer)) {
            return res.status(401).json({ message: 'Invalid Admin password' })
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Admin password' })
    }
    req.session.adminAuth = true
    return res.json({ success: true })
})

router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }))
})

export default router