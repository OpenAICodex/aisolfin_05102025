"use client";
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { isSupabaseConfigured } from '@/lib/env';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const supabaseReady = isSupabaseConfigured();

  // Send a magic link to the provided email address. The redirect
  // target points to the auth callback route which will exchange the
  // one‑time code for a session.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!supabaseReady) {
      try {
        const res = await fetch('/api/demo-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        });
        if (!res.ok) {
          const data = await res.json();
          alert(data?.error ?? 'Demo-Anmeldung fehlgeschlagen');
          return;
        }
        router.replace('/');
      } catch (err) {
        console.error(err);
        alert('Demo-Anmeldung nicht möglich');
      }
      return;
    }
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setSubmitted(true);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-md bg-gradient-to-r from-purple-600 to-purple-500 flex items-center justify-center text-3xl border-2 border-black mb-4">
            🧠
          </div>
          <h2 className="text-3xl font-bold text-center mb-1">Willkommen!</h2>
          <p className="text-sm text-gray-700 text-center">Melde dich an, um deine Prozesse zu analysieren.</p>
        </div>
        {!supabaseReady ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-purple-400 bg-purple-50 p-4 rounded-md text-sm text-purple-900">
              <p className="font-semibold mb-1">Demo-Modus aktiv</p>
              <p>
                Supabase ist nicht konfiguriert. Melde dich mit einer beliebigen E‑Mail an. Verwende{' '}
                <code>admin@demo.ai</code>, um die Admin-Oberfläche zu testen.
              </p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                E‑Mail Adresse
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-center rounded-md border-2 border-black bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600"
            >
              Demo-Zugang starten
            </button>
          </form>
        ) : submitted ? (
          <p className="text-center text-gray-700">Wir haben dir einen Magic‑Link per E‑Mail geschickt. Bitte überprüfe dein Postfach.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                E‑Mail Adresse
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-center rounded-md border-2 border-black bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600"
            >
              Magic‑Link senden
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Mit der Anmeldung akzeptierst du unsere{' '}
            <a href="#" className="underline hover:text-purple-600">
              Nutzungsbedingungen
            </a>{' '}
            und{' '}
            <a href="#" className="underline hover:text-purple-600">
              Datenschutzrichtlinie
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}