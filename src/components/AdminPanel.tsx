import { useMemo, useState } from 'react';
import { Brain, LogOut, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type Question = {
  id: string;
  category: string;
  text: string;
};

type AdminPanelProps = {
  onLogout: () => void;
};

const defaultQuestions: Question[] = [
  {
    id: 'q1',
    category: 'Soziale Kommunikation',
    text: 'Mir fällt es schwer, Blickkontakt zu halten, ohne mich dabei unwohl zu fühlen.'
  },
  {
    id: 'q2',
    category: 'Sensorische Wahrnehmung',
    text: 'Bestimmte Geräusche oder Lichtquellen empfinde ich schneller als überwältigend.'
  },
  {
    id: 'q3',
    category: 'Masking & Kompensation',
    text: 'Ich spüre, dass ich im Alltag oft Rollen spiele, um dazuzugehören.'
  }
];

const categories = [
  'Soziale Kommunikation',
  'Masking & Kompensation',
  'Aufmerksamkeit',
  'Emotionale Steuerung',
  'Sensorische Wahrnehmung'
];

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [filter, setFilter] = useState('Alle Kategorien');
  const [newQuestion, setNewQuestion] = useState({ category: categories[0], text: '' });

  const filteredQuestions = useMemo(() => {
    if (filter === 'Alle Kategorien') return questions;
    return questions.filter((question) => question.category === filter);
  }, [filter, questions]);

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        category: newQuestion.category,
        text: newQuestion.text.trim()
      }
    ]);
    setNewQuestion((prev) => ({ ...prev, text: '' }));
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-28">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Admin-Dashboard</h1>
            <p className="text-sm text-slate-500">
              Verwalte Fragen, Kategorien und Inhalte der Screening-Tests. Änderungen werden in dieser Demo lokal gespeichert.
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Abmelden
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <PlusCircle className="h-5 w-5" />
                </span>
                Neue Frage hinzufügen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Kategorie</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Alle Kategorien', ...categories].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        if (category === 'Alle Kategorien') return;
                        setNewQuestion((prev) => ({ ...prev, category }));
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        newQuestion.category === category
                          ? 'bg-emerald-500 text-white shadow'
                          : 'bg-white text-slate-500 hover:bg-emerald-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="text">Fragestellung</Label>
                <Textarea
                  id="text"
                  rows={4}
                  value={newQuestion.text}
                  onChange={(event) => setNewQuestion((prev) => ({ ...prev, text: event.target.value }))}
                  placeholder="Formuliere hier eine Frage oder Beobachtung, die du in einem Screening aufnehmen möchtest."
                />
              </div>
              <Button onClick={handleAddQuestion} disabled={!newQuestion.text.trim()}>
                <Sparkles className="h-4 w-4" /> Frage speichern
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <Brain className="h-5 w-5" />
                </span>
                Fragenbibliothek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="filter">Filter</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Alle Kategorien', ...categories].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFilter(category)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        filter === category ? 'bg-sky-500 text-white shadow' : 'bg-white text-slate-500 hover:bg-sky-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {filteredQuestions.length === 0 && (
                  <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                    Keine Fragen in dieser Kategorie gespeichert. Lege über das Formular neue Items an.
                  </p>
                )}
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                          {question.category}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{question.text}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                        onClick={() => handleDelete(question.id)}
                        aria-label="Frage löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Teamleitfaden</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Strukturierte Journeys',
                description: 'Zeige Nutzer:innen klar, welche Schritte nach einem Screening sinnvoll sind und wohin sie sich wenden können.'
              },
              {
                title: 'Barrierearme Sprache',
                description: 'Vermeide medizinische Fachbegriffe ohne Erklärung und biete sprachliche Alternativen in Leichter Sprache an.'
              },
              {
                title: 'Fachliche Qualität',
                description: 'Stimme Inhalte mit Therapeut:innen ab und verweise transparent auf Quellen und Limitierungen der Tests.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white/90 p-6">
                <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
