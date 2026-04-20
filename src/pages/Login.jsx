import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Train, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import useStore from '../store/useStore';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import config from '../config/env';

const BG_IMAGE = "/assets/login.png"
function InputField({ label, type, value, onChange, icon: Icon, placeholder }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#94a3b8' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="rail-input"
          style={{ paddingLeft: '3rem', paddingRight: isPassword ? '3rem' : '1.25rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();
  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/auth/login`, form, { 
        timeout: config.apiTimeout,
        withCredentials: true 
      });
      setUser(res.data.user);
      await Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'You have securely signed in to CoolieBook.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
        backdrop: 'rgba(0,0,0,0.8)'
      });
      navigate(res.data.user.role === 'coolie' ? '/coolie-dashboard' : '/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.response?.data?.message || 'Invalid credentials or server error.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
        backdrop: 'rgba(0,0,0,0.8)'
      });
    } finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: '#020617' }}>

        {/* ── LEFT: Breathtaking Cinematic Image Panel ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="hidden md:flex flex-1">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
            src={BG_IMAGE} alt="Indian Railway Cinematic Platform"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {/* Intense Cinematic Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(2,6,23,0.9) 0%, rgba(249,115,22,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, transparent 20%, #020617 120%)' }} />
          <div className="india-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          
          {/* Stunning Glass Quote Box */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%' }}
          >
            <div style={{ 
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(20px)' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
                  <Train size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '1.35rem', margin: 0, letterSpacing: '-0.02em' }}>CoolieBook</h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fb923c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Assistance</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 300 }}>
                "Since relying on CoolieBook, my family trips across India have become incredibly stress-free. The uniformed, verified coolies always arrive right at my coach."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80) center/cover', border: '2px solid rgba(249,115,22,0.5)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>Ananya Verma</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.8rem' }}>Frequent Rail Traveler </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: God-Level Form Panel ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#020617', position: 'relative'
        }}>
          {/* Dynamic Background Glows */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 10 }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <motion.div
                whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(249,115,22,0.1)' }}
              >
                <Sparkles size={28} color="#f97316" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.8))' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Partner Login
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                Securely sign in to your Coolie partner account
              </p>
            </div>

            {/* Glowing Form Card */}
            <div style={{
              background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.75rem',
              padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.05)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Premium Top Highlight */}
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.8), transparent)' }} />

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <InputField label="Email Address" type="email" value={form.email} onChange={update('email')} icon={Mail} placeholder="you@example.com" />
                <InputField label="Password" type="password" value={form.password} onChange={update('password')} icon={Lock} placeholder="••••••••" />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
                  <button type="button" style={{ fontSize: '0.8rem', color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    Forgot password?
                  </button>
                </div>

                <AnimatedButton type="submit" variant="primary" disabled={loading} icon={ArrowRight}
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '0.875rem', marginTop: '0.5rem' }}>
                  {loading ? 'Authenticating…' : 'Sign In'}
                </AnimatedButton>
              </form>

              {/* Seamless Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New to us?</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
              </div>

              <Link to="/coolie-register" style={{ textDecoration: 'none' }}>
                <button type="button" style={{
                  width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem',
                  color: '#f8fafc', fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  marginBottom: '1.5rem'
                }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <ShieldCheck size={18} color="#10b981" />
                  Apply as a Coolie Partner
                </button>
              </Link>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>
                  Are you a passenger?
                </p>
                <Link to="/track" style={{ textDecoration: 'none' }}>
                  <AnimatedButton variant="outline" style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}>
                    Track Your Booking
                  </AnimatedButton>
                </Link>
              </div>

              {/* Seamless Link to Admin Portal */}
              <div style={{ textAlign: 'center' }}>
                <Link to="/admin/login" style={{ 
                  fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', 
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' 
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  <ShieldCheck size={12} />
                  Access Admin Portal
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  );
}