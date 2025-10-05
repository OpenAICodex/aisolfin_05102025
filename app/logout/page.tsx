"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { isSupabaseConfigured } from '@/lib/env';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabaseBrowser.auth.signOut().finally(() => {
        router.replace('/login');
      });
      return;
    }
    fetch('/api/demo-auth', { method: 'DELETE' })
      .catch((err) => {
        console.error('Demo-Abmeldung fehlgeschlagen', err);
      })
      .finally(() => {
        router.replace('/login');
      });
  }, [router]);
  return <p className="p-4">Abmelden…</p>;
}