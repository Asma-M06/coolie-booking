import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Eye, Search, 
  MapPin, Phone, Calendar, Shield, ExternalLink, Loader2, X
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

export default function AdminCoolieRequests() {
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const getPfp = (r) => {
    if (r.avatar_url) return config.getImageUrl(r.avatar_url);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(r.first_name)}+${encodeURIComponent(r.last_name)}&background=0f172a&color=10b981&bold=true`;
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/admin/coolie-requests`, { withCredentials: true });
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, approve) => {
    const actionText = approve ? 'Approve' : 'Reject';
    const result = await Swal.fire({
      title: `${actionText} Application?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this coolie?`,
      icon: approve ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      confirmButtonColor: approve ? '#10b981' : '#ef4444',
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${config.apiBaseUrl}/admin/coolie-requests/${id}`, { approve }, { withCredentials: true });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Application has been ${approve ? 'approved' : 'rejected'}.`,
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          timer: 1500,
          showConfirmButton: false
        });
        fetchRequests(); // Refresh list
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Action Failed', text: 'Something went wrong.' });
      }
    }
  };

  const filtered = requests.filter(r => 
    r.first_name.toLowerCase().includes(search.toLowerCase()) ||
    r.last_name.toLowerCase().includes(search.toLowerCase()) ||
    r.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
          Onboarding Queue
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review and verify new Coolie applications. Accuracy is paramount.</p>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.4)', 
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', alignItems: 'center' 
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input 
            type="text" placeholder="Filter by name, phone or city..." 
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.6rem 1rem 0.6rem 2.8rem', color: '#fff', outline: 'none' }} 
          />
        </div>
        <select style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.6rem 1rem', color: '#94a3b8', outline: 'none' }}>
          <option>Oldest First</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Requests Table */}
      <div style={{ 
        background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: '1.5rem', overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Applicant</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Phone & City</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Verification</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={32} color="#10b981" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: '#64748b' }}>Accessing data secure vault...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                  No pending applications found.
                </td>
              </tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={getPfp(r)} alt="" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{r.first_name} {r.last_name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                      <Phone size={12} /> {r.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.8rem' }}>
                      <MapPin size={12} /> {r.city}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Shield size={14} /> Aadhar Provided
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>{r.aadhar_number}</div>
                </td>
                <td style={{ padding: '1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> {new Date(r.registered_at).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleAction(r.id, true)}
                      style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer' }} 
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleAction(r.id, false)}
                      style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }} 
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                    <button 
                      onClick={() => setSelectedImage(config.getImageUrl(r.aadhar_image))}
                      style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#64748b', cursor: 'pointer' }} 
                      title="View Documents"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
      </AnimatePresence>

    </div>
  );
}
