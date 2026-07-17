import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

router.post('/songs', async (req, res) => {
    try {
        const { title, order, lyrics } = req.body;
        const newSong = await prisma.song.create({
            data: {
                title,
                order: parseInt(order, 10),
                lyrics: lyrics || "",
                slug: slugify(title),
            },
        });
        res.status(201).json(newSong);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/songs/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const song = await prisma.song.findUnique({
            where: { slug: slug },
        });
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;