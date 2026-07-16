import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const requireAdmin = (req, res, next) => {
    if (!req.session.adminAuth) return res.status(401).json({ message: 'Admin unauthorized' })
    next()
}

// helper: get or create the single config record
async function getConfig() {
    let config = await prisma.siteConfig.findFirst()
    if (!config) {
        config = await prisma.siteConfig.create({
            data: {
                siteName: 'BarryFaberLyrics.com',
                aboutText: '',
                contactEmail: '',
            }
        })
    }
    return config
}

// public -- used by frontend to load site name, about text, email

router.get('/', async (req, res) => {
    try {
        const config = await getConfig()
        return res.json(config)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// public- lightweight, just the site name

router.get('/sitename', async (req, res) => {
    try {
        const config = await getConfig()
        return res.json({ name: config.siteName })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// admin only -- update the site name displayed on every page
router.put('/sitename', requireAdmin, async (req, res) => {
    const { name } = req.body
    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name required' })
    }
    try {
        const config = await getConfig()
        const updated = await prisma.siteConfig.update({
            where: { id: config.id },
            data: { siteName: name.trim() },
        })
        return res.json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server Error' })
    }
})

// Admin only-- update about text and contact email
router.put('/about', requireAdmin, async (req, res) => {
    const { aboutText, contactEmail } = req.body
    try {
        const config = await getConfig()
        const updated = await prisma.siteConfig.update({
            where: { id: config.id },
            data: {
                ...(aboutText !== undefined && { aboutText }),
                ...(contactEmail !== undefined && { contactEmail }),
            },
        })
        return res.json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})
export default router