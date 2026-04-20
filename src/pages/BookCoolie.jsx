import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Package, Clock, Users, ChevronRight, ChevronLeft, Train,
  Luggage, Navigation, CheckCircle, Info, Sparkles, Ticket, User, Phone, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import useStore from '../store/useStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import config from '../config/env';

const HERO_IMAGE = "/assets/train.jpg"; 

const STATIONS = [
  'Mumbai CSMT', 'Mumbai Central', 'Pune Junction', 'Lokmanya Tilak Terminal',
  'New Delhi', 'Howrah Junction', 'Chennai Central', 'Bengaluru City',
  'Hyderabad Deccan', 'Ahmedabad Junction',
];

const LUGGAGE_TYPES = [
  { id: 'small',  label: 'Small Bag',     desc: 'Handbags or small packs', icon: Package,  price: 30,  color: '#10b981' },
  { id: 'heavy',  label: 'Heavy Bag',     desc: 'Standard heavy luggage',  icon: Package,  price: 60,  color: '#f59e0b' },
  { id: 'large',  label: 'Suitcase/Box',  desc: 'Large items & Cartons',   icon: Luggage,  price: 100, color: '#f97316' },
];

const STEPS = [
  { label: 'Identity', icon: UserCheck },
  { label: 'Location', icon: Navigation },
  { label: 'Load', icon: Luggage },
  { label: 'Schedule', icon: Clock },
  { label: 'Confirm', icon: CheckCircle },
];

function SelectableCard({ selected, onClick, children }) {
  return (
    <motion.div 
      whileHover={{ scale: selected ? 1 : 1.02 }}
      onClick={onClick} 
      style={{
        borderRadius: '1.25rem', padding: '1rem',
        border: selected ? '2px solid rgba(249,115,22,0.8)' : '1px solid rgba(255,255,255,0.08)',
        background: selected ? 'rgba(249,115,22,0.1)' : 'rgba(15,23,42,0.6)',
        cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
      }}
    >
      {selected && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

export default function BookCoolie() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addBooking, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const coolieId = location.state?.coolieId;
  const coolieName = location.state?.coolieName;

  const [form, setForm] = useState({ 
    pnrNumber: '',
    passengerName: '',
    passengerPhone: '',
    station: '', 
    trainNumber: '', 
    platform: '', 
    luggageQuantities: { small: 0, heavy: 0, large: 0 }, 
    date: null, 
    time: null, 
    passengers: 1, 
    notes: '',
    coolieId: coolieId || null
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const canProceed = [
    form.pnrNumber.length === 10 && form.passengerName && form.passengerPhone.length === 10,
    form.station && form.platform,
    Object.values(form.luggageQuantities).some(q => q > 0),
    form.date && form.time,
    true,
  ][step];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const luggageSummary = Object.entries(form.luggageQuantities)
        .filter(([_, q]) => q > 0)
        .map(([k, q]) => `${q} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
        .join(', ');

      const totalFare = LUGGAGE_TYPES.reduce((acc, lt) => acc + (form.luggageQuantities[lt.id] || 0) * lt.price, 0);

      const res = await axios.post(`${config.apiBaseUrl}/bookings`, {
        ...form,
        luggageType: luggageSummary,
        totalFare,
        date: form.date?.toISOString().split('T')[0],
        time: form.time?.toLocaleTimeString([], { hour12: false })
      }, {
        withCredentials: true,
        timeout: config.apiTimeout,
      });
      addBooking(res.data.booking);
      await Swal.fire({
        icon: 'success',
        title: 'Booking Confirmed!',
        text: coolieName ? `Your request has been sent to ${coolieName}.` : 'Your coolie assignment is confirmed. Safe travels!',
        background: 'rgba(15, 23, 42, 0.95)', color: '#f8fafc', confirmButtonColor: '#10b981'
      });
      navigate('/booking-confirmation');
    } catch (err) {
      console.error('Booking failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'Something went wrong while processing your booking.',
        background: 'rgba(15, 23, 42, 0.95)', color: '#f8fafc', confirmButtonColor: '#ef4444'
      });
    } finally { setLoading(false); }
  };

  const labelStyle = { fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'block' };

  const slides = [
    /* ─ Step 0: Passenger Identity ─ */
    <div key="ident" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={labelStyle}>PNR Number (10 Digits)</label>
        <div style={{ position: 'relative' }}>
          <Ticket size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            value={form.pnrNumber} 
            onChange={(e) => update('pnrNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} 
            placeholder="Enter 10-digit PNR" 
            className="rail-input" 
            style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} 
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Full Name</label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            value={form.passengerName} 
            onChange={(e) => update('passengerName', e.target.value)} 
            placeholder="John Doe" 
            className="rail-input" 
            style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} 
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Phone Number</label>
        <div style={{ position: 'relative' }}>
          <Phone size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="tel" 
            value={form.passengerPhone} 
            onChange={(e) => update('passengerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} 
            placeholder="9876543210" 
            className="rail-input" 
            style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} 
          />
        </div>
      </div>
    </div>,

    /* ─ Step 1: Station ─ */
    <div key="0" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={labelStyle}>Railway Station</label>
        <div style={{ position: 'relative' }}>
          <MapPin size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <select value={form.station} onChange={(e) => update('station', e.target.value)} className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
            <option value="">Select your station…</option>
            {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Train Number or Name</label>
          <div style={{ position: 'relative' }}>
            <Train size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type="text" value={form.trainNumber} onChange={(e) => update('trainNumber', e.target.value)} autoComplete="off"
              placeholder="e.g. 12951" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Coach / Seat Point</label>
          <div style={{ position: 'relative' }}>
            <Navigation size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type="text" value={form.platform} onChange={(e) => update('platform', e.target.value)} autoComplete="off"
              placeholder="e.g. Coach B2" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Total Traveling Passengers</label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', width: '100%', padding: '0.375rem' }}>
          <button type="button" onClick={() => update('passengers', Math.max(1, form.passengers - 1))}
            style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            -
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
            <Users size={18} color="#fb923c" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '1.4rem' }}>{form.passengers}</span>
          </div>
          <button type="button" onClick={() => update('passengers', form.passengers + 1)}
            style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(249,115,22,0.2)', color: '#fb923c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            +
          </button>
        </div>
      </div>
    </div>,

    /* ─ Step 1: Luggage ─ */
    <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {LUGGAGE_TYPES.map((lt) => {
        const LIcon = lt.icon;
        const q = form.luggageQuantities[lt.id] || 0;
        return (
          <div key={lt.id} style={{
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: `${lt.color}15`, border: `1px solid ${lt.color}35`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LIcon size={22} color={lt.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>{lt.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.75rem' }}>₹{lt.price} each</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button 
                onClick={() => update('luggageQuantities', { ...form.luggageQuantities, [lt.id]: Math.max(0, q - 1) })}
                style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}
              >–</button>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: q > 0 ? '#f97316' : '#64748b', minWidth: '1.5rem', textAlign: 'center' }}>{q}</span>
              <button 
                onClick={() => update('luggageQuantities', { ...form.luggageQuantities, [lt.id]: q + 1 })}
                style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', border: 'none', background: 'rgba(249,115,22,0.2)', color: '#f97316', cursor: 'pointer' }}
              >+</button>
            </div>
          </div>
        );
      })}
    </div>,

    /* ─ Step 2: Timing ─ */
    <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Journey Date</label>
          <div style={{ position: 'relative' }}>
            <Clock size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 2 }} />
            <DatePicker
              selected={form.date}
              onChange={(date) => update('date', date)}
              minDate={new Date()}
              placeholderText="Select Date"
              autoComplete="off"
              customInput={<input className="rail-input" style={{ width: '100%', paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />}
              wrapperClassName="w-full"
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Arrival / Board Time</label>
          <div style={{ position: 'relative' }}>
            <Clock size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 2 }} />
            <DatePicker
              selected={form.time}
              onChange={(time) => update('time', time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select Time"
              autoComplete="off"
              customInput={<input className="rail-input" style={{ width: '100%', paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />}
              wrapperClassName="w-full"
            />
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Special Instructions for Coolie (Optional)</label>
        <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)}
          rows={3} placeholder="Need wheelchair assistance? Any fragile items?" className="rail-input" style={{ resize: 'none', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
      </div>
    </div>,

    /* ─ Step 3: Review ─ */
    <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { icon: Train,     label: 'Train / Platform',    value: `${form.trainNumber || 'TBD'} — ${form.platform || 'TBD'}`, color: '#f97316' },
          { 
            icon: Luggage,   
            label: 'Luggage Breakdown',    
            value: Object.entries(form.luggageQuantities)
              .filter(([_, q]) => q > 0)
              .map(([k, q]) => `${q} ${LUGGAGE_TYPES.find(l => l.id === k)?.label}`)
              .join(', ') || 'No bags selected', 
            color: '#f59e0b' 
          },
          { icon: Clock,     label: 'Schedule Slot',   value: form.date && form.time ? `${form.date.toLocaleDateString()} at ${form.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '—', color: '#10b981' },
          { icon: Users,     label: 'Passengers', value: `${form.passengers} passenger${form.passengers > 1 ? 's' : ''}`, color: '#6366f1' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', background: `${color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginTop: '0.125rem' }}>{value || '—'}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Price */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.05))',
        border: '1px solid rgba(249,115,22,0.3)', borderRadius: '1.5rem', padding: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Final Fare</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={14} color="#94a3b8" />
            <span style={{ fontFamily: 'var(--font-body)', color: '#cbd5e1', fontSize: '0.8rem' }}>Secure payment on arrival</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#f8fafc', textShadow: '0 4px 20px rgba(249,115,22,0.5)' }}>
          ₹{LUGGAGE_TYPES.reduce((acc, lt) => acc + (form.luggageQuantities[lt.id] || 0) * lt.price, 0)}
        </div>
      </div>
    </div>,
  ];

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: '#020617' }}>

        {/* ── LEFT: Cinematic Journey Backdrop ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="hidden md:flex flex-1">
          <motion.img 
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
            src={HERO_IMAGE} alt="Indian Railway Station Cinematic"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(249,115,22,0.1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, transparent 20%, #020617 120%)' }} />
          <div className="india-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%' }}
          >
            <div style={{ 
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Your luggage, <br/><span style={{ color: '#f97316' }}>Professionally Handled</span>.
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 300 }}>
                Join over millions of passengers who trust CoolieBook to make their railway transition seamless, secure, and completely dignified. Assured assistance from platform to coach.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: God-Level Booking Form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#020617', position: 'relative'
        }}>
          {/* Intense Glow Effects */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: '32rem', position: 'relative', zIndex: 10 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }}
                style={{ display: 'inline-flex', width: '70px', height: '70px', borderRadius: '22px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: '1px solid rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 20px 40px rgba(249,115,22,0.4), inset 0 0 20px rgba(255,255,255,0.2)' }}
              >
                <Train size={32} color="#ffffff" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Book Assistance
              </h1>
            </div>

            {/* Cinematic Step Track */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '2rem' }}>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'auto' }}>
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      ...(i < step ? { background: '#10b981', boxShadow: '0 0 20px rgba(16,185,129,0.5)' }
                        : i === step ? { background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 0 4px rgba(249,115,22,0.25), 0 0 20px rgba(249,115,22,0.4)' }
                        : { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }),
                    }}>
                      {i < step
                        ? <CheckCircle size={18} color="white" />
                        : <Icon size={16} color={i === step ? 'white' : '#64748b'} />}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: '2px', marginLeft: '0.375rem', borderRadius: '1px', background: i < step ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)', transition: 'background 0.4s' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Glowing Form Card */}
            <div style={{
              background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2rem',
              padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              position: 'relative', overflow: 'hidden'
            }}>
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                >
                  {slides[step]}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                {step > 0 && (
                  <AnimatedButton variant="outline" onClick={() => setStep(s => s - 1)} style={{ padding: '1rem 1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                    <ChevronLeft size={20} />
                  </AnimatedButton>
                )}
                {step < STEPS.length - 1 ? (
                  <AnimatedButton variant="primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed} icon={ChevronRight} style={{ flex: 1, padding: '1rem', fontSize: '1.05rem', borderRadius: '1rem' }}>
                    Proceed to {STEPS[step + 1].label}
                  </AnimatedButton>
                ) : (
                  <AnimatedButton variant="primary" onClick={handleSubmit} disabled={!canProceed || loading} icon={CheckCircle} style={{ flex: 1, padding: '1rem', fontSize: '1.05rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {loading ? 'Confirming...' : 'Confirm Booking'}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}