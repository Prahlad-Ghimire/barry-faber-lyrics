import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

const requireAdmin = (req, res, next) => {
    if (!req.session.adminAuth) return res.status(401).json({ message: 'Admin unauthorized' })
    next()
}

// admin only - list all passwords
router.get('/', requireAdmin, async (req, res) => {
    try {
        const passwords = await prisma.password.findMany({
            orderBy: { createdAt: 'asc' }
        })
        return res.json(passwords)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// adminonly add a new access password

router.post('/', requireAdmin, async (req, res) => {
    const { password } = req.body
    if (!password || !password.trim()) {
        return res.status(400).json({ message: 'Password value required' })
    }
    try {
        const count = await prisma.password.count()
        if (count >= 50) {
            return res.status(400).json({ message: 'Maximum 50 passwords reached' })
        }
        const newPwd = await prisma.password.create({
            data: { value: password.trim() },
        })
        return res.status(201).json(newPwd)
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'That password already exists' })
        }
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

// Admin only -- delete a password
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await prisma.password.delete({ where: { id: req.params.id } })
        return res.json({ success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
})

export default router