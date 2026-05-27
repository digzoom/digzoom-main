import { useEffect, useRef } from 'react';

export default function AnimatedBackground({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, animId = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = Math.max(window.innerHeight, 1200);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Subtle particles
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    // Slow-moving glowing orbs
    const orbs: { x: number; y: number; r: number; dx: number; dy: number; hue: number }[] = [
      { x: w * 0.2, y: h * 0.3, r: 180, dx: 0.15, dy: 0.08, hue: 260 },
      { x: w * 0.8, y: h * 0.6, r: 150, dx: -0.12, dy: 0.1, hue: 280 },
      { x: w * 0.5, y: h * 0.8, r: 120, dx: 0.08, dy: -0.06, hue: 300 },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw subtle connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Draw slow-moving orbs
      orbs.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r || orb.x > w + orb.r) orb.dx *= -1;
        if (orb.y < -orb.r || orb.y > h + orb.r) orb.dy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, 0.06)`);
        grad.addColorStop(0.5, `hsla(${orb.hue}, 60%, 50%, 0.02)`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`relative min-h-screen bg-[#0a0a0f] overflow-hidden ${className}`}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.006) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.006) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          zIndex: 1,
        }}
      />

      {/* Canvas: particles + orbs */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
      />

      {/* DigZoom Tiger Watermark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          bottom: '-5%',
          right: '-8%',
          width: '50vw',
          maxWidth: '500px',
          opacity: 0.035,
          zIndex: 3,
          mixBlendMode: 'screen',
        }}
      >
        <img
          src="/images/digzoom-brand.jpg"
          alt=""
          className="w-full h-auto"
          draggable={false}
        />
      </div>

      {/* Content */}
      {children && (
        <div className="relative" style={{ zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}
