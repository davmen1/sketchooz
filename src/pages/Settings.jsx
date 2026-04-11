import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, AlertTriangle, Moon, Globe, ExternalLink, Zap } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/MobileHeader';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LangContext';

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
  const { isDark, toggleTheme } = useTheme();
  const { lang } = useLang();
  const [deleteStep, setDeleteStep] = useState('idle');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('reducedMotion') === 'true');

  const applyReducedMotion = (val) => {
    localStorage.setItem('reducedMotion', val);
    if (val) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    setReducedMotion(val);
  };
  const [textSize, setTextSize] = useState(() => localStorage.getItem('textSize') || 'medium');

  const applyTextSize = (size) => {
    const map = { small: '14px', medium: '16px', large: '19px' };
    document.documentElement.style.fontSize = map[size];
    localStorage.setItem('textSize', size);
    setTextSize(size);
  };
  const [deleteLoading, setDeleteLoading] = useState(false);

  const s = lang === 'en' ? {
    title: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    darkActive: 'Dark theme active',
    lightActive: 'Light theme active',
    info: 'Info',
    visitSite: 'Visit sketchooz.com for info & more',
    logout: 'Log out',
    logoutDesc: 'You will be redirected to the login page.',
    deleteAccount: 'Delete account',
    deleteDesc: 'Permanently remove your account and data.',
    deleteAction: 'Delete',
    requestSent: 'Request sent',
    requestSentDesc: 'Your account will be deleted within 48h',
    requestSentBody: 'We received your deletion request for',
    requestSentBody2: '. You will receive a confirmation email.',
    close: 'Close',
    confirmDelete: 'Confirm deletion',
    confirmDeleteDesc: 'You are about to permanently delete your account',
    confirmDeleteBody: 'All your data, credits and renders associated to',
    confirmDeleteBody2: 'will be permanently and irreversibly deleted.',
    cancel: 'Cancel',
    deleting: 'Sending...',
    deleteBtn: 'Delete account',
    deleteQuestion: 'Delete account?',
    deleteIrreversible: 'This action is irreversible.',
    deleteAll: 'All your data will be permanently deleted.',
    continue: 'Continue',
  } : {
    title: 'Impostazioni',
    appearance: 'Aspetto',
    darkMode: 'Modalità scura',
    lightMode: 'Modalità chiara',
    darkActive: 'Tema scuro attivo',
    lightActive: 'Tema chiaro attivo',
    info: 'Info',
    visitSite: 'Visita sketchooz.com per info & altro',
    logout: 'Esci',
    logoutDesc: 'Verrai reindirizzato alla pagina di login.',
    deleteAccount: 'Elimina account',
    deleteDesc: 'Rimuovi permanentemente account e dati.',
    deleteAction: 'Elimina',
    requestSent: 'Richiesta inviata',
    requestSentDesc: 'Il tuo account verrà eliminato entro 48h',
    requestSentBody: 'Abbiamo ricevuto la tua richiesta di eliminazione per',
    requestSentBody2: '. Riceverai una conferma via email.',
    close: 'Chiudi',
    confirmDelete: 'Conferma eliminazione',
    confirmDeleteDesc: 'Stai per eliminare definitivamente il tuo account',
    confirmDeleteBody: 'Tutti i tuoi dati, crediti e render associati a',
    confirmDeleteBody2: 'verranno eliminati in modo permanente e irreversibile.',
    cancel: 'Annulla',
    deleting: 'Invio...',
    deleteBtn: 'Elimina account',
    deleteQuestion: "Eliminare l'account?",
    deleteIrreversible: 'Questa azione non è reversibile.',
    deleteAll: 'Tutti i tuoi dati verranno eliminati permanentemente.',
    continue: 'Continua',
  };

  const handleLogout = () => { base44.auth.logout('/'); };
  const handleDeleteRequest = () => setDeleteStep('confirm');
  const handleDeleteCancel = () => { setDeleteStep('idle'); setDeleteLoading(false); };
  const handleDeleteConfirm = () => setDeleteStep('instructions');
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      await base44.functions.invoke('requestAccountDeletion', { email: user?.email });
    } catch (_) {}
    setDeleteStep('requested');
    setDeleteLoading(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title={s.title} subtitle="Account & preferences" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* Account Info */}
        <section className="bg-card rounded-2xl border border-border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Account</p>
          <p className="text-sm font-medium mt-2">{user?.full_name || '—'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
        </section>

        {/* Appearance */}
        <section className="bg-card rounded-2xl border border-border p-4 space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s.appearance}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{isDark ? s.darkMode : s.lightMode}</p>
                <p className="text-xs text-muted-foreground">{isDark ? s.darkActive : s.lightActive}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-accent' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          {/* Text size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 text-base font-bold text-muted-foreground">
                A
              </div>
              <div>
                <p className="text-sm font-medium">{lang === 'it' ? 'Dimensione testo' : 'Text size'}</p>
                <p className="text-xs text-muted-foreground">{lang === 'it' ? 'Piccolo · Normale · Grande' : 'Small · Normal · Large'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[['small', 'A-', 'text-xs'], ['medium', 'A', 'text-sm'], ['large', 'A+', 'text-base']].map(([size, label, cls]) => (
                <button
                  key={size}
                  onClick={() => applyTextSize(size)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-colors ${cls} ${
                    textSize === size
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced motion */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lang === 'it' ? 'Movimento ridotto' : 'Reduce motion'}</p>
                </div>
              </div>
              <button
                onClick={() => applyReducedMotion(!reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-accent' : 'bg-muted'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${reducedMotion ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-12">
              {lang === 'it'
                ? 'Disattiva animazioni e transizioni. Utile per chi è sensibile al movimento o soffre di vertigini.'
                : 'Disables animations and transitions. Useful for those sensitive to motion or prone to dizziness.'}
            </p>
          </div>
        </section>

        {/* Info & Website */}
        <section className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s.info}</p>
          <a
            href="https://www.sketchooz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">sketchooz.com</p>
                <p className="text-xs text-muted-foreground">{s.visitSite}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        </section>

        {/* Actions */}
        <section className="bg-card rounded-2xl border border-border px-4">
          <DangerRow
            icon={LogOut}
            label={s.logout}
            description={s.logoutDesc}
            actionLabel={s.logout}
            onClick={handleLogout}
          />
          <DangerRow
            icon={Trash2}
            label={s.deleteAccount}
            description={s.deleteDesc}
            actionLabel={s.deleteAction}
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

              {deleteStep === 'requested' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Trash2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.requestSent}</p>
                      <p className="text-xs text-muted-foreground">{s.requestSentDesc}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.requestSentBody} <strong>{user?.email}</strong>{s.requestSentBody2}
                  </p>
                  <Button variant="outline" className="w-full min-h-[44px]" onClick={handleDeleteCancel}>
                    {s.close}
                  </Button>
                </div>
              ) : deleteStep === 'instructions' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.confirmDelete}</p>
                      <p className="text-xs text-muted-foreground">{s.confirmDeleteDesc}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.confirmDeleteBody} <strong>{user?.email}</strong> {s.confirmDeleteBody2}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1 min-h-[44px]" onClick={handleDeleteCancel} disabled={deleteLoading}>
                      {s.cancel}
                    </Button>
                    <Button variant="destructive" className="flex-1 min-h-[44px]" onClick={handleDeleteSubmit} disabled={deleteLoading}>
                      {deleteLoading ? s.deleting : s.deleteBtn}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.deleteQuestion}</p>
                      <p className="text-xs text-muted-foreground">{s.deleteIrreversible}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.deleteAll}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1 min-h-[44px]" onClick={handleDeleteCancel}>
                      {s.cancel}
                    </Button>
                    <Button variant="destructive" className="flex-1 min-h-[44px]" onClick={handleDeleteConfirm}>
                      {s.continue}
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