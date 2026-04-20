import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Package, Clock, CheckCircle2, XCircle, 
  ChevronRight, Luggage, Star, Info, Wallet, Award, Bell, Train
} from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import StatusBadge from '../components/ui/StatusBadge';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import config from '../config/env';
import Swal from 'sweetalert2';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CoolieDashboard() {
  const { user, isAuthenticated } = useStore();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ todayEarnings: 0, avgRating: '0.0', tripsThisWeek: 0, cancellationRate: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/bookings/coolie-tasks`, { withCredentials: true });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Fetch coolie bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/bookings/coolie-stats`, { withCredentials: true });
      setStats(res.data.stats);
    } catch (err) {
      console.error('Fetch coolie stats error:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'coolie') {
      navigate('/dashboard');
      return;
    }
    fetchBookings();
    fetchStats();
  }, [isAuthenticated, navigate, user]);

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      await axios.patch(`${config.apiBaseUrl}/bookings/${id}/status`, { status }, { withCredentials: true });
      await Swal.fire({
        icon: 'success',
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#1e293b',
        color: '#fff'
      });
      fetchBookings();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Action Failed', text: err.response?.data?.message || 'Error updating status' });
    } finally {
      setLoading(false);
    }
  };

  const pending = bookings.filter(b => b.status === 'pending');
  const active = bookings.filter(b => b.status === 'accepted');

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem', background: '#020617', color: '#f8fafc' }}>
        
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', borderRadius: '4px', fontSize: '0.65rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Coolie Online</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>Namaste, <span style={{ color: '#f97316' }}>{user?.name?.split(' ')[0]}</span></h1>
              </div>
              <p style={{ color: '#64748b' }}>Manage your incoming requests and trip history.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={20} color="#94a3b8" />
              </div>
              <img src={config.getImageUrl(user?.avatar)} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #f97316' }} alt="Avatar" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {[
                  { label: 'Today Earnings', value: `₹${stats.todayEarnings.toLocaleString()}`, icon: Wallet, color: '#10b981' },
                  { label: 'Active Trips', value: active.length, icon: Train, color: '#3b82f6' },
                  { label: 'Rating', value: stats.avgRating, icon: Star, color: '#fcd34d' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(15,22,36,0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                       <s.icon size={16} color={s.color} />
                       <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Pending Requests */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <Bell size={18} color="#f97316" className="animate-pulse" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>New Requests ({pending.length})</h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pending.map(b => (
                    <motion.div key={b.id} variants={fadeUp} initial="initial" animate="animate" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.05), transparent)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Station Pickup</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{b.station}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{b.user_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.user_phone}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                        <div style={{ flex: 1 }}><span style={{ display: 'block', fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase' }}>Train</span><span style={{ fontWeight: 700 }}>{b.train_number || 'N/A'}</span></div>
                        <div style={{ flex: 1 }}><span style={{ display: 'block', fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase' }}>Platform</span><span style={{ fontWeight: 700 }}>{b.platform}</span></div>
                        <div style={{ flex: 1 }}><span style={{ display: 'block', fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase' }}>Luggage</span><span style={{ fontWeight: 700 }}>{b.luggage_type || b.luggageType}</span></div>
                        <div style={{ flex: 1 }}><span style={{ display: 'block', fontSize: '0.65rem', color: '#f97316', textTransform: 'uppercase' }}>Fare</span><span style={{ fontWeight: 800, color: '#f97316' }}>₹{b.total_fare ?? b.totalFare ?? 0}</span></div>
                      </div>

                      {/* Special Requirements Area */}
                      {(b.trolley_required || (b.extra_helpers > 0)) && (
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                          {b.trolley_required && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', fontWeight: 600 }}>
                              <Luggage size={12} /> Trolley Support
                            </span>
                          )}
                          {b.extra_helpers > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', fontWeight: 600 }}>
                              <Users size={12} /> {b.extra_helpers} Extra Helper(s)
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <AnimatedButton variant="primary" style={{ flex: 1 }} onClick={() => updateStatus(b.id, 'accepted')}>Accept Request</AnimatedButton>
                        <button onClick={() => updateStatus(b.id, 'rejected')} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <XCircle size={20} color="#ef4444" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {pending.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15,22,36,0.3)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '1.5rem', color: '#475569' }}>
                      Waiting for new requests...
                    </div>
                  )}
                </div>
              </section>

              {/* Active Jobs */}
              <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Assigned Trips</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {active.map(b => (
                    <div key={b.id} style={{ background: 'rgba(15,22,36,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Train size={20} color="#3b82f6" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{b.station} • Platform {b.platform}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {b.user_name} • {b.luggage_type || b.luggageType}
                            {b.trolley_required && <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>• Trolley Required</span>}
                            {b.extra_helpers > 0 && <span style={{ color: '#a855f7', marginLeft: '0.5rem' }}>• {b.extra_helpers} Helpers</span>}
                            <span style={{ color: '#10b981', fontWeight: 700, marginLeft: '0.5rem' }}>• ₹{b.total_fare ?? b.totalFare ?? 0}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <StatusBadge status="accepted" />
                        <button onClick={() => updateStatus(b.id, 'completed')} style={{ padding: '0.5rem 1rem', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Finish</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ background: 'linear-gradient(45deg, #1e293b, #0f172a)', borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Award size={40} color="#fcd34d" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Elite Coolie</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Maintain 4.8+ rating for bonus</p>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: '#fcd34d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 700, color: '#475569' }}>
                    <span>850 XP</span>
                    <span>1000 XP</span>
                  </div>
               </div>

               <div style={{ background: 'rgba(15,22,36,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.25rem' }}>Service Summary</h4>
                  {[
                    { label: 'Trips this week', value: stats.tripsThisWeek },
                    { label: 'Cancellation rate', value: `${stats.cancellationRate}%` },
                    { label: 'On-time arrival', value: '98%' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b' }}>{item.label}</span>
                      <span style={{ fontWeight: 700 }}>{item.value}</span>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
