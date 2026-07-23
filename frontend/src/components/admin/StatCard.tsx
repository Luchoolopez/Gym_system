interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accent }) => (
  <div className={`border p-6 ${accent ? 'border-volt bg-volt/5' : 'border-outline bg-surface-card'}`}>
    <div className={`mb-3 ${accent ? 'text-volt' : 'text-muted'}`}>{icon}</div>
    <div className="font-anton text-4xl">{value}</div>
    <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted">{label}</div>
  </div>
);
