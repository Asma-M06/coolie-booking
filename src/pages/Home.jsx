import { useRef, Suspense, lazy, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config/env';
import useStore from '../store/useStore';
import {
  ArrowRight, Clock, Shield, Users, Star, Train, MapPin,
  CheckCircle, TrendingUp, Award, Zap, ChevronRight, Phone,
  Luggage, UserCheck, Navigation, Sparkles, Ticket, Search
} from 'lucide-react';
import { useDevice } from '../hooks/useDevice';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import TrainTrack from '../components/ui/TrainTrack';
import CoolieRunner from '../components/ui/CoolieRunner';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

/* ── Public Assets — use absolute paths ── */
const IMAGES = {
  hero: '/assets/hero_train.png',
  station: '/assets/station.jpg',
  coolie1: '/assets/coolie1.jpg',
  coolie2: '/assets/coolie2.jpg',
  coolie3: '/assets/coolie3.jpg',
  coolie4: '/assets/coolie4.jpg',
  luggage: '/assets/luggage.jpg',
  platform: '/assets/platform.jpg'
};

function FadeIn({ children, delay = 0, style = {}, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style} className={className}
    >{children}</motion.div>
  );
}

/* ─── Stats ─── */
const stats = [
  { value: '50K+',  label: 'Happy Travelers',   icon: Users,     color: '#f97316' },
  { value: '200+',  label: 'Railway Stations',   icon: MapPin,    color: '#f59e0b' },
  { value: '2000+', label: 'Certified Coolies',  icon: UserCheck, color: '#10b981' },
  { value: '4.9',   label: 'Average Rating',     icon: Star,      color: '#6366f1' },
];

/* ─── Features ─── */
const features = [
  {
    icon: Clock, title: 'Book Anytime',
    desc: 'Available 24/7 — 365 days a year. No waiting in queues. Confirm in 60 seconds.',
    color: '#f97316',
    bg: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&q=60',
  },
  {
    icon: Shield, title: 'Verified Coolies',
    desc: 'Background-checked, uniformed coolies with official government ID cards.',
    color: '#f59e0b',
    bg: null,
  },
  {
    icon: Users, title: 'For Everyone',
    desc: 'Specially designed for elderly, differently-abled, and first-time travelers.',
    color: '#10b981',
    bg: null,
  },
  {
    icon: Star, title: 'Rated & Reviewed',
    desc: 'Real reviews from real travelers after every single booking journey.',
    color: '#6366f1',
    bg: null,
  },
];

/* ─── How it works (Updated for zero-login) ─── */
const steps = [
  { n: '01', icon: Ticket,       title: 'Enter PNR', desc: 'Enter your 10-digit PNR for journey details', color: '#f97316' },
  { n: '02', icon: Navigation,  title: 'Choose Station', desc: 'Select your railway station & platform', color: '#f59e0b' },
  { n: '03', icon: Luggage,     title: 'Pick Partner', desc: 'Pick an available coolie for your luggage', color: '#10b981' },
  { n: '04', icon: CheckCircle, title: 'Travel Stress-free', desc: 'Coolie meets you at the exact platform', color: '#6366f1' },
];

/* ─── Coolies ─── */
const coolies = [
  { name: 'Raju Sharma',  station: 'Mumbai CSMT',     rating: 4.9, trips: 1200, img: IMAGES.coolie1, speciality: 'Heavy luggage', available: true },
  { name: 'Mohan Verma',  station: 'Pune Junction',   rating: 4.7, trips: 850,  img: IMAGES.coolie2, speciality: 'Elderly assist', available: true },
  { name: 'Ajay Kumar',   station: 'Howrah Junction', rating: 4.9, trips: 3200, img: IMAGES.coolie3, speciality: 'Disabled assist', available: true },
];

const stationNames = ['Mumbai CSMT', 'New Delhi', 'Howrah Junction', 'Chennai Central', 'Bengaluru City',
  'Pune Junction', 'Ahmedabad Junction', 'Hyderabad Deccan', 'Kolkata Chitpur', 'Jaipur Junction'];

export default function Home() {
  const { canRender3D } = useDevice();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { user } = useStore();
  const [activeCoolies, setActiveCoolies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoolies = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/coolies/approved`);
        // Show only first 3 for home page layout
        setActiveCoolies(res.data.coolies.slice(0, 3));
      } catch (err) {
        console.error('Error fetching coolies for home page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoolies();
  }, []);

  return (
    <PageTransition>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Hero background image with parallax */}
        <motion.div style={{ position: 'absolute', inset: 0, y: heroY }}>
          <img
            src={IMAGES.hero}
            alt="Indian train at railway station"
            style={{
              width: '100%', height: '110%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.35) saturate(1.1)',
              animation: 'heroImageKen 20s ease-in-out alternate infinite',
            }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,22,36,0.95) 0%, rgba(15,22,36,0.6) 50%, rgba(255,255,255,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,22,36,1) 0%, transparent 40%)' }} />

        {/* Floating particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute',
              left: `${6 + i * 6}%`, top: `${12 + (i % 6) * 14}%`,
              width: i % 3 === 0 ? '5px' : '2px', height: i % 3 === 0 ? '5px' : '2px',
              borderRadius: '50%',
              background: i % 2 === 0 ? 'rgba(249,115,22,0.7)' : 'rgba(245,158,11,0.5)',
              pointerEvents: 'none',
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Content */}
        <motion.div
          style={{ position: 'relative', zIndex: 5, maxWidth: '80rem', margin: '0 auto', padding: '6rem 2rem 8rem', width: '100%', opacity: heroOpacity }}
        >
          <div style={{ maxWidth: '42rem' }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.35)',
                borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.75rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: '#fb923c', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              <motion.span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}
                animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Train size={12} /> Now Live — Indian Railways
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                color: '#f1f5fd', lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '1.5rem',
              }}
            >
              Carry Less,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #fb923c, #fcd34d)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'block',
              }}>
                Travel More.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                maxWidth: '38rem', lineHeight: 1.75, marginBottom: '2.5rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              Book a certified coolie at your railway station in seconds.
              Available 24/7 — for tourists, elderly, and differently-abled travelers.
            </motion.p>

            {/* Enhanced PNR Booking Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                background: 'rgba(15,23,42,0.6)',
                backdropFilter: 'blur(30px)',
                padding: '2rem',
                borderRadius: '2rem',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                marginBottom: '3rem',
                maxWidth: '38rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#fb923c', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Start your journey</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Ticket size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="text" 
                      placeholder="Enter 10-digit PNR Number"
                      style={{
                        width: '100%', height: '3.5rem', background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem',
                        padding: '0 1rem 0 3.25rem', color: '#fff', fontSize: '1rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>
                  <Link to="/book" style={{ textDecoration: 'none' }}>
                    <AnimatedButton variant="primary" icon={ArrowRight} style={{ height: '3.5rem', padding: '0 2rem', borderRadius: '1rem' }}>
                      Book Now
                    </AnimatedButton>
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <Link to="/track" style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Search size={14} /> Track Existing Booking
                  </Link>
                  <Link to="/coolies" style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} /> Browse Partners
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}
            >
              {[
                { icon: Shield,      text: 'Secure Booking' },
                { icon: UserCheck,   text: 'Verified Coolies' },
                { icon: TrendingUp,  text: '4.9 Rated' },
                { icon: Zap,         text: 'Instant Confirmation' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
                  <Icon size={14} color="#f97316" /> {text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Coolie runner + train at bottom */}
        <div style={{ position: 'absolute', bottom: '65px', left: 0, right: 0, height: '80px', overflow: 'hidden', zIndex: 4 }}>
          <CoolieRunner delay="0s" duration="13s" style={{ bottom: '8px' }} />
          <CoolieRunner delay="6s" duration="18s" style={{ bottom: '12px', opacity: 0.5, transform: 'scale(0.7)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5 }}>
          <TrainTrack />
        </div>
      </section>

      {/* ═══════════════════════ STATION TICKER ═══════════════════════ */}
      <div style={{
        background: 'rgba(249,115,22,0.06)',
        borderTop: '1px solid rgba(249,115,22,0.14)',
        borderBottom: '1px solid rgba(249,115,22,0.14)',
        padding: '0.875rem 0', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content', gap: 0 }}>
          {[...stationNames, ...stationNames].map((s, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginRight: '2.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              <MapPin size={11} color="#f97316" /> {s}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(20,28,46,0.6)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-pill"><TrendingUp size={12} /> Our Impact</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#f1f5fd', marginTop: '1rem' }}>
              Trusted by Millions
            </h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }} className="md:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
                  whileHover={{ y: -6, boxShadow: `0 12px 36px ${s.color}25` }}
                  style={{
                    background: 'rgba(15,22,36,0.9)',
                    border: `1px solid ${s.color}22`,
                    borderRadius: '1.5rem',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${s.color}18`, border: `1px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <Icon size={22} color={s.color} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: s.color, lineHeight: 1, marginBottom: '0.5rem' }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.85rem' }}>{s.label}</div>
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '70px', height: '70px', borderRadius: '50%', background: `${s.color}08`, filter: 'blur(20px)' }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HERO IMAGE SPLIT ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem', overflow: 'hidden' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: '4rem', alignItems: 'center' }} className="md:grid-cols-2">
          <FadeIn delay={0}>
            <span className="section-pill" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              <Train size={12} /> Why CoolieBook
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#f1f5fd', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              India's first digital coolie booking platform
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '2rem' }}>
              We connect millions of Indian rail travelers with verified, trained coolies — making every journey stress-free and dignified.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: Shield,    text: 'All coolies are government-verified with ID badges' },
                { icon: Clock,     text: 'Book up to 7 days in advance or same-day' },
                { icon: Award,     text: 'Rated 4.9/5 by over 50,000 satisfied travelers' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="#f97316" />
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, paddingTop: '0.5rem' }}>{text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <AnimatedButton variant="primary" icon={ChevronRight}>Start for Free</AnimatedButton>
              </Link>
            </div>
          </FadeIn>

          {/* Image + floating cards */}
          <FadeIn delay={0.15} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src={IMAGES.station} alt="Indian railway station"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 60%)' }} />
            </div>
            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', bottom: '-20px', left: '-20px',
                background: 'rgba(15,22,36,0.95)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(249,115,22,0.25)', borderRadius: '1.25rem',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#f97316' }}>2000+</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.78rem' }}>Verified Coolies</div>
                </div>
              </div>
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              style={{
                position: 'absolute', top: '-20px', right: '-20px',
                background: 'rgba(15,22,36,0.95)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99,102,241,0.25)', borderRadius: '1.25rem',
                padding: '1rem 1.25rem',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} color="#fcd34d" style={{ fill: '#fcd34d' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f1f5fd' }}>4.9 / 5.0</div>
                  <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.72rem' }}>50,000+ reviews</div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(20,28,46,0.5)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-pill" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Award size={12} /> Features
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#f1f5fd', marginTop: '0.75rem', marginBottom: '1rem' }}>
              Why Choose <span style={{ color: '#f97316' }}>CoolieBook</span>?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '1.05rem', maxWidth: '36rem', margin: '0 auto' }}>
              Modern luggage assistance, the way it should be.
            </p>
          </FadeIn>

          <div style={{ display: 'grid', gap: '1.25rem' }} className="md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              const ref = useRef(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div key={f.title} ref={ref}
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div style={{
                    width: '52px', height: '52px', background: `${f.color}18`,
                    border: `1px solid ${f.color}35`, borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '1.1rem', marginBottom: '0.625rem' }}>{f.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
                  <div style={{ position: 'absolute', top: 0, right: '1.5rem', width: '50px', height: '3px', background: `linear-gradient(90deg, transparent, ${f.color})` }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ COOLIES PREVIEW ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <FadeIn style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-pill" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                <Users size={12} /> Our Coolies
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#f1f5fd', marginTop: '0.5rem' }}>
                Meet Our Top Coolies
              </h2>
            </div>
            <Link to="/coolies" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="outline" icon={ChevronRight} style={{ fontSize: '0.875rem' }}>View All</AnimatedButton>
            </Link>
          </FadeIn>

          <div style={{ display: 'grid', gap: '1.5rem' }} className="md:grid-cols-3">
            {loading ? (
              // Simple loading skeletons/placeholders
              [1, 2, 3].map((n) => (
                <div key={n} style={{ height: '380px', background: 'rgba(15,22,36,0.5)', borderRadius: '1.5rem', animation: 'pulse 2s infinite' }} />
              ))
            ) : activeCoolies.length > 0 ? (
              activeCoolies.map((c, i) => {
                const fullName = `${c.first_name} ${c.last_name}`;
                const coolieImg = config.getImageUrl(c.avatar_url);
                
                return (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(249,115,22,0.2)' }}
                    style={{
                      background: 'rgba(15,22,36,0.9)',
                      border: '1px solid rgba(249,115,22,0.15)',
                      borderRadius: '1.5rem', overflow: 'hidden',
                      transition: 'all 0.35s',
                    }}
                  >
                    {/* Cover image */}
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <img src={coolieImg} alt={fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,22,36,0.9) 0%, transparent 60%)' }} />
                      <div style={{
                        position: 'absolute', top: '0.875rem', right: '0.875rem',
                        background: c.status === 'available' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', 
                        border: c.status === 'available' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                        borderRadius: '999px', padding: '0.25rem 0.625rem',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        fontSize: '0.7rem', fontFamily: 'var(--font-mono)', 
                        color: c.status === 'available' ? '#34d399' : '#fcd34d', fontWeight: 700,
                      }}>
                        <motion.span style={{ 
                          width: '6px', height: '6px', borderRadius: '50%', 
                          background: c.status === 'available' ? '#34d399' : '#fcd34d', 
                          display: 'inline-block' 
                        }}
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        {c.status === 'available' ? 'Available' : 'Busy'}
                      </div>
                    </div>
                    {/* Card body */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '1.15rem' }}>{fullName}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={13} color="#fcd34d" style={{ fill: '#fcd34d' }} />
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '0.9rem' }}>4.8</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                        <MapPin size={13} color="#94a3b8" />
                        <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.82rem' }}>{c.city}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                          borderRadius: '999px', padding: '0.25rem 0.75rem',
                          fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fb923c',
                          display: 'flex', alignItems: 'center', gap: '0.375rem',
                        }}>
                          <Luggage size={11} /> Verified Partner
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.78rem' }}>
                          Featured
                        </span>
                      </div>
                      {user?.role !== 'coolie' && (
                        <Link to="/book" state={{ coolieId: c.id, coolieName: fullName }} style={{ textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
                          <AnimatedButton variant="primary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.875rem' }}>
                            Book Now
                          </AnimatedButton>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem', background: 'rgba(15,22,36,0.5)', borderRadius: '1.5rem', border: '1px dashed rgba(249,115,22,0.2)' }}>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)' }}>Our partners are currently being verified. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(20,28,46,0.6)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-pill" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Navigation size={12} /> Simple Process
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#f1f5fd', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              How It Works
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8' }}>Four simple steps to a hassle-free journey.</p>
          </FadeIn>
          <div style={{ display: 'grid', gap: '1.25rem', position: 'relative' }} className="md:grid-cols-4">
            {/* Connector (desktop only) */}
            <div style={{ display: 'none', position: 'absolute', top: '3rem', left: '12%', right: '12%', height: '2px', background: 'linear-gradient(90deg, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.1) 50%, rgba(249,115,22,0.4) 100%)' }} className="md:flex" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeIn key={s.n} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: `0 12px 30px ${s.color}25` }}
                    style={{
                      background: 'rgba(15,22,36,0.85)', border: '1px solid rgba(249,115,22,0.14)',
                      borderRadius: '1.25rem', padding: '2rem 1.5rem', textAlign: 'center',
                      transition: 'all 0.3s', position: 'relative',
                    }}
                  >
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      background: `${s.color}18`, border: `2px solid ${s.color}45`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1.25rem', position: 'relative',
                    }}>
                      <Icon size={24} color={s.color} />
                      <span style={{
                        position: 'absolute', top: '-8px', right: '-8px',
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: s.color, color: '#fff',
                        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.65rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{i + 1}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: `${s.color}25`, lineHeight: 1, marginBottom: '0.75rem' }}>{s.n}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65 }}>{s.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRAIN DIVIDER ═══════════════════════ */}
      <TrainTrack />

      {/* ═══════════════════════ PLATFORM IMAGE SECTION ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: '4rem', alignItems: 'center' }} className="md:grid-cols-2">
          <FadeIn style={{ position: 'relative', order: 0 }}>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src={IMAGES.platform} alt="Train platform"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 50%, rgba(15,22,36,0.6) 100%)' }} />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <span className="section-pill" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              <Luggage size={12} /> Luggage Handling
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#f1f5fd', lineHeight: 1.2, marginBottom: '1rem', marginTop: '0.75rem' }}>
              No more carrying heavy bags
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Whether you have 1 bag or 10, our coolies handle it all. From the entrance to your seat — they carry, you travel.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: Luggage,  label: 'Light (1-2 bags)', price: '₹50' },
                { icon: Award,    label: 'Medium (3-4 bags)', price: '₹100' },
                { icon: TrendingUp, label: 'Heavy (5+ bags)', price: '₹150' },
                { icon: Zap,      label: 'Express service',  price: '₹200' },
              ].map(({ icon: Icon, label, price }) => (
                <div key={label} style={{
                  background: 'rgba(15,22,36,0.8)', border: '1px solid rgba(249,115,22,0.12)',
                  borderRadius: '1rem', padding: '1rem',
                }}>
                  <Icon size={18} color="#f97316" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.8rem' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f97316', fontSize: '1.1rem' }}>{price}</div>
                </div>
              ))}
            </div>
            <Link to="/book" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="primary" icon={ArrowRight}>Book a Coolie</AnimatedButton>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════ COOLIE PARTNER CTA ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(249,115,22,0.03)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: '4rem', alignItems: 'center' }} className="md:grid-cols-2">
          <FadeIn order={2} className="md:order-1">
            <span className="section-pill" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', marginBottom: '1.25rem', display: 'inline-flex' }}>
              <UserCheck size={12} /> Become a Partner
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#f1f5fd', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Are you a professional Coolie? Join our network.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '2rem' }}>
              Get more bookings, professional status, and instant payments. We are looking for motivated individuals to join India's largest railway assistance network.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>₹25k+</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Average monthly earnings</div>
              </div>
              <div>
                <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>5000+</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Active partners across India</div>
              </div>
            </div>
            <Link to="/coolie-register" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="primary" icon={Sparkles} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}>
                Apply as a Coolie
              </AnimatedButton>
            </Link>
          </FadeIn>
          <FadeIn order={1} className="md:order-2" delay={0.2}>
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src={IMAGES.coolie4} alt="Coolie partner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(225deg, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section style={{ padding: '6rem 2rem' }}>
        <FadeIn>
          <div style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              style={{
                background: 'linear-gradient(135deg, rgba(15,22,36,0.95), rgba(26,37,64,0.9))',
                border: '1px solid rgba(249,115,22,0.22)',
                borderRadius: '2.5rem', padding: 'clamp(3rem,6vw,5rem) 2rem',
                position: 'relative', overflow: 'hidden',
              }}
              whileHover={{ boxShadow: '0 0 80px rgba(249,115,22,0.15)', borderColor: 'rgba(249,115,22,0.4)' }}
              transition={{ duration: 0.4 }}
            >
              {/* Glows */}
              <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(249,115,22,0.07)', filter: 'blur(60px)' }} />
              <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(60px)' }} />
              <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '2px', background: 'linear-gradient(90deg, transparent, #f97316, transparent)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '72px', height: '72px',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  borderRadius: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 30px rgba(249,115,22,0.45)',
                  animation: 'float 4s ease-in-out infinite',
                }}>
                  <Train size={32} color="white" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: '#f1f5fd', marginBottom: '1rem' }}>
                  Ready to travel light?
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '35rem', margin: '0 auto 2.5rem' }}>
                  Join <span style={{ color: '#fb923c', fontWeight: 600 }}>50,000+ travelers</span> who book their coolie in advance and travel stress-free.
                </p>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <AnimatedButton variant="primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                    Book Your Coolie Now
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </section>

    </PageTransition>
  );
}