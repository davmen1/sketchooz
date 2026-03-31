import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Industrial design marker sketches
const GALLERY = [
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/f8eba66d2_Gemini_Generated_Image_vvcje0vvcje0vvcj.jpg',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/5e4300c0f_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg',
  'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600&q=80',
  'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=600&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
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

  const getSlots = () => [-2, -1, 0, 1, 2].map(offset => ({
    index: (current + offset + n) % n,
    offset,
  }));

  return (
    <section className="bg-black border-t border-white/10 py-12 text-center px-6">
      <h2 className="text-2xl font-bold text-white mb-2">Pronto a provarlo?</h2>
      <p className="text-white/50 text-sm mb-8">Registrati gratuitamente e genera il tuo primo sketch.</p>

      {/* Gallery strip */}
      <div className="relative flex items-center justify-center mb-8 select-none max-w-2xl mx-auto">
        <button
          onClick={prev}
          className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 transition flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 w-full px-10">
          {getSlots().map(({ index, offset }) => {
            const isCenter = offset === 0;
            const isNear = Math.abs(offset) === 1;
            return (
              <div
                key={`${index}-${offset}`}
                onClick={() => { setCurrent(index); resetTimer(); }}
                className="cursor-pointer rounded-md overflow-hidden shrink-0 transition-all duration-500"
                style={{
                  width: isCenter ? 180 : isNear ? 120 : 80,
                  height: isCenter ? 120 : isNear ? 80 : 55,
                  opacity: isCenter ? 1 : isNear ? 0.55 : 0.25,
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

        <button
          onClick={next}
          className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 transition flex items-center justify-center text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <Button onClick={onLogin} size="lg" className="gap-2 font-semibold rounded-xl px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
        <ArrowRight className="w-4 h-4" /> Accedi con Google
      </Button>
    </section>
  );
}