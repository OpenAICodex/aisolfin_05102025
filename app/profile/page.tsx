import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { isSupabaseConfigured } from '@/lib/env';
import { getDemoUserFromCookies } from '@/lib/demoSession';
import { listDemoEvaluations } from '@/lib/demoData';

type EvaluationRow = {
  id: string;
  created_at: string;
  outputs: Record<string, unknown> | null;
};

type ProfileContext = {
  email: string;
  evaluations: EvaluationRow[];
};

export default async function ProfilePage() {
  const context = await loadProfileContext();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Profil</h2>
        <a
          href="/"
          className="inline-flex items-center px-3 py-2 rounded-md border-2 border-black bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium hover:from-purple-700 hover:to-purple-600"
        >
          Neue Analyse
        </a>
      </div>
      <div className="p-4 border-4 border-black rounded-md bg-white shadow-lg">
        <p className="mb-2"><strong>E‑Mail:</strong> {context.email}</p>
        <p><strong>Gesamtanzahl Auswertungen:</strong> {context.evaluations.length}</p>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Vergangene Analysen</h3>
        {context.evaluations.length > 0 ? (
          <ul className="space-y-4">
            {context.evaluations.map((ev) => {
              const date = new Date(ev.created_at);
              const formatted = date.toLocaleString('de-DE', {
                timeZone: 'Europe/Berlin',
                dateStyle: 'medium',
                timeStyle: 'short'
              });
              let gdprStatus: string | undefined;
              let aiStatus: string | undefined;
              let score: number | undefined;
              if (ev.outputs) {
                const out: any = ev.outputs;
                gdprStatus = out?.compliance?.gdpr_status ?? out?.compliance?.gdpr?.lawful_basis;
                aiStatus = out?.compliance?.ai_act_status ?? out?.compliance?.ai_act_tier;
                score = out?.businessValue?.score;
              }
              return (
                <li key={ev.id} className="p-4 border-2 border-black rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  <p className="font-medium">{formatted}</p>
                  <p className="text-sm text-gray-700">
                    GDPR: {gdprStatus ?? '–'}, AI Act: {aiStatus ?? '–'}, Business Value:{' '}
                    {typeof score === 'number' ? score.toFixed(0) : '–'}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">Bisher wurden keine Analysen durchgeführt.</p>
        )}
      </div>
    </div>
  );
}

const loadProfileContext = async (): Promise<ProfileContext> => {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      redirect('/login');
    }
    const { data } = await supabase
      .from('evaluations')
      .select('id, created_at, outputs')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return {
      email: user.email ?? 'unbekannt',
      evaluations: (data as EvaluationRow[] | null) ?? []
    };
  }
  const demoUser = getDemoUserFromCookies();
  if (!demoUser) {
    redirect('/login');
  }
  return {
    email: demoUser.email,
    evaluations: listDemoEvaluations()
  };
};
