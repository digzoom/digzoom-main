// Direct import — Vite handles the path automatically on build
import tigerLogo from '@/assets/tiger-logo.png';

interface LogoImageProps {
  className?: string;
  alt?: string;
}

export default function LogoImage({ className = '', alt = 'DigZoom' }: LogoImageProps) {
  return (
    <img
      src={tigerLogo}
      alt={alt}
      className={className}
      loading="eager"
      draggable={false}
    />
  );
}

// Export the raw URL for use in places that need a string
export const logoUrl = tigerLogo;
