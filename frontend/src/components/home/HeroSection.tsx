import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';

export const HeroSection = () => (
  <section className="relative overflow-hidden bg-carbon">
    {/* Textura de fondo */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 25% 30%, #d2f34c 0, transparent 40%), radial-gradient(circle at 80% 70%, #d2f34c 0, transparent 35%)',
      }}
    />
    <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-36">
      <div className="max-w-4xl">
        <span className="text-volt text-[12px] font-bold uppercase tracking-[0.35em]">
          Tu mejor versión empieza acá
        </span>
        <h1 className="mt-6 font-anton text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85]">
          Forjá tu <br />
          <span className="text-volt">cuerpo</span> con <br />
          <span className="text-stroke-bone">fuego</span>
        </h1>
        <p className="mt-8 max-w-xl text-muted text-base md:text-lg leading-relaxed">
          Reservá tus clases, seguí tu progreso y llevá tu membresía en un solo lugar.
          Sin excusas. Solo hierro, sudor y resultados.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="md">
              Empezá ahora <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/horarios">
            <Button variant="secondary" size="md">
              Ver horarios
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);
