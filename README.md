# Embrace Neurodiversity – React Demo

Eine lauffähige Demo der Plattform "Embrace Neurodiversity". Sie wurde aus dem ursprünglichen Figma-Konzept übertragen und als moderne React/Vite-Anwendung mit Tailwind CSS umgesetzt. Die App bündelt Startseite, Demo-Authentifizierung, Dashboard, Test-Preview sowie einen vereinfachten Admin-Bereich.

## Features
- Interaktive Landing Page mit responsiver Navigation und KI-Chatbot-Teaser
- Demo-Anmeldung mit lokalem Benutzerprofil und Dashboard für die wichtigsten Screenings (RAADS-R, CAT-Q, ASRS)
- Platzhalter-Testansicht zur weiteren inhaltlichen Ausarbeitung
- Vereinfachtes Admin-Dashboard zum Verwalten von Beispiel-Fragen (lokal gespeichert)
- Leichtgewichtiger Chatbot (LYNA) mit freundlichen Standardantworten, um das Erlebnis zu demonstrieren

## Entwicklung starten

```bash
npm install
npm run dev
```

Anschließend ist die App unter [http://localhost:5173](http://localhost:5173) erreichbar.

## Produktion bauen

```bash
npm run build
npm run preview
```

## Direkter Start über `_embndv.html`

- Nach dem Klonen kannst du die Datei [`_embndv.html`](./_embndv.html) im Projektstamm doppelklicken.
- Sie lädt die vorkompilierten Assets aus dem Ordner [`dist`](./dist) und startet die Anwendung komplett lokal – ein separater Dev-Server ist dafür nicht nötig.
- Möchtest du nach Codeänderungen eine frische statische Version erzeugen, führe `npm run build` aus; die Datei `_embndv.html` verweist automatisch auf die neu generierten Dateien `dist/assets/index.css` und `dist/assets/app.js`.

## Struktur
- `src/App.tsx`: Einstiegspunkt der Anwendung und Screen-Routing
- `src/components/`: Wiederverwendbare Oberflächenbausteine (Navigation, Chatbot, Admin-Bereich)
- `src/components/ui/`: Minimalistische UI-Hilfskomponenten (Button, Card, Input ...)
- `tailwind.config.ts`: Tailwind-Konfiguration für Utility-Klassen

Die Demo erhebt keinerlei personenbezogene Daten und dient ausschließlich als lokale Visualisierung der Plattformidee.
