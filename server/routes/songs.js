import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const requireUser = (req, res, next) => {
    if (!req.session.userAuth) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    next()
}

const requireAdmin = (req, res, next) => {
    if (!req.session.adminAuth) {
        return res.status(401).json({ message: 'Admin unauthorized' })
    }
    next()
}

// Public (user auth) — returns only active songs
router.get('/', requireUser, async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            select: { id: true, title: true, order: true },
        })
        return res.json(songs)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — returns all songs (active + drafts)
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            orderBy: { order: 'asc' }
        })
        return res.json(songs)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Returns a single song by id (user auth)
router.get('/:id', requireUser, async (req, res) => {
    try {
        const song = await prisma.song.findUnique({
            where: { id: req.params.id },
        })
        if (!song) return res.status(404).json({ message: 'Song not found' })
        return res.json(song)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — creates a new song slot
router.post('/', requireAdmin, async (req, res) => {
    const { title, order } = req.body
    if (!title || !order) {
        return res.status(400).json({ message: 'Title and order required' })
    }
    try {
        const song = await prisma.song.create({
            data: {
                title: title.trim(),
                order: Number(order),
                lyrics: '',
                isActive: false,
            }
        })
        return res.status(201).json(song)
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'That slot already has a song' })
        }
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — updates lyrics (and optionally title)
router.put('/:id', requireAdmin, async (req, res) => {
    const { lyrics, title } = req.body
    try {
        const song = await prisma.song.update({
            where: { id: req.params.id },
            data: {
                ...(lyrics !== undefined && { lyrics }),
                ...(title && { title: title.trim() }),
            },
        })
        return res.json(song)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — makes song visible on home page
router.put('/:id/activate', requireAdmin, async (req, res) => {
    try {
        const song = await prisma.song.update({
            where: { id: req.params.id },
            data: { isActive: true },
        })
        return res.json(song)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — hides song from home page
router.put('/:id/deactivate', requireAdmin, async (req, res) => {
    try {
        const song = await prisma.song.update({
            where: { id: req.params.id },
            data: { isActive: false }
        })
        return res.json(song)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only — permanently removes a song
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await prisma.song.delete({ where: { is: req.params.id } })
        return res.json({ success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})
export default router