import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const tests = [
  {
    id: 'raads-r',
    title: 'RAADS-R',
    description: 'Screening zu autistischen Merkmalen im Erwachsenenalter.',
    icon: Brain,
    accent: 'from-sky-500 to-blue-500',
    duration: 'ca. 20 Minuten',
    focus: 'Soziale Kommunikation, Routinen, sensorische Wahrnehmung'
  },
  {
    id: 'cat-q',
    title: 'CAT-Q',
    description: 'Erfasst Masking-Verhalten und soziale Kompensation.',
    icon: Users,
    accent: 'from-purple-500 to-violet-500',
    duration: 'ca. 15 Minuten',
    focus: 'Masking, Bewältigung, Anpassungsstrategien'
  },
  {
    id: 'asrs',
    title: 'ASRS',
    description: 'Selbsttest für ADHS-Symptome bei Erwachsenen.',
    icon: Zap,
    accent: 'from-amber-500 to-orange-500',
    duration: 'ca. 10 Minuten',
    focus: 'Aufmerksamkeit, Impulsivität, Regulation'
  }
] as const;

type View = 'home' | 'auth' | 'dashboard' | 'test' | 'admin-login' | 'admin-panel';

type DemoUser = {
  name: string;
  email: string;
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<DemoUser | null>(null);
  const [selectedTest, setSelectedTest] = useState<(typeof tests)[number] | null>(null);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');

  const handleStartTest = (testId: (typeof tests)[number]['id']) => {
    const test = tests.find((item) => item.id === testId) ?? null;
    setSelectedTest(test);
    setView('test');
  };

  const heroStats = useMemo(
    () => [
      { label: 'Validierte Items', value: '180+' },
      { label: 'Fachliche Quellen', value: '12' },
      { label: 'Community-Stimmen', value: '4.9/5' }
    ],
    []
  );

  if (view === 'admin-login') {
    return <AdminLogin onSuccess={() => setView('admin-panel')} onBack={() => setView('home')} />;
  }

  if (view === 'admin-panel') {
    return <AdminPanel onLogout={() => setView('home')} />;
  }

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <Navigation onAdminClick={() => setView('admin-login')} />
        <div className="mx-auto grid min-h-screen max-w-4xl items-center px-4 pt-28 pb-20">
          <Card className="overflow-hidden border-emerald-100 shadow-lg">
            <div className="grid gap-0 md:grid-cols-5">
              <div className="bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 p-8 text-white md:col-span-2">
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Demo-Login</p>
                <h1 className="mt-3 text-3xl font-semibold">Erste Schritte</h1>
                <p className="mt-4 text-sm text-white/80">
                  Registriere dich, um die Tests interaktiv zu erleben. In der Demo werden Daten nur lokal auf deinem Gerät
                  gespeichert.
                </p>
                <div className="mt-6 space-y-4 text-sm">
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" /> Fortschritt speichern und zwischen Tests wechseln
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" /> Persönliches Dashboard mit Ressourcen
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" /> Hinweise für Gespräche mit Fachstellen
                  </p>
                </div>
              </div>
              <div className="space-y-6 bg-white p-8 md:col-span-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600" htmlFor="email">
                    E-Mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                    placeholder="dein.name@example.com"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    const name = authName.trim() || 'Demo Nutzer:in';
                    const email = authEmail.trim() || 'demo@example.com';
                    setUser({ name, email });
                    setView('dashboard');
                  }}
                >
                  Weiter zum Dashboard
                </Button>
                <p className="rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-500">
                  Hinweis: Die Plattform ersetzt keine ärztliche Diagnose. Sie unterstützt bei der Selbstreflexion und dem
                  Gespräch mit Fachpersonen.
                </p>
                <button
                  type="button"
                  onClick={() => setView('home')}
                  className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-emerald-600"
                >
                  <ArrowLeft className="h-4 w-4" /> Zurück zur Startseite
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <Navigation onAdminClick={() => setView('admin-login')} />
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 space-y-10">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500">Willkommen zurück</p>
              <h1 className="text-3xl font-semibold text-slate-900">{user.name}</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Wähle ein Screening aus oder führe es später fort. Dein Fortschritt wird im Browser gespeichert.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setUser(null);
                setView('home');
              }}
            >
              Abmelden
            </Button>
          </header>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="tests">
            {tests.map((test) => (
              <Card key={test.id} className="h-full border-transparent bg-white/90 shadow-lg transition hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${test.accent} text-white`}>
                      <test.icon className="h-6 w-6" />
                    </span>
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-500">{test.description}</p>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                    <p>Dauer: {test.duration}</p>
                    <p>Fokus: {test.focus}</p>
                  </div>
                  <Button className="w-full" onClick={() => handleStartTest(test.id)}>
                    <ArrowRight className="h-4 w-4" /> Test öffnen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-500" /> Sicherheit & Privatsphäre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-500">
                <p>Alle Eingaben bleiben auf deinem Gerät. Du kannst den Browser-Cache jederzeit löschen.</p>
                <p>Wir empfehlen, Testergebnisse gemeinsam mit Ärzt:innen oder Therapeut:innen zu reflektieren.</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-sky-500" /> Ressourcen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-500">
                <p>• Selbsthilfegruppen in deiner Region</p>
                <p>• Leitfaden für Gespräche mit Ärzt:innen</p>
                <p>• Podcast-Tipps rund um Neurodivergenz</p>
              </CardContent>
            </Card>
          </section>
        </div>
        <ChatBot />
      </div>
    );
  }

  if (view === 'test' && selectedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <Navigation onAdminClick={() => setView('admin-login')} />
        <div className="mx-auto max-w-4xl px-4 pt-28 pb-20 space-y-8">
          <button
            type="button"
            onClick={() => setView(user ? 'dashboard' : 'home')}
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Zurück
          </button>
          <Card className="border-emerald-100 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedTest.accent} text-white`}>
                  <selectedTest.icon className="h-6 w-6" />
                </span>
                {selectedTest.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-slate-600">
              <p>{selectedTest.description}</p>
              <div className="grid gap-3 rounded-3xl bg-slate-100 p-4 text-xs text-slate-500 md:grid-cols-2">
                <p>Fokus: {selectedTest.focus}</p>
                <p>Dauer: {selectedTest.duration}</p>
                <p>Empfohlen: Ruhige Umgebung und ca. 20 Minuten Zeit.</p>
                <p>Speichere Gedanken in einem Journal – hilfreich für Gespräche mit Fachstellen.</p>
              </div>
              <p>
                In der Demo-Version siehst du noch keine einzelnen Items. Du kannst sie im Admin-Bereich anlegen und für die
                weitere Entwicklung exportieren.
              </p>
              <Button onClick={() => setView(user ? 'dashboard' : 'home')}>
                Zurück zum {user ? 'Dashboard' : 'Start'}
              </Button>
            </CardContent>
          </Card>
        </div>
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <Navigation onAdminClick={() => setView('admin-login')} />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-24 space-y-24" id="home">
        <section className="grid gap-12 md:grid-cols-5 md:items-center">
          <div className="space-y-6 md:col-span-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-500">
              <Sparkles className="h-4 w-4" /> Empathische Testbegleitung
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Entdecke neurodiverse Stärken mit fundierten Selbsttests.
            </h1>
            <p className="text-lg text-slate-600">
              Embrace Neurodiversity kombiniert wissenschaftlich erprobte Screening-Verfahren mit verständlichen Ergebnissen und
              Empfehlungen für die nächsten Schritte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setView('auth')}>
                Tests starten
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setUser({ name: 'Demo Nutzer:in', email: 'demo@example.com' });
                  setView('dashboard');
                }}
              >
                Demo-Dashboard ansehen
              </Button>
            </div>
            <div className="grid gap-3 rounded-3xl bg-white/80 p-4 text-sm text-slate-500 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative md:col-span-2">
            <div className="relative overflow-hidden rounded-[40px] border border-white/60 bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 p-8 shadow-2xl">
              <div className="space-y-5 text-white">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">LYNA begleitet dich</p>
                <p className="text-lg font-semibold leading-snug">
                  Empathischer Chatbot, der Fragen zu Items erklärt und Ressourcen empfiehlt.
                </p>
                <div className="space-y-2 rounded-3xl bg-white/15 p-4 text-sm">
                  <p className="font-medium">So funktioniert es:</p>
                  <p>• Starte einen Test und beobachte deine Antworten</p>
                  <p>• Erhalte kontextuelle Unterstützung</p>
                  <p>• Sammle Ideen für Gespräche mit Fachpersonen</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10" id="tests">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Screenings im Überblick</h2>
            <p className="max-w-2xl text-sm text-slate-600">
              Die Plattform bündelt validierte Fragebögen zu Autismus, ADHS und Masking. Du kannst alle Tests einzeln starten oder
              deine Antworten miteinander verknüpfen.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tests.map((test) => (
              <Card key={test.id} className="border-transparent bg-white/90 shadow-lg transition hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${test.accent} text-white`}>
                      <test.icon className="h-6 w-6" />
                    </span>
                    {test.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <p>{test.description}</p>
                  <p className="rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-500">
                    Fokus: {test.focus}
                  </p>
                  <Button className="w-full" onClick={() => handleStartTest(test.id)}>
                    Jetzt entdecken
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3" id="mission">
          {[
            {
              title: 'Ganzheitlicher Blick',
              description: 'Wir verknüpfen Screening-Ergebnisse und zeigen Muster zwischen Autismus, ADHS und Masking auf.',
              icon: Compass
            },
            {
              title: 'Empathische Sprache',
              description: 'Jedes Ergebnis wird verständlich erklärt, inklusive Ressourcen für Gespräche mit Ärzt:innen.',
              icon: Heart
            },
            {
              title: 'Community-Fokus',
              description: 'Feedback von Betroffenen und Fachstellen fließt direkt in die Weiterentwicklung ein.',
              icon: Users
            }
          ].map((item) => (
            <Card key={item.title} className="border-emerald-50 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <item.icon className="h-6 w-6 text-emerald-500" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{item.description}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2" id="resources">
          <Card className="border-slate-200 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-slate-500" /> Ressourcen für dich
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• Gesprächsvorbereitung für Diagnostiktermine</p>
              <p>• Sammlung neurodiverser Coaches und Therapeut:innen</p>
              <p>• Artikel über Masking, Sensory Overload und Selbstakzeptanz</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-slate-500" /> Haftungsausschluss
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>Die Selbsttests ersetzen keine medizinische Diagnose.</p>
              <p>
                Unsere Hinweise dienen der Selbstreflexion. Bitte besprich Auffälligkeiten mit Fachpersonen deines Vertrauens.
              </p>
              <p>In der Demo-Version werden keine Daten an Server übertragen.</p>
            </CardContent>
          </Card>
        </section>
      </main>
      <ChatBot />
    </div>
  );
}
