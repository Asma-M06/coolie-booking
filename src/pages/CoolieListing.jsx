import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Luggage, UserCheck, Award, Zap, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import TrainTrack from '../components/ui/TrainTrack';
import axios from 'axios';
import config from '../config/env';
import useStore from '../store/useStore';

const HERO_IMG = "/assets/train.jpg";

function CoolieCard({ coolie, delay }) {
  const { user } = useStore();
  const BadgeIcon = Award; // Default for now
  const available = coolie.status === 'available';
  const statusColor = available ? '#10b981' : '#f59e0b';
  const statusText = available ? 'Available' : 'Busy';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(249,115,22,0.2)' }}
      style={{
        background: 'rgba(15,22,36,0.9)',
        border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '1.5rem', overflow: 'hidden',
        transition: 'all 0.35s',
      }}
    >
      {/* Photo */}
      <div style={{ height: '210px', position: 'relative', overflow: 'hidden' }}>
        <img src={coolie.img} alt={coolie.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s' }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,22,36,0.95) 0%, transparent 55%)' }} />
        {/* Status */}
        <div style={{
          position: 'absolute', top: '0.875rem', right: '0.875rem',
          background: `${statusColor}18`, border: `1px solid ${statusColor}40`,
          borderRadius: '999px', padding: '0.25rem 0.625rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: statusColor, fontWeight: 700,
        }}>
          <motion.span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {statusText}
        </div>
        {/* Badge */}
        <div style={{
          position: 'absolute', top: '0.875rem', left: '0.875rem',
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '999px', padding: '0.25rem 0.625rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#fcd34d', fontWeight: 700,
        }}>
          <BadgeIcon size={10} /> {coolie.trips > 1000 ? 'Expert' : 'Verified'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '1.15rem' }}>{coolie.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <Star size={13} color="#fcd34d" style={{ fill: '#fcd34d' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '0.9rem' }}>{coolie.rating}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.875rem' }}>
          <MapPin size={13} color="#94a3b8" />
          <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.82rem' }}>{coolie.station}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: '999px', padding: '0.25rem 0.75rem',
            fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fb923c',
            display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}>
            <Luggage size={11} /> {coolie.speciality}
          </div>
          <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.78rem' }}>
            {coolie.trips.toLocaleString()} trips
          </span>
        </div>
        
        {/* No individual booking button - using auto-assignment */}
      </div>
    </motion.div>
  );
}

export default function CoolieListing() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [coolies, setCoolies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoolies = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/coolies/approved`);
        setCoolies(res.data.coolies);
      } catch (err) {
        console.error('Error fetching coolies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoolies();
  }, []);

  const filtered = useMemo(() =>
    coolies.filter((c) => {
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      const matchSearch = fullName.includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
      
      const matchFilter = filter === 'all' || 
                         (filter === 'available' && c.status === 'available') ||
                         (filter === 'unavailable' && c.status === 'busy');
                         
      return matchSearch && matchFilter;
    }),
  [search, filter, coolies]);

  return (
    <PageTransition>

      {/* Hero banner */}
      <section style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
        <img src={HERO_IMG} alt="Coolies at station"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.3) saturate(0.8)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,22,36,0.4), rgba(15,22,36,0.95))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', paddingTop: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '999px', padding: '0.375rem 1rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#fb923c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <UserCheck size={12} /> Our Team
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', color: '#f1f5fd', marginBottom: '0.75rem' }}
          >
            Available <span style={{ color: '#f97316' }}>Coolies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--font-body)', color: '#94a3b8' }}
          >
            <span style={{ color: '#10b981', fontWeight: 600 }}>{coolies.length} coolies</span> ready at your station right now
          </motion.p>
        </div>
      </section>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Sparkles size={20} color="#f97316" />
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
            <strong style={{ color: '#f97316' }}>Auto-Assignment Active:</strong> Individual coolies cannot be selected manually. Our system will automatically assign the best available coolie at your station once you book.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: '0.875rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}
        >
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or station…" className="rail-input" style={{ paddingLeft: '2.75rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { val: 'all', label: 'All Coolies' },
              { val: 'available', label: 'Available' },
              { val: 'unavailable', label: 'Busy' },
            ].map((f) => (
              <motion.button key={f.val} onClick={() => setFilter(f.val)} whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.625rem 1.1rem', borderRadius: '0.875rem', fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  ...(filter === f.val
                    ? { background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }
                    : { background: 'rgba(15,22,36,0.8)', border: '1px solid rgba(45,63,96,0.8)', color: '#94a3b8' }),
                }}>{f.label}</motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" size={40} color="#f97316" />
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filtered.map((c, i) => <CoolieCard key={c.id} coolie={{ ...c, name: `${c.first_name} ${c.last_name}`, station: c.city, img: config.getImageUrl(c.avatar_url), rating: 4.8, trips: 100 }} delay={i * 0.07} />)}
          </div>
        ) : (
          <div style={{ background: 'rgba(15,22,36,0.7)', border: '1px solid rgba(249,115,22,0.1)', borderRadius: '1.25rem', padding: '5rem 2rem', textAlign: 'center' }}>
            <Search size={40} color="#2d3f60" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8' }}>No partners found matching your search.</p>
          </div>
        )}
      </div>

      <TrainTrack />
    </PageTransition>
  );
}