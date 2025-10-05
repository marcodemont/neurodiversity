import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
};

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Guten Morgen';
  if (hours < 18) return 'Guten Tag';
  return 'Guten Abend';
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: `${getGreeting()}! Ich bin LYNA und begleite dich bei Fragen zu unseren Selbsttests. Wie kann ich helfen?`,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text:
          'Danke für deine Nachricht! Unsere Tests ersetzen keine Diagnose, geben aber Orientierung. Wenn du Unterstützung brauchst, sprich mit einem medizinischen Fachteam.',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Button
        size="lg"
        aria-label="Chat mit LYNA öffnen"
        className={`fixed bottom-6 right-6 z-50 shadow-xl transition ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">LYNA</p>
              <p className="text-xs opacity-80">Empathische Begleitung</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:text-white" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex h-80 flex-col justify-between bg-slate-50">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                    message.sender === 'user' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500'
                  }`}
                >
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow ${
                    message.sender === 'user' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Bot className="h-4 w-4" /> LYNA denkt nach ...
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <Input
              value={input}
              placeholder="Frag mich etwas"
              onChange={(event) => setInput(event.target.value)}
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
