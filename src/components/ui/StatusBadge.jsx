const BADGE_CONFIG = {
  confirmed: { label: 'Confirmed', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
  pending:   { label: 'Pending',   bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  color: '#fcd34d' },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   color: '#f87171' },
  active:    { label: 'Active',    bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)',  color: '#34d399' },
};

export default function StatusBadge({ status }) {
  const c = BADGE_CONFIG[status] || BADGE_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color, display: 'inline-block' }} />
      {c.label}
    </span>
  );
}