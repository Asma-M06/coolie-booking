import { Train, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SocialIcon = ({ type }) => {
  if (type === 'Twitter') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
  if (type === 'Facebook') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  if (type === 'Instagram') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
  return null;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0d1220',
      borderTop: '1px solid rgba(249,115,22,0.15)',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* Animated train at top of footer */}
      <div style={{ position: 'relative', height: '60px', overflow: 'hidden' }}>
        {/* Rails */}
        <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, height: '2px', background: 'rgba(249,115,22,0.2)' }} />
        <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, height: '2px', background: 'rgba(249,115,22,0.2)' }} />
        {/* Ties */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', bottom: '6px', left: `${i * 2.6}%`, width: '1.5%', height: '12px', background: '#ffffff', borderRadius: '1px' }} />
        ))}
        {/* Animated mini train */}
        <div style={{ position: 'absolute', bottom: '12px', animation: 'trainRideReverse 20s linear infinite', willChange: 'transform' }}>
          <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
            <rect x="8" y="2" width="52" height="18" rx="3" fill="#1f2937" stroke="rgba(249,115,22,0.6)" strokeWidth="1"/>
            <rect x="58" y="5" width="16" height="12" rx="2" fill="#374151" stroke="rgba(249,115,22,0.4)" strokeWidth="1"/>
            <rect x="18" y="-2" width="5" height="6" rx="1" fill="#374151"/>
            <circle cx="64" cy="10" r="2.5" fill="rgba(253,224,71,0.8)"/>
            <circle cx="20" cy="24" r="5" fill="#111827" stroke="rgba(249,115,22,0.8)" strokeWidth="1.5"/>
            <circle cx="44" cy="24" r="5" fill="#111827" stroke="rgba(249,115,22,0.8)" strokeWidth="1.5"/>
            <circle cx="66" cy="24" r="4" fill="#111827" stroke="rgba(249,115,22,0.6)" strokeWidth="1"/>
            <rect x="0" y="4" width="6" height="14" rx="2" fill="#ffffff" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
            <circle cx="4" cy="24" r="4" fill="#111827" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'minmax(280px, 2fr) 1fr 1fr 1.5fr' }} className="md:grid-cols-4">
          
          {/* Brand & About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
              }}>
                <Train size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#f1f5fd' }}>
                Coolie<span style={{ color: '#f97316' }}>Book</span>
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Transforming the way you travel across Indian Railways. Book verified, professional luggage assistance directly from your phone.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem' }}>
              {['Twitter', 'Facebook', 'Instagram'].map((type, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c', transition: 'all 0.2s', textDecoration: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; e.currentTarget.style.color = '#fb923c'; }}
                >
                  <SocialIcon type={type} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#f1f5fd', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[{ l: 'Home', p: '/' }, { l: 'Book a Coolie', p: '/book' }, { l: 'Browse Coolies', p: '/coolies' }, { l: 'My Dashboard', p: '/dashboard' }].map(({ l, p }) => (
                <Link key={l} to={p} style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fb923c'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} /> {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal / Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#f1f5fd', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {['About Us', 'Contact Support', 'Privacy Policy', 'Terms of Service'].map((l) => (
                <a key={l} href="#" style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fb923c'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} /> {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#f1f5fd', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#f97316" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  CoolieBook Technologies<br />
                  Unit 42, Cyber Hub, Mumbai 400051<br />
                  Maharashtra, India
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={16} color="#f97316" />
                <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.9rem' }}>+91 1800-420-5555</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={16} color="#f97316" />
                <span style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.9rem' }}>support@cooliebook.in</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(249,115,22,0.15)', margin: '3rem 0 1.5rem' }} />

        {/* Bottom / Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }} className="sm:flex-row sm:justify-between sm:text-left">
          <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.85rem' }}>
            © {currentYear} CoolieBook. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Made with precision for Indian Railways</span>
            {/* Minimal SVG India flag */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ borderRadius: '2px', overflow: 'hidden' }}>
              <rect width="16" height="4" fill="#FF9933"/>
              <rect y="4" width="16" height="4" fill="#FFFFFF"/>
              <rect y="8" width="16" height="4" fill="#138808"/>
              <circle cx="8" cy="6" r="1.5" stroke="#000080" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}