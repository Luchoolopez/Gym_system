import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, CalendarCheck } from 'lucide-react';
import { Button } from '../ui';
import { useAuthContext } from '../../context/authContext';

export const CtaSection = () => {
  const { user } = useAuthContext();

  // El CTA se adapta según haya sesión iniciada o no
  const content = user
    ? {
        kicker: `Vamos, ${user.nombre}`,
        title: (<>Tu próxima <span className="text-volt">clase</span> te espera</>),
        text: 'Reservá tu lugar, seguí tu progreso y no aflojes. El resultado se construye día a día.',
        cta: 'Reservar una clase',
        to: '/reservas',
        icon: <CalendarCheck size={16} />,
      }
    : {
        kicker: 'Sin excusas',
        title: (<>Dejá de <span className="text-volt">pensarlo</span></>),
        text: 'El único entrenamiento malo es el que no hiciste. Sumate hoy y empezá a forjar la mejor versión de vos.',
        cta: 'Crear mi cuenta',
        to: '/register',
        icon: <ArrowRight size={16} />,
      };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
      <div className="relative overflow-hidden border border-outline bg-graphite px-8 py-20 md:px-16 md:py-28">
        {/* Resplandor volt desde abajo */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 130%, rgba(210,243,76,0.28), transparent 60%)' }}
        />
        {/* Marca de agua */}
        <Dumbbell className="absolute -right-12 -bottom-12 text-volt/5 rotate-12" size={300} strokeWidth={1} />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="text-volt text-[11px] font-bold uppercase tracking-[0.35em]">{content.kicker}</span>
          <h2 className="mt-4 font-anton text-5xl md:text-7xl uppercase leading-[0.9]">{content.title}</h2>
          <p className="mt-6 mx-auto max-w-lg text-muted md:text-lg leading-relaxed">{content.text}</p>
          <div className="mt-10 flex justify-center">
            <Link to={content.to}>
              <Button size="md">
                {content.cta} {content.icon}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
