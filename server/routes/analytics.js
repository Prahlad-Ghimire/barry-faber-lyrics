import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const requireAdmin = (req, res, next) => {
    if (!req.session.adminAuth) return res.status(401).json({ message: 'Admin unauthorized' })
    next()
}

const requireUser = (req, res, next) => {
    if (!req.session.userAuth) return res.status(401).json({ message: 'Unauthorized' })
    next()
}

// called by frontend whenever a user clicks on a song
//  records the song title against the current session's analytics record


router.post('/track', requireUser, async (req, res) => {
    const { songId } = req.body
    const analyticsId = req.session.analyticsId

    if (!analyticsId || !songId) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try {
        const song = await prisma.song.findUnique({
            where: { id: songId },
            select: { title: true },
        })
        if (!song) return res.status(404).json({ message: 'Song not found' })

        //  append to songclicked array - only if not already tracked this session
        const record = await prisma.analytics.findUnique({
            where: { id: analyticsId },
        })
        if (!record) return res.status(404).json({ message: 'Analytics record not found' })

        if (!record.songsClicked.includes(song.title)) {
            await prisma.analytics.update({
                where: { id: analyticsId },
                data: {
                    songsClicked: { push: song.title }
                }
            })
        }
        return res.json({ success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// admin only - returns all analytics records
router.get('/', requireAdmin, async (req, res) => {
    try {
        const records = await prisma.analytics.findMany({
            orderBy: { dateAccessed: 'desc' },
        })
        return res.json(records)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

export default router