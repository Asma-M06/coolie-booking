import { motion } from 'framer-motion';

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon: Icon,
}) {
  const baseStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    borderRadius: '0.875rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    letterSpacing: '0.03em',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.25s ease',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    textDecoration: 'none',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
    },
    outline: {
      background: 'transparent',
      color: '#fb923c',
      border: '1.5px solid rgba(249,115,22,0.5)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--text-muted)',
      boxShadow: 'none',
    },
    gold: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
    },
  };

  const style = { ...baseStyle, ...variants[variant] };

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={style}
      whileHover={disabled ? {} : variant === 'primary' ? { scale: 1.03, boxShadow: '0 8px 30px rgba(249,115,22,0.55)' } : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className}
    >
      {/* Shimmer on primary */}
      {variant === 'primary' && !disabled && (
        <span style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          transform: 'skewX(-20deg)',
          animation: 'shimmer 2.5s infinite',
        }} />
      )}
      {Icon && <Icon size={16} />}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}