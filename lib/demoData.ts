export interface DemoUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface DemoEvaluation {
  id: string;
  created_at: string;
  outputs: Record<string, unknown>;
}

export interface DemoEvaluationInput {
  description: string;
  applications?: string;
  timeRequired: string;
  frequency: string;
  stakeholder: string;
}

export interface DemoPrompts {
  compliance?: string;
  businessValue?: string;
  toolsAutomation?: string;
}

const baseUser: DemoUser = {
  id: 'demo-user-id',
  email: 'demo@aisolutionfinder.local',
  role: 'admin'
};

const defaultPrompts: DemoPrompts = {
  compliance:
    'Bewerte die DSGVO- und EU-AI-Act-Konformität des beschriebenen Prozesses. Gib klare Einschätzungen und nenne relevante Artikel.',
  businessValue:
    'Schätze den betriebswirtschaftlichen Nutzen einer Automatisierung. Liefere eine Punktzahl von 1-100 und einen kurzen Absatz.',
  toolsAutomation:
    'Empfehle passende Automatisierungstools und begründe kurz warum sie geeignet sind.'
};

const defaultEvaluations: DemoEvaluation[] = [
  {
    id: 'demo-eval-1',
    created_at: new Date('2024-04-12T08:15:00Z').toISOString(),
    outputs: {
      compliance: {
        gdpr_status: 'Konform',
        gdpr_section: 'Artikel 6 DSGVO – Rechtmäßigkeit der Verarbeitung',
        ai_act_status: 'Geringes Risiko',
        ai_act_section: 'Titel III Kapitel 1',
        explanations: {
          gdpr:
            'Die Verarbeitung stützt sich auf berechtigte Interessen. Achten Sie auf transparente Kommunikation und ein Widerspruchsrecht.',
          ai_act:
            'Das System fällt unter Anwendungen mit geringem Risiko. Dokumentieren Sie dennoch Datenquellen und Überwachungsmechanismen.'
        }
      },
      businessValue: {
        score: 72,
        narrative:
          'Durch Automatisierung der wiederkehrenden Datenerfassung spart das Team wöchentlich mehrere Stunden und reduziert Fehlerquoten.'
      },
      tools: {
        recommendations: [
          {
            tool: 'Make.com',
            reason: 'Einfache Workflows zwischen CRM und Tabellenkalkulation ohne eigene Infrastruktur aufbauen.'
          },
          {
            tool: 'Microsoft Power Automate',
            reason: 'Nahtlose Integration in bestehende Microsoft 365 Prozesse mit Governance-Funktionen.'
          }
        ]
      }
    }
  }
];

let promptsStore: DemoPrompts = { ...defaultPrompts };
let evaluationsStore: DemoEvaluation[] = [...defaultEvaluations];

export const demoUser = baseUser;

export const getDemoPrompts = () => promptsStore;
export const setDemoPrompts = (prompts: DemoPrompts) => {
  promptsStore = { ...prompts };
};

export const listDemoEvaluations = () => evaluationsStore;
export const addDemoEvaluation = (evaluation: DemoEvaluation) => {
  evaluationsStore = [evaluation, ...evaluationsStore];
};

export const resetDemoData = () => {
  promptsStore = { ...defaultPrompts };
  evaluationsStore = [...defaultEvaluations];
};

const truncate = (text: string, length: number) => {
  if (text.length <= length) {
    return text;
  }
  return `${text.slice(0, length).trim()}…`;
};

export const createDemoEvaluation = (input: DemoEvaluationInput): DemoEvaluation => {
  const now = new Date();
  const id = `demo-eval-${now.getTime()}`;
  const scoreBase = Math.min(95, 55 + Math.floor(input.description.length / 3));
  const outputs = {
    compliance: {
      gdpr_status: 'Konform mit Auflagen',
      gdpr_section: 'Artikel 30 DSGVO – Verzeichnis von Verarbeitungstätigkeiten',
      ai_act_status: 'Beobachtung empfohlen',
      ai_act_section: 'Titel III Kapitel 2',
      explanations: {
        gdpr: `Dokumentiere den Prozess detailliert und führe Datenschutz-Folgenabschätzungen für kritische Schritte durch (${truncate(
          input.description,
          80
        )}).`,
        ai_act: 'Überwache Trainingsdaten und Feedback-Schleifen, um Verzerrungen frühzeitig zu erkennen.'
      }
    },
    businessValue: {
      score: scoreBase,
      narrative: `Automatisierung reduziert den manuellen Aufwand (${input.timeRequired}) für Stakeholder ${input.stakeholder} und vermeidet wiederholte Fehler.`
    },
    tools: {
      recommendations: [
        {
          tool: 'Zapier',
          reason: `Schnelles Verbinden von ${input.applications || 'bestehenden Tools'} ohne Code mit umfangreicher Bibliothek.`
        },
        {
          tool: 'Custom GPT Workflow',
          reason: 'Flexible Kombination aus LLM-Analyse und menschlicher Freigabe über ein zentrales Dashboard.'
        }
      ]
    }
  };
  const evaluation: DemoEvaluation = {
    id,
    created_at: now.toISOString(),
    outputs
  };
  addDemoEvaluation(evaluation);
  return evaluation;
};
