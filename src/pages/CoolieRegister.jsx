import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Shield, Camera, ArrowRight, ArrowLeft, 
  Check, Sparkles, Upload, Loader2, Mail, Lock, FileText,
  Briefcase, Star, Award, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import PageTransition from '../components/ui/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import config from '../config/env';

const BG_IMAGE = '/assets/getstarted.jpg';

export default function CoolieRegister() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    age: '',
    phone: '',
    city: '',
    postal_code: '',
    aadhar_number: '',
    aadhar_image: '',
    avatar_url: ''
  });

  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    { title: 'Identity', subtitle: 'Basic profile information', icon: User },
    { title: 'Location', subtitle: 'Where do you operate?', icon: MapPin },
    { title: 'Verification', subtitle: 'Official document upload', icon: Shield },
    { title: 'Security', subtitle: 'Account protection', icon: Lock },
  ];

  const isStepValid = () => {
    switch(step) {
      case 0: return form.first_name && form.last_name && form.age;
      case 1: return form.phone && form.city && form.postal_code;
      case 2: return form.aadhar_number.length === 12 && form.aadhar_image;
      case 3: return form.email && form.password.length >= 6;
      default: return false;
    }
  };

  const next = () => {
    if (!isStepValid()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: step === 2 && form.aadhar_number.length !== 12 
          ? 'Aadhar number must be exactly 12 digits.' 
          : 'Please fill in all required fields and upload necessary documents before continuing.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) { next(); return; }
    
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/coolies/register`, form, { 
        timeout: config.apiTimeout,
        withCredentials: true 
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your registration is pending admin approval. We will notify you once approved.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#10b981',
        backdrop: 'rgba(0,0,0,0.8)'
      });
      
      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err?.response?.data?.message || 'Something went wrong.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', display: 'block' };

  const renderStep = () => {
    switch(step) {
      case 0: return (
        <div key="step0" className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label style={labelStyle}>First Name</label>
              <div className="relative">
                <User size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" value={form.first_name} onChange={update('first_name')} placeholder="Rajesh" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem' }} />
              </div>
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Last Name</label>
              <input type="text" value={form.last_name} onChange={update('last_name')} placeholder="Kumar" className="rail-input" style={{ height: '3.25rem' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Middle Name (Optional)</label>
            <input type="text" value={form.middle_name} onChange={update('middle_name')} placeholder="Prasad" className="rail-input" style={{ height: '3.25rem' }} />
          </div>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" value={form.age} onChange={update('age')} placeholder="e.g. 28" className="rail-input" style={{ height: '3.25rem' }} />
          </div>
        </div>
      );
      case 1: return (
        <div key="step1" className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <PhoneInput
                defaultCountry="in"
                value={form.phone}
                onChange={(phone) => setForm((p) => ({ ...p, phone }))}
                style={{
                  '--react-international-phone-bg': 'rgba(15, 23, 42, 0.6)',
                  '--react-international-phone-border-color': 'rgba(255,255,255,0.08)',
                  '--react-international-phone-text-color': '#f8fafc',
                  '--react-international-phone-font-family': 'var(--font-body)',
                }}
                inputStyle={{ flex: 1, height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.08)' }}
                countrySelectorStyleProps={{ buttonStyle: { height: '3.25rem', padding: '0 0.5rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)' } }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label style={labelStyle}>City</label>
              <div className="relative">
                <MapPin size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" value={form.city} onChange={update('city')} placeholder="Mumbai" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem' }} />
              </div>
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Postal Code</label>
              <input type="text" value={form.postal_code} onChange={update('postal_code')} placeholder="400001" className="rail-input" style={{ height: '3.25rem' }} />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div key="step2" className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Aadhar Card Number</label>
            <div className="relative">
              <FileText size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="text" value={form.aadhar_number} onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                setForm(p => ({ ...p, aadhar_number: val }));
              }} placeholder="1234 5678 9012 (12 digits)" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem' }} />
            </div>
            {form.aadhar_number && form.aadhar_number.length !== 12 && (
              <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>Aadhar must be exactly 12 digits</p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label style={labelStyle}>Aadhar Card Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-colors">
                {form.aadhar_image ? (
                  <img src={form.aadhar_image} className="w-full h-full object-cover rounded-lg" alt="Aadhar" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-slate-500 mb-2" size={24} />
                    <span className="text-[0.7rem] text-slate-400">Click to upload</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload('aadhar_image')} />
              </label>
            </div>
            <div className="flex-1">
              <label style={labelStyle}>Profile Picture</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-colors">
                {form.avatar_url ? (
                  <img src={form.avatar_url} className="w-full h-full object-cover rounded-lg" alt="Profile" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="text-slate-500 mb-2" size={24} />
                    <span className="text-[0.7rem] text-slate-400">Upload PFP</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload('avatar_url')} />
              </label>
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div key="step3" className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Email Address</label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="email" value={form.email} onChange={update('email')} placeholder="rajesh@cooliebook.in" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Account Password</label>
            <div className="relative">
              <Lock size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem' }} />
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row-reverse', position: 'relative', overflow: 'hidden', background: '#020617' }}>

        {/* ── RIGHT: Cinematic Image Panel ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="hidden md:flex flex-1">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
            src={BG_IMAGE} alt="Indian Railway Coolie"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          {/* Intense Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(225deg, rgba(2,6,23,0.9) 0%, rgba(16,185,129,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, transparent 20%, #020617 120%)' }} />
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Join the Network
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.9 }}>
                {[
                  'Earn more with consistent bookings',
                  'Professional digital ID & verified status',
                  'Instant payments & digital wallet',
                ].map((text, i) => (
                  <motion.li key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + (i * 0.1) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', color: '#cbd5e1', fontSize: '1.05rem', fontFamily: 'var(--font-body)' }}>
                    <div style={{ padding: '4px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <Check size={14} color="#34d399" />
                    </div>
                    {text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── LEFT: God-Level Onboarding Form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#020617', position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '30rem', position: 'relative', zIndex: 10 }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.div
                whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(16,185,129,0.1)' }}
              >
                <Sparkles size={28} color="#10b981" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Coolie Onboarding
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                Join the official railway assistance network
              </p>
            </div>

            {/* Glowing Form Card */}
            <div style={{
              background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.75rem',
              padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.04)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)' }} />

              {/* Progress Indicator */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ 
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: i <= step ? '#10b981' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                    style={{ minHeight: '260px' }}
                  >
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{steps[step].title} Details</h3>
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{steps[step].subtitle}</p>
                    </div>
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {step > 0 && (
                    <button type="button" onClick={prev} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.25rem' }}>
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <AnimatedButton type="submit" variant="primary" disabled={loading} icon={step === 3 ? Check : ArrowRight} style={{ flex: 1, padding: '1rem', fontSize: '1rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {loading ? 'Processing…' : step === 3 ? 'Complete Setup' : 'Continue'}
                  </AnimatedButton>
                </div>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Existing Coolie?</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
              </div>

              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#f8fafc', fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer' }}>
                  Sign In to Portal
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  );
}
