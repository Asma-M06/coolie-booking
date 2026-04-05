import { User, Briefcase } from 'lucide-react';

// Replaces the basic stick-figure animation with an ultra-premium, cinematic floating glass badge
export default function CoolieRunner({ style = {}, delay = '0s', duration = '14s', className = '', isBackground = false }) {
  // We use CSS animations defined in index.css (like trainRide or coolieRun) 
  // but we apply it to a high-end UI element instead of an SVG drawing.
  
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: 0,
        animation: `coolieRun ${duration} linear ${delay} infinite`,
        willChange: 'transform',
        zIndex: isBackground ? 1 : 10,
        ...style,
        opacity: isBackground ? 0.4 : 1,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        borderRadius: '30px',
        padding: '0.5rem 1.25rem 0.5rem 0.6rem',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15), inset 0 0 10px rgba(249, 115, 22, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Trailing energy light inside the pill */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent)',
          animation: 'shimmer 2s infinite linear',
        }} />

        {/* Circular Avatar */}
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(249, 115, 22, 0.6)', zIndex: 1
        }}>
          <User size={16} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </div>

        {/* Text Details */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: '#f1f5fd', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            Verified Coolie
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fb923c', textTransform: 'uppercase' }}>
            <Briefcase size={10} /> Active Assist
          </span>
        </div>
      </div>
    </div>
  );
}
