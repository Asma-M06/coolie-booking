import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserCheck, Settings, LogOut, 
  Menu, X, Bell, Search, ShieldCheck, PieChart, Train, Loader2
} from 'lucide-react';
import axios from 'axios';
import PageTransition from '../ui/PageTransition';
import config from '../../config/env';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/admin/profile`, { withCredentials: true });
        setAdmin(res.data.admin);
      } catch (err) {
        console.error('Admin auth failed:', err);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <Loader2 className="animate-spin" size={40} color="#10b981" />
      </div>
    );
  }

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = (config.apiBaseUrl || 'http://localhost:5005/api').replace('/api', '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Onboarding Queue', path: '/admin/coolie-requests', icon: UserCheck },
    { name: 'Coolie Registry', path: '/admin/coolie-list', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#f8fafc' }}>
      
      {/* ─── SIDEBAR ─── */}
      <motion.aside
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
        style={{
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15,23,42,0.4)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Branding Area */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 0 20px rgba(16,185,129,0.2)'
          }}>
            <ShieldCheck size={20} color="white" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: 0 }}>Command</h2>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800, letterSpacing: '0.1em' }}>Admin Control</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                borderRadius: '0.75rem', textDecoration: 'none', color: isActive ? '#fff' : '#64748b',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                transition: 'all 0.2s', position: 'relative'
              })}
            >
              <item.icon size={20} color={window.location.pathname === item.path ? '#10b981' : 'inherit'} />
              {isSidebarOpen && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.name}</span>}
              {isSidebarOpen && item.count && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', fontWeight: 800 }}>
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info / Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button 
            onClick={() => navigate('/admin/login')}
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
              borderRadius: '0.75rem', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer'
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* HEADER */}
        <header style={{
          height: '70px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', background: 'rgba(15,23,42,0.2)', backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ position: 'relative', display: 'none' }} className="md:block">
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="text" placeholder="Global Search..." style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '99px', padding: '0.5rem 1rem 0.5rem 2.8rem', color: '#fff', fontSize: '0.85rem', width: '300px', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', border: '2px solid #020617' }} />
            </div>
            <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }} className="hidden sm:block">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{admin?.username || 'Admin'}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{admin?.role || 'Administrator'}</div>
              </div>
              <img src={admin?.avatar_url ? config.getImageUrl(admin.avatar_url) : `https://ui-avatars.com/api/?name=${admin?.username}&background=0f172a&color=10b981`} alt="Admin" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* FOOTER */}
        <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '0.8rem' }}>
          <div>© 2026 Admin Command. Under Jurisdiction of Indian Railways.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Network: OK</span>
            <span>v1.0.4 - Canary</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
