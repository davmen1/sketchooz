import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/lib/LangContext';

export default function PromoDialog({ open, onOpenChange, onApply }) {
  const { lang } = useLang();
  const it = lang === 'it';
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(code.trim().toUpperCase());
    setCode('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>🎟️ {it ? 'Codice promozionale' : 'Promo code'}</DialogTitle>
          <DialogDescription>{it ? 'Inserisci il tuo codice promo per sbloccare i render gratuiti.' : 'Enter your promo code to unlock free renders.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={it ? 'Es. WANNATRY1' : 'E.g. WANNATRY1'}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {it ? 'Annulla' : 'Cancel'}
            </Button>
            <Button type="submit" className="flex-1" disabled={!code.trim()}>
              {it ? 'Applica' : 'Apply'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}