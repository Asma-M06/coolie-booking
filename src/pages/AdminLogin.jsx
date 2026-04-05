import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PageTransition from '../components/ui/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import config from '../config/env';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/admin/login`, { email, password }, {
        withCredentials: true
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Access Granted',
        text: 'Welcome back, Commander.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#10b981',
        timer: 1500,
        showConfirmButton: false
      });

      // Simple delay for effect
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: err.response?.data?.message || 'Invalid administrative credentials.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: '#020617', padding: '2rem', position: 'relative', overflow: 'hidden' 
      }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '24rem', zIndex: 10 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              display: 'inline-flex', width: '64px', height: '64px', background: 'rgba(16,185,129,0.1)', 
              border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', alignItems: 'center', 
              justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.1)'
            }}>
              <ShieldCheck size={32} color="#10b981" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
              Command Center
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Restricted administrative access only
            </p>
          </div>

          <div style={{ 
            background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(30px)', 
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', 
            padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' 
          }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Admin Email</label>
                <div className="relative">
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cooliebook.in" 
                    className="rail-input" style={{ paddingLeft: '2.75rem', height: '3.25rem' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>System Password</label>
                <div className="relative">
                  <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="rail-input" style={{ paddingLeft: '2.75rem', height: '3.25rem' }} 
                  />
                </div>
              </div>

              <AnimatedButton
                type="submit" variant="primary" disabled={loading}
                icon={loading ? Loader2 : ArrowRight}
                style={{ 
                  marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.2)'
                }}
              >
                {loading ? 'Verifying...' : 'Authorize Login'}
              </AnimatedButton>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#475569' }}>
              Unauthorized access attempts are logged and reported.
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
