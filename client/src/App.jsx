import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion'
import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import SongLyrics from "./pages/SongLyrics";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminAddLyrics from "./pages/AdminAddLyrics";
import AdminPasswords from "./pages/AdminPasswords";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAbout from "./pages/AdminAbout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* public */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* user protected */}
        <Route path="/home" element={
          <ProtectedRoute type="user"><Home /></ProtectedRoute>
        } />
        <Route path="/song/:id" element={
          <ProtectedRoute type="user"><SongLyrics /></ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute type="user" ><About /></ProtectedRoute>
        } />


        {/* Admin protected */}
        <Route path="/admin" element={
          <ProtectedRoute type="admin"><AdminHome /></ProtectedRoute>
        } />

        <Route path="/admin/song/:id" element={
          <ProtectedRoute type="admin"><AdminAddLyrics /></ProtectedRoute>
        } />

        <Route path="/admin/passwords" element={
          <ProtectedRoute type="admin"><AdminPasswords /></ProtectedRoute>
        } />

        <Route path="/admin/analytics" element={
          <ProtectedRoute type="admin"><AdminAnalytics /></ProtectedRoute>
        } />

        <Route path="/admin/about" element={
          <ProtectedRoute type="admin"><AdminAbout /></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}