import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, AlertTriangle, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/MobileHeader';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

function DangerRow({ icon: Icon, label, description, actionLabel, variant = 'outline', onClick }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Button variant={variant} size="sm" onClick={onClick} className="shrink-0 min-h-[44px]">
        {actionLabel}
      </Button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { forceDark, setForceOverride } = useTheme();
  const [deleteStep, setDeleteStep] = useState('idle'); // idle | confirm | instructions

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const handleDeleteRequest = () => setDeleteStep('confirm');
  const handleDeleteCancel = () => setDeleteStep('idle');
  const handleDeleteConfirm = () => setDeleteStep('instructions');

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title="Settings" subtitle="Account & preferences" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* Account Info */}
        <section className="bg-card rounded-2xl border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Account</p>
          <p className="text-sm font-medium mt-2">{user?.full_name || '—'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
        </section>

        {/* Appearance */}
        <section className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Aspetto</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{forceDark ? 'Modalità scura' : 'Modalità chiara'}</p>
                <p className="text-xs text-muted-foreground">{forceDark ? 'Tema scuro attivo' : 'Tema chiaro attivo'}</p>
              </div>
            </div>
            <button
              onClick={() => setForceOverride(!forceDark)}
              className={`relative w-12 h-6 rounded-full transition-colors ${forceDark ? 'bg-accent' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${forceDark ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </section>

        {/* Actions */}
        <section className="bg-card rounded-2xl border border-border px-4">
          <DangerRow
            icon={LogOut}
            label="Esci"
            description="Verrai reindirizzato alla pagina di login."
            actionLabel="Esci"
            onClick={handleLogout}
          />
          <DangerRow
            icon={Trash2}
            label="Elimina account"
            description="Rimuovi permanentemente account e dati."
            actionLabel="Elimina"
            variant="destructive"
            onClick={handleDeleteRequest}
          />
        </section>

        {/* Confirmation modal */}
        {deleteStep !== 'idle' && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6 space-y-4">

              {deleteStep === 'instructions' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Trash2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Come eliminare il tuo account</p>
                      <p className="text-xs text-muted-foreground">La richiesta viene gestita via email</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Per eliminare definitivamente il tuo account e tutti i dati associati, contattaci a:
                  </p>
                  <a
                    href={`mailto:support@sketchforge.app?subject=Richiesta%20eliminazione%20account&body=Ciao%2C%20vorrei%20eliminare%20il%20mio%20account%3A%20${encodeURIComponent(user?.email || '')}`}
                    className="block w-full text-center px-4 py-3 rounded-xl bg-foreground text-background text-sm font-semibold"
                  >
                    support@sketchforge.app
                  </a>
                  <p className="text-[10px] text-muted-foreground">
                    Includi l'email del tuo account nel messaggio. L'eliminazione viene processata entro 48h.
                  </p>
                  <Button variant="outline" className="w-full min-h-[44px]" onClick={handleDeleteCancel}>
                    Chiudi
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Eliminare l'account?</p>
                      <p className="text-xs text-muted-foreground">Questa azione non è reversibile.</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tutti i tuoi dati verranno eliminati permanentemente.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1 min-h-[44px]" onClick={handleDeleteCancel}>
                      Annulla
                    </Button>
                    <Button variant="destructive" className="flex-1 min-h-[44px]" onClick={handleDeleteConfirm}>
                      Continua
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}