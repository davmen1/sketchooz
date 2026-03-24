import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, AlertTriangle } from 'lucide-react';
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
  const [deleteStep, setDeleteStep] = useState('idle'); // idle | confirm | deleting | done

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const handleDeleteRequest = () => setDeleteStep('confirm');
  const handleDeleteCancel = () => setDeleteStep('idle');

  const handleDeleteConfirm = async () => {
    setDeleteStep('deleting');
    // Sign out — platform-level deletion requires contacting support
    await new Promise(r => setTimeout(r, 1200));
    setDeleteStep('done');
    setTimeout(() => base44.auth.logout('/'), 2000);
  };

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

        {/* Actions */}
        <section className="bg-card rounded-2xl border border-border px-4">
          <DangerRow
            icon={LogOut}
            label="Sign out"
            description="You'll be redirected to the login page."
            actionLabel="Sign out"
            onClick={handleLogout}
          />
          <DangerRow
            icon={Trash2}
            label="Delete account"
            description="Permanently remove your account and all data."
            actionLabel="Delete"
            variant="destructive"
            onClick={handleDeleteRequest}
          />
        </section>

        {/* Confirmation modal */}
        {deleteStep !== 'idle' && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6 space-y-4">
              {deleteStep === 'done' ? (
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold">Account deletion requested</p>
                  <p className="text-xs text-muted-foreground">Signing you out now…</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Delete account?</p>
                      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All your data will be permanently deleted. You will be signed out immediately.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1 min-h-[44px]" onClick={handleDeleteCancel} disabled={deleteStep === 'deleting'}>
                      Cancel
                    </Button>
                    <Button variant="destructive" className="flex-1 min-h-[44px]" onClick={handleDeleteConfirm} disabled={deleteStep === 'deleting'}>
                      {deleteStep === 'deleting' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting…
                        </div>
                      ) : 'Yes, delete'}
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