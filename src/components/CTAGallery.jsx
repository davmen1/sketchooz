import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const GALLERY = [
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/f8eba66d2_Gemini_Generated_Image_vvcje0vvcje0vvcj.jpg',
  'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/5e4300c0f_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
];

export default function CTAGallery({ onLogin }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % GALLERY.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-border py-20 text-center px-6 min-h-[320px] flex flex-col items-center justify-center">
      {/* Background gallery */}
      {GALLERY.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Pronto a provarlo?</h2>
        <p className="text-white/75 text-sm">Registrati gratuitamente e genera il tuo primo sketch.</p>
        <Button onClick={onLogin} size="lg" className="gap-2 font-semibold rounded-xl px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
          <ArrowRight className="w-4 h-4" /> Accedi con Google
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 flex gap-1.5 mt-6">
        {GALLERY.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}