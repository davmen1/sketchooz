import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY = [
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/f8eba66d2_Gemini_Generated_Image_vvcje0vvcje0vvcj.jpg',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/5e4300c0f_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
];

export default function CTAGallery({ onLogin }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const n = GALLERY.length;

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % n);
    }, 5500);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => { setCurrent(p => (p - 1 + n) % n); resetTimer(); };
  const next = () => { setCurrent(p => (p + 1) % n); resetTimer(); };

  // Show 5 thumbnails: indices current-2, -1, 0, +1, +2
  const getSlots = () => [-2, -1, 0, 1, 2].map(offset => ({
    index: (current + offset + n) % n,
    offset,
  }));

  return (
    <section className="bg-black border-t border-border py-16 text-center px-6">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pronto a provarlo?</h2>
      <p className="text-white/60 text-sm mb-10">Registrati gratuitamente e genera il tuo primo sketch.</p>

      {/* Gallery strip */}
      <div className="relative flex items-center justify-center gap-0 mb-10 select-none">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-0 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Thumbnails */}
        <div className="flex items-center justify-center gap-3 overflow-hidden w-full max-w-2xl px-12">
          {getSlots().map(({ index, offset }) => {
            const isCenter = offset === 0;
            return (
              <div
                key={`${index}-${offset}`}
                onClick={() => { setCurrent(index); resetTimer(); }}
                className="cursor-pointer rounded-lg overflow-hidden shrink-0 transition-all duration-500"
                style={{
                  width: isCenter ? 200 : Math.abs(offset) === 1 ? 130 : 90,
                  height: isCenter ? 140 : Math.abs(offset) === 1 ? 90 : 65,
                  opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.3,
                  transform: isCenter ? 'scale(1)' : 'scale(0.95)',
                  boxShadow: isCenter ? '0 0 0 2px hsl(130 63% 57%)' : 'none',
                }}
              >
                <img
                  src={GALLERY[index]}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-0 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <Button onClick={onLogin} size="lg" className="gap-2 font-semibold rounded-xl px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
        <ArrowRight className="w-4 h-4" /> Accedi con Google
      </Button>
    </section>
  );
}