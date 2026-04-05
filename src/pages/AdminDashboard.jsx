import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Clock, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, Train
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Coolies', value: '2,481', change: '+12%', icon: UserCheck, color: '#10b981' },
    { label: 'Active Passengers', value: '48.9K', change: '+5.2%', icon: Users, color: '#3b82f6' },
    { label: 'Pending Approvals', value: '14', change: '-2', icon: Clock, color: '#f59e0b' },
    { label: 'Total Revenue', value: '₹4.2M', change: '+18%', icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
            System Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back, Commander. Here's what's happening on the network today.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Last Backup: 22m ago
          </div>
          <button style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '1.25rem', padding: '1.5rem', position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: s.change.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                {s.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.change}
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.label}</div>
            
            {/* Soft decorative glow */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${s.color}10`, filter: 'blur(30px)' }} />
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Layout (Mock Widgets) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Activity Chart Placeholder */}
        <div style={{ 
          background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.06)', 
          borderRadius: '1.5rem', padding: '2rem' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Booking Volume (24h)</h3>
            <Activity size={18} color="#10b981" />
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '0.75rem', paddingBottom: '1rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
                style={{ flex: 1, background: 'linear-gradient(to top, rgba(16,185,129,0.4), rgba(16,185,129,0.1))', borderRadius: '4px 4px 0 0', position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#475569' }}>
                  {12+i}h
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Events List */}
        <div style={{ 
          background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.06)', 
          borderRadius: '1.5rem', padding: '1.5rem' 
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>System Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { type: 'warning', msg: 'New Coolie Application: Raju S.', time: '2m ago' },
              { type: 'info', msg: 'System Backup completed successfully', time: '22m ago' },
              { type: 'error', msg: 'Duplicate DB connection attempt from IP: 192.x', time: '1h ago' },
              { type: 'success', msg: 'Peak capacity reached at Delhi Junction', time: '3h ago' },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px',
                  background: ev.type === 'error' ? '#ef4444' : ev.type === 'warning' ? '#f59e0b' : '#10b981' 
                }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 500 }}>{ev.msg}</div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
