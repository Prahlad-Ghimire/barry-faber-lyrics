import { motion } from 'framer-motion'
export default function PlaceholderPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#c9a84c', fontSize: '1.2rem'
      }}
    >
      Coming in next phase...
    </motion.div>
  )
}