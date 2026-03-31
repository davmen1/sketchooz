import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY = [
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/3248bc783_WhatsAppImage2026-03-31at121054.jpeg',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/ae7ccd57d_154513d86_generated_image.png',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/2a83889ca_sketchforge-render1.png',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/cc05b30b8_b4db17f7a_generated_image.png',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/b80210e0f_WhatsAppImage2026-03-31at120211.jpeg',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/5e4300c0f_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg',
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
    <section className="bg-card border-t border-border py-12 text-center px-6">
      <h2 className="text-2xl font-bold mb-2">Pronto a provarlo?</h2>
      <p className="text-muted-foreground text-sm mb-8">Registrati gratuitamente e genera il tuo primo sketch.</p>

      {/* Gallery strip */}
      <div className="relative flex items-center justify-center mb-8 select-none max-w-2xl mx-auto">
        <button
          onClick={prev}
          className="absolute left-0 z-10 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition flex items-center justify-center text-foreground"
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
                className="cursor-pointer rounded-md overflow-hidden shrink-0 transition-all duration-700 ease-in-out"
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
          className="absolute right-0 z-10 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition flex items-center justify-center text-foreground"
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