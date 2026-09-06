import { useEffect, useState } from 'react';

/**
 * Scroll-driven floating widgets that move as the user scrolls.
 * Uses scroll progress to translate/rotate decorative elements.
 */
export default function ScrollWidgets() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(y);
      setScrollProgress(max > 0 ? y / max : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const widgets = [
    { baseTop: 15, baseLeft: 3, speedY: 0.3, speedX: 0.15, rot: -8, emoji: '◎', label: 'Scan', color: 'bg-blue-100 text-blue-600 border-blue-200', size: 'w-16 h-16' },
    { baseTop: 40, baseRight: 3, speedY: -0.2, speedX: 0.1, rot: 12, emoji: '★', label: 'Rate', color: 'bg-sky-100 text-sky-600 border-sky-200', size: 'w-14 h-14' },
    { baseTop: 65, baseLeft: 2, speedY: 0.25, speedX: -0.1, rot: 6, emoji: '⚡', label: 'Fast', color: 'bg-cyan-100 text-cyan-600 border-cyan-200', size: 'w-16 h-16' },
    { baseTop: 85, baseRight: 4, speedY: -0.15, speedX: 0.2, rot: -5, emoji: '✓', label: 'True', color: 'bg-blue-100 text-blue-600 border-blue-200', size: 'w-14 h-14' },
    { baseTop: 25, baseLeft: 5, speedY: 0.4, speedX: 0.08, rot: 15, emoji: '♥', label: 'Love', color: 'bg-sky-100 text-sky-600 border-sky-200', size: 'w-12 h-12' },
    { baseTop: 55, baseRight: 2, speedY: -0.3, speedX: -0.05, rot: -10, emoji: '◉', label: '360', color: 'bg-cyan-100 text-cyan-600 border-cyan-200', size: 'w-16 h-16' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
      {widgets.map((w, i) => {
        const offsetY = scrollY * w.speedY;
        const offsetX = scrollProgress * 100 * w.speedX;
        const rotation = w.rot + scrollProgress * 20 * (i % 2 === 0 ? 1 : -1);
        const opacity = 0.5 + Math.sin(scrollProgress * Math.PI * 2 + i) * 0.2;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${w.baseTop}%`,
              left: w.baseLeft !== undefined ? `${w.baseLeft}%` : undefined,
              right: w.baseRight !== undefined ? `${w.baseRight}%` : undefined,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
              opacity,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div className={`${w.size} flex flex-col items-center justify-center rounded-2xl border-2 ${w.color} shadow-md`}>
              <span className="text-2xl">{w.emoji}</span>
              <span className="text-[10px] font-bold mt-0.5">{w.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
