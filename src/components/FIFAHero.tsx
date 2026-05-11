import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: "A JORNADA COMEÇA",
    subtitle: "Rumo ao Hexa em 2026",
    bg: "bg-[#fedd00]",
    text: "text-zinc-950",
    accent: "bg-[#009739]",
    pattern: "opacity-10",
    description: "Colecione a história da Seleção Brasileira no maior palco do mundo."
  },
  {
    id: 2,
    title: "ESTILO BRASIL",
    subtitle: "Inovação & Tradição",
    bg: "bg-[#002395]",
    text: "text-white",
    accent: "bg-[#009739]",
    pattern: "nike-pattern",
    description: "O azul da vitória com o padrão icônico da nossa floresta."
  },
  {
    id: 3,
    title: "ORGULHO NACIONAL",
    subtitle: "980 Figurinhas para Dominar",
    bg: "bg-[#009739]",
    text: "text-white",
    accent: "bg-[#fedd00]",
    pattern: "opacity-20",
    description: "Cada craque, cada estádio, cada momento capturado."
  }
];

export default function FIFAHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-[2.5rem] mb-12 border border-white/5 shadow-2xl group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          } ${slide.bg}`}
        >
          {/* Patterns */}
          {slide.pattern === 'nike-pattern' ? (
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #009739 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#009739]/10 to-transparent rotate-45 transform scale-150" />
            </div>
          ) : (
            <div className={`absolute inset-0 ${slide.pattern} bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`} />
          )}

          {/* Dynamic Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className={`px-4 py-1 ${slide.accent} ${slide.text === 'text-white' ? 'text-zinc-950' : 'text-white'} font-black text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 transform -skew-x-12 animate-pulse`}>
              Official 2026 Experience
            </div>
            
            <h2 className={`text-5xl md:text-8xl font-black ${slide.text} tracking-tighter italic uppercase leading-none drop-shadow-2xl mb-2 transform -skew-x-12 transition-all duration-700 delay-100 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {slide.title}
            </h2>
            
            <p className={`text-xl md:text-3xl font-bold ${slide.text} opacity-80 italic uppercase tracking-tight mb-8 transform -skew-x-12 transition-all duration-700 delay-200 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {slide.subtitle}
            </p>

            <div className={`max-w-md text-sm md:text-base ${slide.text} opacity-60 font-medium leading-relaxed transition-all duration-700 delay-300 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {slide.description}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 rounded-full ${
              i === current ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Side Decorative Bars */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </div>
  );
}
