import { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

const ADMIN_EMAIL = 'admin@embrace-neurodiversity.app';
const ADMIN_PASSWORD = 'embrace2024';

type AdminLoginProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setMessage('');
      onSuccess();
      return;
    }
    setMessage('Anmeldedaten stimmen nicht. Verwende die Demo-Zugangsdaten.');
  };

  const handleRegister = () => {
    if (!email || !password || !name) {
      setMessage('Bitte fülle alle Felder aus, um einen Demo-Account anzulegen.');
      return;
    }
    setMessage('Danke! In der Demo wird der Account nicht dauerhaft gespeichert, aber deine Eingabe zeigt den Ablauf.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-white px-4 py-24">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <CardTitle className="text-2xl">Admin-Bereich</CardTitle>
          <p className="text-sm text-slate-500">
            Demo-Anmeldung für das Content- und Testmanagement von Embrace Neurodiversity.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage('');
              }}
              className={`flex-1 rounded-full px-3 py-2 transition ${
                mode === 'login' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500'
              }`}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setMessage('');
              }}
              className={`flex-1 rounded-full px-3 py-2 transition ${
                mode === 'register' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500'
              }`}
            >
              Registrieren
            </button>
          </div>

          {mode === 'register' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Vor- und Nachname" />
              </div>
              <div>
                <Label htmlFor="email-register">E-Mail</Label>
                <Input
                  id="email-register"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password-register">Passwort</Label>
                <Input
                  id="password-register"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mindestens 8 Zeichen"
                />
              </div>
              <Button className="w-full" onClick={handleRegister}>
                <UserPlus className="h-4 w-4" /> Account anlegen (Demo)
              </Button>
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={ADMIN_EMAIL}
                />
              </div>
              <div>
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-full" onClick={handleLogin}>
                <LogIn className="h-4 w-4" /> Anmelden
              </Button>
            </div>
          )}

          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

          <div className="flex flex-wrap justify-between gap-3 text-xs text-slate-500">
            <button type="button" onClick={onBack} className="font-medium text-emerald-600 hover:underline">
              ← Zurück zur Startseite
            </button>
            <div>
              <p>Demo-Zugang:</p>
              <p className="font-mono">{ADMIN_EMAIL}</p>
              <p className="font-mono">{ADMIN_PASSWORD}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
