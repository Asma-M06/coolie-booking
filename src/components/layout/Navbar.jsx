import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Menu, X, LogOut, Home, BookOpen, Users, LayoutDashboard, UserCircle } from 'lucide-react';
import useStore from '../../store/useStore';

const navLinks = [
  { label: 'Home',      to: '/',          icon: Home },
  { label: 'Book',      to: '/book',      icon: BookOpen },
  { label: 'Coolies',   to: '/coolies',   icon: Users },
  { label: 'Track',     to: '/track',     icon: LayoutDashboard },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useStore();
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  /* ── Styles ── */
  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    transition: 'all 0.35s ease',
    ...(scrolled ? {
      background: 'rgba(15,22,36,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(249,115,22,0.14)',
      boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
    } : {
      background: 'linear-gradient(to bottom, rgba(15,22,36,0.85) 0%, transparent 100%)',
    }),
  };

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.625rem',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    textDecoration: 'none',
    color: active ? '#fb923c' : '#94a3b8',
    background: active ? 'rgba(249,115,22,0.1)' : 'transparent',
    border: active ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  });

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={navStyle}
      >
        {/* India accent stripe */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #FF9933 33.33%, rgba(255,255,255,0.15) 33.33% 66.66%, #138808 66.66%)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '66px' }}>

            {/* ── Logo ── */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              <motion.div
                whileHover={{ rotate: 20, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{
                  width: '38px', height: '38px',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(249,115,22,0.45)',
                  flexShrink: 0,
                }}
              >
                <Train size={18} color="white" />
              </motion.div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#f1f5fd' }}>
                Coolie<span style={{ color: '#f97316' }}>Book</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links (always visible) ── */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} aria-label="Main navigation">
              {navLinks.filter(link => {
                if (!user) return ['/', '/book', '/coolies', '/track'].includes(link.to);
                if (user.role === 'coolie') return ['/', '/coolies', '/coolie-dashboard'].includes(link.to);
                return ['/', '/book', '/coolies', '/track'].includes(link.to);
              }).map(({ label, to, icon: Icon }) => {
                const finalTo = (user?.role === 'coolie' && to === '/track') ? '/coolie-dashboard' : to;
                const finalLabel = (user?.role === 'coolie' && label === 'Track') ? 'My Tasks' : label;
                
                return (
                  <Link key={to} to={finalTo} style={linkStyle(isActive(finalTo))}
                    onMouseEnter={(e) => { if (!isActive(finalTo)) { e.currentTarget.style.color = '#f1f5fd'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={(e) => { if (!isActive(finalTo)) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon size={14} />
                    <span>{finalLabel}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Auth Buttons ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <UserCircle size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: '#f1f5fd', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                    </span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      fontSize: '0.8rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/track" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 6px 25px rgba(249,115,22,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: 'rgba(249,115,22,0.1)',
                        color: '#f97316', border: '1px solid rgba(249,115,22,0.2)', 
                        borderRadius: '0.75rem', padding: '0.5rem 1.1rem', fontSize: '0.875rem',
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      Track Booking
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile overlay not needed since nav is always visible ── */}
    </>
  );
}