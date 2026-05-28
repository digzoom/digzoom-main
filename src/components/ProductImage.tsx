import { useState, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "3/4", "1/1", "16/9"
}

export default function ProductImage({
  src,
  alt,
  className = '',
  aspectRatio = '3/4',
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-[#1A1F2E] ${className}`}
      style={{ aspectRatio }}
    >
      {/* Placeholder skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1A1F2E] to-[#232838]" />
      )}

      {/* Error fallback */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
          <ImageIcon className="w-8 h-8 mb-1" />
          <span className="text-[10px]">No Image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}
