import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const respond = <T>(data: T) => Promise.resolve({ data, error: null } as const);

const buildQueryBuilder = (data: unknown) => {
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    single: () => respond(Array.isArray(data) ? (data.length > 0 ? data[0] : null) : data ?? null),
    order: () => respond(Array.isArray(data) ? data : data ? [data] : []),
    insert: () => respond(null),
    upsert: () => respond(null),
    update: () => respond(null),
    delete: () => respond(null)
  };
  return builder;
};

const demoEvaluations = [
  {
    id: 'demo-eval-1',
    created_at: new Date('2024-05-01T09:15:00Z').toISOString(),
    outputs: {
      compliance: {
        gdpr_status: 'green',
        gdpr_section: 'Art. 6 Abs. 1 lit. b DSGVO',
        ai_act_status: 'ok',
        ai_act_section: 'Art. 10 Abs. 2 EU AI Act',
        explanations: {
          gdpr: 'Demo-Auswertung: Die Verarbeitung stützt sich auf ein berechtigtes Interesse mit geeigneten Schutzmaßnahmen.',
          ai_act: 'Demo-Auswertung: Der Prozess erfüllt die Transparenzanforderungen für geringe Risikostufen.'
        }
      },
      businessValue: {
        score: 72,
        narrative: 'Demo-Ergebnis: Automatisierung spart ca. 4 Stunden pro Woche und verbessert die Prozessqualität messbar.'
      },
      tools: {
        recommendations: [
          { tool: 'Zapier', reason: 'Verknüpft Formular-Eingaben mit CRM und versendet automatische Benachrichtigungen.' },
          { tool: 'Make', reason: 'Ermöglicht komplexe Workflows mit bedingten Verzweigungen ohne Programmierkenntnisse.' }
        ]
      }
    }
  },
  {
    id: 'demo-eval-2',
    created_at: new Date('2024-04-18T14:45:00Z').toISOString(),
    outputs: {
      compliance: {
        gdpr_status: 'yellow',
        gdpr_section: 'Art. 30 DSGVO',
        ai_act_status: 'warning',
        ai_act_section: 'Art. 9 EU AI Act',
        explanations: {
          gdpr: 'Demo-Auswertung: Dokumentation der Verarbeitungstätigkeiten sollte erweitert werden.',
          ai_act: 'Demo-Auswertung: Zusätzliche Risikobewertungen für menschliche Aufsicht empfohlen.'
        }
      },
      businessValue: {
        score: 55,
        narrative: 'Demo-Ergebnis: Mittelgroßes Einsparpotenzial; Pilotprojekt empfohlen, um Akzeptanz sicherzustellen.'
      },
      tools: {
        recommendations: [
          { tool: 'Notion', reason: 'Zentrale Wissensbasis mit Workflows für Freigaben und Dokumentation.' },
          { tool: 'Microsoft Power Automate', reason: 'Integration in bestehende Microsoft-Umgebungen mit Sicherheits-Compliance.' }
        ]
      }
    }
  }
];

const tableData: Record<string, unknown> = {
  profiles: { role: 'admin', email: 'demo@example.com' },
  evaluations: demoEvaluations,
  rate_limits: { date: new Date().toISOString().split('T')[0], count: 0 },
  admin_settings: {
    prompts: {
      compliance: 'Demo: Prüfe DSGVO- und EU-AI-Act-Konformität anhand bereitgestellter Prozessbeschreibung.',
      businessValue: 'Demo: Bewerte wirtschaftlichen Nutzen eines Automatisierungsprojekts anhand Aufwand und Frequenz.',
      toolsAutomation: 'Demo: Empfiehl geeignete Automatisierungstools für den Prozesskontext.'
    }
  }
};

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@example.com'
};

export const createDemoSupabaseClient = (): SupabaseClient<Database> => {
  return {
    auth: {
      getUser: async () => respond({ user: DEMO_USER }),
      getSession: async () => respond({ session: { user: DEMO_USER } }),
      signOut: async () => ({ error: null })
    } as any,
    from: (table: string) => buildQueryBuilder(tableData[table] ?? null),
    rpc: async () => respond([])
  } as unknown as SupabaseClient<Database>;
};

export const createDemoSupabaseBrowserClient = (): SupabaseClient<Database> => {
  return {
    auth: {
      signInWithOtp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ data: { session: { user: DEMO_USER }, user: DEMO_USER }, error: null }),
      getSession: async () => respond({ session: { user: DEMO_USER } })
    }
  } as unknown as SupabaseClient<Database>;
};

export const demoEvaluationsOutputs = demoEvaluations;
export const demoUserProfile = DEMO_USER;
