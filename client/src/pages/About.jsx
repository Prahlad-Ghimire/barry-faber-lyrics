import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import { getSiteConfig } from "../api";

export default function About() {
  const navigate = useNavigate();

  const [config, setConfig] = useState({
    siteName: "BarryFaberLyrics.com",
    aboutText: "",
    contactEmail: "",
  });

  useEffect(() => {
    getSiteConfig()
      .then((res) => setConfig(res.data))
      .catch(() => { });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        minHeight: "100vh",
        background: "var(--dark)",
        position: "relative",
      }}
    >
      <ParticleBackground count={40} opacity={0.18} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 620,
          margin: "0 auto",
          padding: "64px 24px 100px",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 48 }}
        >
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              color: "rgba(201,168,76,0.5)",
              marginBottom: 14,
              textTransform: "uppercase",
            }}
          >
            {config.siteName}
          </p>

          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              height: 1,
              background: "linear-gradient(90deg, #c9a84c, transparent)",
              marginBottom: 18,
            }}
          />

          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              fontSize: "2rem",
              color: "#e8c97a",
              letterSpacing: "0.06em",
            }}
          >
            About
          </h1>
        </motion.div>

        {/* About text */}
        {config.aboutText ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "1.02rem",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.72)",
              marginBottom: 48,
              whiteSpace: "pre-wrap",
            }}
          >
            {config.aboutText}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 48,
            }}
          >
            About information coming soon.
          </motion.p>
        )}

        {/* Contact */}
        {config.contactEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginBottom: 52 }}
          >
            <div
              style={{
                height: 1,
                background: "rgba(201,168,76,0.12)",
                marginBottom: 28,
              }}
            />

            <p
              style={{
                fontFamily: "'Georgia', serif",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 8,
                fontSize: "0.88rem",
                fontStyle: "italic",
              }}
            >
              Contact
            </p>

            <p
              style={{
                fontFamily: "'Georgia', serif",
                color: "rgba(255,255,255,0.55)",
                marginBottom: 6,
                fontSize: "0.9rem",
              }}
            >
              Please email Barry Faber at
            </p>

            <a
              href={`mailto:${config.contactEmail}`}
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1rem",
                color: "#c9a84c",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                textDecorationColor: "rgba(201,168,76,0.35)",
              }}
            >
              {config.contactEmail}
            </a>
          </motion.div>
        )}

        {/* Return button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate("/home")}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 24px rgba(201,168,76,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "13px 36px",
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 8,
              color: "#c9a84c",
              fontFamily: "'Georgia', serif",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ← Return to Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}