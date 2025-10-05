import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

type NavigationProps = {
  onNavigate?: (href: string) => void;
  onAdminClick?: () => void;
};

const navItems = [
  { label: 'Start', href: '#home' },
  { label: 'Tests', href: '#tests' },
  { label: 'Mission', href: '#mission' },
  { label: 'Ressourcen', href: '#resources' }
];

export function Navigation({ onNavigate, onAdminClick }: NavigationProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#home" onClick={() => handleNavigate('#home')} className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-lg text-white">LY</span>
          <span>Embrace Neurodiversity</span>
        </a>
        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNavigate(item.href)}
              className="rounded-full px-3 py-2 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onAdminClick}
            className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:text-emerald-600"
          >
            Admin
          </button>
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="sm" aria-label="Menü öffnen" onClick={() => setOpen((prev) => !prev)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white/95 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleNavigate(item.href)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                onAdminClick?.();
                setOpen(false);
              }}
              className="block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-emerald-600"
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
