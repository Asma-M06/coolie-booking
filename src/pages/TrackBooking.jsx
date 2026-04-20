import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Calendar, Ticket, MapPin, Phone, User, Clock, CheckCircle2, Luggage, Star, Info, ArrowRight } from 'lucide-react';
import axios from 'axios';
import config from '../config/env';
import StatusBadge from '../components/ui/StatusBadge';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import Swal from 'sweetalert2';

function BookingCard({ booking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(15,22,36,0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '2rem',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', background: 'rgba(249,115,22,0.1)', borderRadius: '10px' }}>
              <Train size={18} color="#f97316" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{booking.station}</h3>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {booking.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Ticket size={14} /> Platform {booking.platform || 'TBA'}</span>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Booking ID</div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{booking.id.split('-')[0].toUpperCase()}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>PNR Number</div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{booking.pnr_number}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Estimated Fare</div>
          <div style={{ fontWeight: 800, color: '#f97316', fontSize: '1.1rem' }}>₹{booking.total_fare}</div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: 'rgba(249,115,22,0.05)', borderRadius: '1.5rem', border: '1px solid rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <img 
          src={config.getImageUrl(booking.coolie_avatar) || `https://ui-avatars.com/api/?name=${booking.coolie_first_name}&background=0f172a&color=f97316`} 
          style={{ width: '56px', height: '56px', borderRadius: '1rem', objectFit: 'cover', border: '2px solid rgba(249,115,22,0.2)' }} 
          alt="Coolie" 
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.coolie_first_name} {booking.coolie_last_name}</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Professional Coolie Assistant</div>
        </div>
        <a href={`tel:${booking.coolie_phone}`} style={{ textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(249,115,22,0.3)' }}>
            <Phone size={20} color="white" />
          </div>
        </a>
      </div>
    </motion.div>
  );
}

export default function TrackBooking() {
  const [pnr, setPnr] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!pnr || !phone) return;
    
    setLoading(true);
    setBookings(null);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/bookings/track`, { pnr, phone });
      setBookings(res.data.bookings);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No Booking Found',
        text: err.response?.data?.message || 'Please check your PNR and Phone number.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem', background: '#020617', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Effects */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.02) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '24px', marginBottom: '1.5rem' }}
            >
              <Search size={32} color="#f97316" />
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Track Your <span style={{ color: '#f97316' }}>Coolie</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '30rem', margin: '0 auto' }}>
              Enter your PNR details to view real-time status and contact your assigned coolie.
            </p>
          </div>

          {/* Tracking Form */}
          {!bookings && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleTrack}
              style={{ 
                background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(20px)',
                padding: '2.5rem', borderRadius: '2.5rem', border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginLeft: '0.5rem' }}>PNR Number</label>
                  <div style={{ position: 'relative' }}>
                    <Ticket size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="text" 
                      placeholder="Enter 10-digit PNR"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rail-input"
                      style={{ paddingLeft: '3.5rem', background: 'rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginLeft: '0.5rem' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="tel" 
                      placeholder="Enter your registered phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rail-input"
                      style={{ paddingLeft: '3.5rem', background: 'rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </div>
              </div>

              <AnimatedButton 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={loading}
                icon={ArrowRight}
                style={{ height: '3.5rem', fontSize: '1.1rem', borderRadius: '1.25rem' }}
              >
                Track Now
              </AnimatedButton>
            </motion.form>
          )}

          {/* Results */}
          <AnimatePresence>
            {bookings && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Found {bookings.length} Booking(s)</h2>
                  <button 
                    onClick={() => setBookings(null)}
                    style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Track another PNR
                  </button>
                </div>
                {bookings.map(b => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <p style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.85rem' }}>
            Facing issues? Contact support at <span style={{ color: '#64748b' }}>support@cooliebook.com</span>
          </p>

        </div>
      </div>
    </PageTransition>
  );
}
