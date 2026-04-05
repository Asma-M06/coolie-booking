import { TrainFront } from 'lucide-react';
import { motion } from 'framer-motion';

// Replaces the basic custom SVG train with an ultra-fine, senior-level light sweep divider.
export default function TrainTrack({ className = '' }) {
  return (
    <div className={`train-track-container ${className}`} style={{ position: 'relative', height: '60px', width: '100%', overflow: 'hidden' }}>
      
      {/* ── Ultra-Fine Glowing Track Line ── */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.5) 15%, rgba(249, 115, 22, 0.8) 50%, rgba(249, 115, 22, 0.5) 85%, transparent 100%)',
        boxShadow: '0 0 10px rgba(249, 115, 22, 0.4)', transform: 'translateY(-50%)',
      }} />

      {/* ── Polished Route Nodes ── */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: `${15 + i * 11.6}%`,
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#0d1220', border: '1.5px solid rgba(249, 115, 22, 0.6)',
          transform: 'translate(-50%, -50%)', zIndex: 1,
        }} />
      ))}

      {/* ── Cinematic Train Sweep Animation ── */}
      <div style={{
        position: 'absolute', top: '50%', left: 0,
        animation: 'trainRide 16s linear infinite',
        willChange: 'transform',
        zIndex: 2,
        transform: 'translateY(-50%)', // Centered vertically on the line
      }}>
        {/* The locomotive element */}
        <div style={{
          position: 'relative', width: '56px', height: '56px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.9))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(249, 115, 22, 0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 25px rgba(249, 115, 22, 0.6)',
          marginTop: '-28px', // offset half the height cleanly 
        }}>
          {/* Intense center glow */}
          <div style={{ position: 'absolute', inset: -15, background: 'rgba(249, 115, 22, 0.3)', filter: 'blur(15px)', borderRadius: '50%' }} />
          
          <TrainFront size={28} color="#f97316" style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 1))', zIndex: 2 }} />

          {/* Light beam (Headlight sweeping forward) */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', width: '150px', height: '40px',
            background: 'linear-gradient(90deg, rgba(253, 224, 71, 0.4) 0%, transparent 100%)',
            transform: 'translateY(-50%)', filter: 'blur(8px)', pointerEvents: 'none',
            borderRadius: '50% 100% 100% 50%', zIndex: 1,
          }} />
        </div>
      </div>

    </div>
  );
}
