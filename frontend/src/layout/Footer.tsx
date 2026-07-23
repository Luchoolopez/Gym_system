import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Dumbbell, MapPin, Clock } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/horarios', label: 'Horarios' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/register', label: 'Sumate' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapVisible, setMapVisible] = useState(false);

  // El mapa se carga sólo cuando el footer entra en viewport (no penaliza el primer render)
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMapVisible(true); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full bg-surface border-t border-outline">
      {/* Grilla de información */}
      <div className="w-full px-6 md:px-16 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 xl:gap-16">

        {/* Marca */}
        <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 font-anton text-xl uppercase tracking-wide">
            <Dumbbell className="text-volt" size={20} />
            Forja<span className="text-volt">Gym</span>
          </div>
          <p className="font-hanken text-sm text-muted leading-relaxed max-w-[220px]">
            Entrená con fuego. Hierro, sudor y resultados que se construyen día a día.
          </p>
        </div>

        {/* Navegación */}
        <div className="lg:col-span-1 lg:border-r lg:border-outline lg:pr-6">
          <span className="font-hanken font-semibold text-[11px] tracking-[0.14em] uppercase text-volt">Navegación</span>
          <ul className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="font-hanken font-semibold text-[11px] tracking-[0.14em] uppercase text-muted hover:text-volt transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Horarios + Redes */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-hanken font-semibold text-[11px] tracking-[0.14em] uppercase text-volt mb-1 flex items-center gap-1.5">
              <Clock size={13} /> Horarios
            </span>
            <p className="font-hanken text-sm text-muted leading-relaxed">
              Lun. a Vie. 7:00 — 23:00<br />
              Sáb. y Dom. 9:00 — 18:00
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-hanken font-semibold text-[11px] tracking-[0.14em] uppercase text-volt">Redes</span>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Forja Gym"
                className="text-muted hover:text-volt transition-colors duration-300"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/5492914000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Forja Gym"
                className="text-muted hover:text-volt transition-colors duration-300"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div
          ref={mapRef}
          className="md:col-span-2 lg:col-span-2 h-44 border border-outline overflow-hidden opacity-70 hover:opacity-100 transition-opacity duration-500"
        >
          {mapVisible ? (
            <iframe
              title="Ubicación Forja Gym"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103753.13682974635!2d-62.33854581452449!3d-38.71833502859943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95edbcabdc130251%3A0x9db2859ef032f4c2!2sBah%C3%ADa%20Blanca%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(0.92)' }}
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full animate-pulse flex items-center justify-center">
              <span className="font-hanken text-[10px] uppercase tracking-widest text-muted/30">Cargando mapa...</span>
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <span className="font-hanken font-semibold text-[11px] tracking-[0.14em] uppercase text-volt flex items-center gap-1.5">
            <MapPin size={13} /> Contacto
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-hanken text-sm text-muted">Bahía Blanca</p>
            <p className="font-hanken text-sm text-muted">Buenos Aires, Argentina</p>
            <a href="mailto:hola@forjagym.com" className="font-hanken text-sm text-muted hover:text-volt transition-colors">
              hola@forjagym.com
            </a>
          </div>
        </div>

      </div>

      {/* Barra inferior */}
      <div className="px-6 md:px-16 py-5 border-t border-outline flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="font-hanken text-[11px] tracking-widest uppercase text-muted/40">
          © {currentYear} Forja Gym — Entrená fuerte. Viví mejor.
        </p>
        <div className="flex gap-6">
          <span className="font-hanken text-[11px] tracking-widest uppercase text-muted/40">Términos</span>
          <span className="font-hanken text-[11px] tracking-widest uppercase text-muted/40">Privacidad</span>
        </div>
      </div>
    </footer>
  );
};
