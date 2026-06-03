import LogoImage from './LogoImage';

export default function HeroLogo() {
  return (
    <div className="relative mb-6 flex justify-center">
      {/* Outer glow layer */}
      <div
        className="absolute inset-0 rounded-full blur-[60px] opacity-40 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(139,92,246,0.3) 50%, transparent 70%)',
        }}
      />

      {/* Logo container with mask and float */}
      <div className="relative animate-float">
        {/* Fade mask — merges edges with dark background */}
        <div
          className="absolute -inset-8 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.4) 70%, rgba(10,10,15,0.95) 100%)',
          }}
        />

        <LogoImage
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain relative z-10"
          alt="DigZoom"
        />
      </div>

      {/* Inner subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[40px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, #8B5CF6 100%)',
        }}
      />
    </div>
  );
}
