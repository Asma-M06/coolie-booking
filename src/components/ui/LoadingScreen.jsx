import { motion, AnimatePresence } from 'framer-motion';
import { TrainFront } from 'lucide-react';

// Using an explicit train on tracks image instead of a bus
const TRAIN_IMG = 'https://images.unsplash.com/photo-1534431102715-db147db1f94d?w=1600&q=80';

export default function LoadingScreen({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#0d1220', overflow: 'hidden',
          }}
        >
          {/* ── Seamless Cinematic Train Background ── */}
          <motion.img
            src={TRAIN_IMG}
            alt="Cinematic Indian Train Backdrop"
            initial={{ scale: 1.15, filter: 'brightness(0.3) saturate(0.8)' }}
            animate={{ scale: 1, filter: 'brightness(0.5) saturate(1.2)' }}
            transition={{ duration: 6, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'
            }}
          />

          {/* Depth Overlays (No Cards/Boxes, just seamless gradients) */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 0%, #ffffff 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60vh', background: 'linear-gradient(to top, #02040a 0%, transparent 100%)' }} />

          {/* ── Borderless Floating Content ── */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '-10vh' }}>

            {/* Glowing Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              <div style={{
                position: 'relative', width: '80px', height: '80px',
                background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0))',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 0 20px rgba(249,115,22,0.5)',
              }}>
                <div style={{ position: 'absolute', inset: -20, background: 'rgba(249,115,22,0.6)', filter: 'blur(35px)', borderRadius: '50%', animation: 'glowPulse 3s infinite' }} />
                <TrainFront size={40} color="#f97316" style={{ filter: 'drop-shadow(0 0 10px rgba(249,115,22,0.8))' }} />
              </div>
            </motion.div>

            {/* Typography without boxes limits */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                color: '#f1f5fd', letterSpacing: '-0.02em', margin: 0,
                textShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(249,115,22,0.4)',
              }}
            >
              Coolie<span style={{ color: '#f97316', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.6))' }}>Book</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fb923c',
                letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '1rem',
                textShadow: '0 2px 10px rgba(0,0,0,1)',
              }}
            >
              Preparing your journey
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}> .</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}> .</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}> .</motion.span>
            </motion.div>
          </div>

          {/* ── Super Elegant Progress Track at the Bottom ── */}
          <div style={{ position: 'absolute', bottom: '15vh', left: '10vw', right: '10vw', zIndex: 10 }}>
            <div style={{ position: 'relative', width: '100%', height: '40px' }}>

              {/* The Track Line */}
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

              {/* Moving Progress Gradient Line */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'easeOut' }}
                style={{ position: 'absolute', bottom: '0', left: '0', height: '2px', background: 'linear-gradient(90deg, transparent, #f97316)', boxShadow: '0 0 15px #f97316' }}
              />

              {/* Elegant Train Icon driving across the screen */}
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 4, ease: 'easeOut' }}
                style={{ position: 'absolute', bottom: '2px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Simulated steam particle trail */}
                <motion.div
                  animate={{ y: [-5, -20, -40], opacity: [0.8, 0.4, 0], scale: [1, 1.5, 2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                  style={{ width: '6px', height: '6px', background: 'rgba(15,22,36,0.4)', borderRadius: '50%', position: 'absolute', top: '-10px', filter: 'blur(2px)' }}
                />

                <TrainFront size={24} color="#ffffff" style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,1))' }} />
              </motion.div>

            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}