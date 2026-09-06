import { useEffect, useRef, useState } from 'react';
import { Star, Heart, Zap, Shield, Award, Sparkles, type LucideIcon } from 'lucide-react';

/**
 * Icons that react to cursor proximity. When the mouse moves close to an icon,
 * it tilts and shifts away from the cursor, creating an interactive magnetic effect.
 */
const ICONS: { Icon: LucideIcon; className: string; color: string; size: number }[] = [
  { Icon: Star, className: 'top-[12%] left-[6%]', color: 'text-blue-300', size: 28 },
  { Icon: Heart, className: 'top-[20%] right-[8%]', color: 'text-sky-300', size: 24 },
  { Icon: Zap, className: 'top-[45%] left-[4%]', color: 'text-cyan-300', size: 26 },
  { Icon: Shield, className: 'top-[60%] right-[6%]', color: 'text-blue-300', size: 30 },
  { Icon: Award, className: 'top-[78%] left-[7%]', color: 'text-sky-300', size: 24 },
  { Icon: Sparkles, className: 'top-[35%] right-[5%]', color: 'text-cyan-300', size: 22 },
  { Icon: Star, className: 'top-[88%] right-[10%]', color: 'text-blue-300', size: 20 },
  { Icon: Heart, className: 'top-[50%] left-[10%]', color: 'text-sky-300', size: 20 },
];

export default function CursorIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 hidden md:block">
      {ICONS.map((cfg, i) => {
        const Icon = cfg.Icon;
        return (
          <CursorIcon
            key={i}
            Icon={Icon}
            className={cfg.className}
            color={cfg.color}
            size={cfg.size}
            mousePos={mousePos}
          />
        );
      })}
    </div>
  );
}

function CursorIcon({
  Icon,
  className,
  color,
  size,
  mousePos,
}: {
  Icon: LucideIcon;
  className: string;
  color: string;
  size: number;
  mousePos: { x: number; y: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 150;

    if (dist < threshold) {
      const force = (1 - dist / threshold) * 30;
      const angle = Math.atan2(dy, dx);
      const moveX = -Math.cos(angle) * force;
      const moveY = -Math.sin(angle) * force;
      const rot = (dx / threshold) * 25;
      setTransform(`translate(${moveX}px, ${moveY}px) rotate(${rot}deg) scale(1.3)`);
      setOpacity(0.8);
    } else {
      setTransform('');
      setOpacity(0.3);
    }
  }, [mousePos]);

  return (
    <div
      ref={ref}
      className={`absolute ${className}`}
      style={{
        transform,
        opacity,
        transition: 'transform 0.15s ease-out, opacity 0.3s ease',
      }}
    >
      <Icon className={color} size={size} />
    </div>
  );
}
