const stats = [
  { value: '2.500+', label: 'Socios activos' },
  { value: '40+', label: 'Clases semanales' },
  { value: '15', label: 'Profesores' },
  { value: '24/7', label: 'Acceso al club' },
];

export const StatsBar = () => (
  <section className="border-y border-outline bg-graphite">
    <div className="mx-auto max-w-7xl px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-outline">
      {stats.map((s) => (
        <div key={s.label} className="py-8 px-4 text-center">
          <div className="font-anton text-4xl md:text-5xl text-volt">{s.value}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);
