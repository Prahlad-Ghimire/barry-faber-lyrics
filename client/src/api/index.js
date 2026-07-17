// client/src/api/index.js
import axios from 'axios'

// Standardize the environment variable and ensure it appends /api correctly
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`,
    withCredentials: true,
})

// ── User-facing ────────────────────────────────────
export const getSongs = () => api.get('/songs')
export const getSong = (id) => api.get(`/songs/${id}`)
export const getSiteConfig = () => api.get('/config')
export const getSiteName = () => api.get('/config/sitename')
export const trackSongClick = (songId) => api.post('/analytics/track', { songId })

// ── Admin ──────────────────────────────────────────
export const getAllSongs = () => api.get('/songs/all')
export const createSong = (title, order) => api.post('/songs', { title, order })
export const updateSong = (id, data) => api.put(`/songs/${id}`, data)
export const activateSong = (id) => api.put(`/songs/${id}/activate`)
export const deactivateSong = (id) => api.put(`/songs/${id}/deactivate`)
export const deleteSong = (id) => api.delete(`/songs/${id}`)

export const getPasswords = () => api.get('/passwords')
export const addPassword = (password) => api.post('/passwords', { password })
export const deletePassword = (id) => api.delete(`/passwords/${id}`)

export const updateSiteName = (name) =>
    api.put('/config/sitename', { name })

export const updateAbout = (aboutText, contactEmail) =>
    api.put('/config/about', { aboutText, contactEmail })

export const getAnalytics = () => api.get('/analytics')