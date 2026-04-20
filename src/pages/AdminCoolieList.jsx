import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, MapPin, Phone, Calendar, 
  ShieldCheck, Loader2, Filter, Download, Eye, X, Trash2
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config/env';

function ImageModal({ src, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '-40px', right: '-40px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={32} />
        </button>
        <img src={src} alt="Aadhar Image" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} />
      </motion.div>
    </motion.div>
  );
}

export default function AdminCoolieList() {
  const [search, setSearch] = useState('');
  const [coolies, setCoolies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchCoolies = async () => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/admin/coolies`, { withCredentials: true });
      setCoolies(res.data.coolies);
    } catch (err) {
      console.error('Failed to fetch coolie registry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoolie = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove ${name} from the coolie registry. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: 'rgba(255,255,255,0.1)',
      confirmButtonText: 'Yes, delete coolie',
      background: '#0f172a',
      color: '#f8fafc'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${config.apiBaseUrl}/admin/coolies/${id}`, { withCredentials: true });
        Swal.fire({
          title: 'Deleted!',
          text: 'Coolie has been removed successfully.',
          icon: 'success',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#10b981'
        });
        fetchCoolies(); // Refresh list
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to remove coolie.',
          icon: 'error',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    }
  };

  useEffect(() => {
    fetchCoolies();
  }, []);

  const getPfp = (c) => {
    if (c.avatar_url) return config.getImageUrl(c.avatar_url);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(c.first_name)}+${encodeURIComponent(c.last_name)}&background=0f172a&color=10b981&bold=true`;
  };

  const filtered = coolies.filter(c => 
    c.first_name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
            Coolie Registry
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comprehensive database of all partners across the network.</p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', 
          color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' 
        }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.4)', 
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', alignItems: 'center' 
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input 
            type="text" placeholder="Search by name, email, city..." 
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.6rem 1rem 0.6rem 2.8rem', color: '#fff', outline: 'none' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div style={{ padding: '8rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={40} color="#10b981" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={getPfp(c)} alt="" style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(16,185,129,0.2)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>{c.first_name} {c.last_name}</h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>ID: {c.id.substring(0, 8)}...</div>
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', 
                  background: c.is_approved ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                  color: c.is_approved ? '#10b981' : '#f59e0b',
                  border: `1px solid ${c.is_approved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                }}>
                  {c.is_approved ? 'Approved' : 'Pending'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <div style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Phone</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={12} /> {c.phone}</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <div style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Location</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={12} /> {c.city}</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <div style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Aadhar</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={12} /> {c.aadhar_number}</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <div style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Registered</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={12} /> {new Date(c.registered_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedImage(config.getImageUrl(c.aadhar_image))}
                  style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Eye size={16} /> View Docs
                </button>
                <button 
                  onClick={() => handleDeleteCoolie(c.id, `${c.first_name} ${c.last_name}`)}
                  style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.75rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
      </AnimatePresence>

    </div>
  );
}
