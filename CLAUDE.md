# CLAUDE.md – Homepage (Yannick)

## 1. Projekt-Übersicht

**Name:** Homepage / Yannick  
**Zweck:** Persönliche digitale Visitenkarte für Yannick Reiter. Single-Page, auf Deutsch, dark-mode only. Kein Blog, kein Portfolio im klassischen Sinne – eher ein Steckbrief mit Witz.  
**Tech-Stack:** Reines Vanilla HTML/CSS/JS. Kein Framework, kein Build-Step, kein npm, kein TypeScript.  
**Hosting:** Vercel (Vercel Web Analytics eingebunden via `/_vercel/insights/script.js`)  
**Live-URL:** Nicht im Code hinterlegt, aber Vercel-Deployment vorhanden (Branch `main` → Vercel)  
**Sprache:** Vollständig auf Deutsch

---

## 2. Dateistruktur

```
/
├── index.html          # Die gesamte Seite – HTML-Struktur, alle Sections
├── style.css           # Alle Styles, CSS-Custom-Properties, Responsive-Breakpoints
├── script.js           # Alle Interaktionen (Nav, Hero, Gallery, Lightbox, FAQ, Fun Ending)
├── assets/             # Produktionsfotos (JPEG/PNG) – Yannick + Oskar
│   ├── ICH_schwarz_mittig.png   ← Hero-Hintergrundbild
│   ├── ICH.JPEG / ICH_laufen.JPEG / ICH_schwarz_neu.JPEG
│   ├── Oskar.JPEG / Oskar_01–04.JPEG
│   └── Oskar_und_ich.JPEG / Oskar_und_ich2.JPEG
└── old images/         # Drohnenfotos (die älteren Aufnahmen aus der Zeit vor dem Redesign)
    └── *.jpg           # Hohe Wand, Herbstwald, Burg Forchtenstein, Wings, Winter etc.
```

Kein `package.json`, kein `node_modules`, kein Build-Verzeichnis. Was du siehst, ist was deployed wird.

---

## 3. Aktueller Stand

**Fertig & stabil:**
- Hero mit Sticky-Scroll-Effekt (Bild bleibt gepinnt, Name erscheint beim Scrollen)
- Nav (Desktop-Links + Mobile Hamburger mit Overlay)
- About-Section mit 4 Fact-Cards + Foto
- Interests-Grid (6 Karten)
- Gallery mit Tabs (Alle / Persönlich / Drohne), Drag-Scroll, Lightbox
- Oskar-Section mit Hero-Bild + eigenem Fotoscroll + Lightbox
- Drohnenaufnahmen-Section mit YouTube Facade (lazy, kein Cookie-Banner-Problem dank youtube-nocookie)
- FAQ mit Accordion
- Fun Ending: „Kaffee?"-Section mit dodgendem Nein-Button + Modal → Instagram-Link
- Footer mit Instagram-Links für Yannick (`@yannickreiter`) und Oskar (`@oskar.the.jackrussell`)
- Vercel Web Analytics

**Zuletzt geändert (letzte Commits):**
- Vercel Web Analytics nachträglich eingebaut (PR #7)
- Fun Ending Section hinzugefügt (PR #6) – Kaffee-Einladung mit Nein-Button-Dodge
- Diverse Hero-Feinarbeiten: Foto-Tausch, Mobile-Tuning, Copyright, Gap-Anpassungen

**Bekannte offene Punkte / Fragen:**
- Drohnenfotos liegen noch in `old images/` (Leerzeichen im Ordnernamen, URL-encoded als `old%20images/`). Ob die irgendwann in `assets/` umziehen sollen, ist offen.
- Nur ein YouTube-Video verlinkt (`Q7wlRB4WaYM`) – hardcoded in script.js und index.html (Thumbnail-URL).
- Kein Impressum / Datenschutz vorhanden. Je nach Nutzung ggf. rechtlich relevant (AT/EU).

---

## 4. Technische Konventionen

- **CSS-Custom-Properties** für alles Farbliche/Spacing – in `:root` definiert, nie Hardcoded-Farben außerhalb. Exception: reine Schwarz-Weiß-Werte im Hero.
- **`clamp()`** für Schriftgrößen – responsiv ohne Media Queries für Typo.
- **`svh`** (small viewport height) statt `vh` im Hero – explizite Entscheidung für mobile Browser (kein springendes Layout bei Adressleiste).
- **IntersectionObserver** für Scroll-Reveal (`.reveal` → `.visible`), kein externes Lib.
- **Passive Event Listeners** überall wo möglich.
- **`prefers-reduced-motion`** berücksichtigt für Hero-Animationen.
- **YouTube Facade** pattern – kein echtes Embed beim Seitenload, erst beim Klick.
- CSS-Sections sind mit Trennkommentaren `/* ===...=== */` strukturiert – bei Erweiterungen bitte beibehalten.
- JS ist in logische Blöcke mit `// ── Label ──` aufgeteilt.

---

## 5. Bekannte Eigenheiten & Stolpersteine

- **Hero-Scroll-Trigger:** Der Name erscheint bei `scrollY > 40` (sehr früh). Wert in `script.js:17` – kleine Änderung hat großen visuellen Effekt.
- **Mobile Hero-Positionierung:** Das Pixelgenau berechnete `bottom: calc(100svh - 111.5vw + 7vw)` für `.hero-name-wrap` auf Mobile basiert auf dem Seitenverhältnis von `ICH_schwarz_mittig.png` (1188×1324). Wenn das Bild ausgetauscht wird, muss dieser Wert neu berechnet werden (style.css:850ff).
- **Ordnername `old images/`** mit Leerzeichen: In HTML wird er als `old%20images/` referenziert. Umbenennen würde alle Gallery-Links in `index.html` brechen.
- **Fun Ending kann deaktiviert werden:** Klarer Kommentar im HTML: von `<!-- FUN ENDING START -->` bis `<!-- FUN ENDING END -->` – einfach rausnehmen und die IIFE in `script.js` (Zeile 227+) fällt sauber durch (`if (!btnJa) return`).
- **Lightbox und Filter:** Wenn Galerie-Items per Tab gefiltert werden (display:none), werden sie beim Lightbox-Öffnen korrekt übersprungen. Aber die Oskar-Lightbox und die Gallery-Lightbox sind komplett getrennte Instanzen – nicht durchmischen.
- **Keine externen Abhängigkeiten** außer Google Fonts (Inter) und Vercel Analytics – alles andere ist self-contained.

---

## 6. Was NICHT ohne Rückfrage geändert werden soll

- **Hero-Bild und Mobile-CSS** (`hero-name-wrap` / `hero-arrow` bottom-Werte): Sehr fragile Pixel-Kalkulation, die vom konkreten Bild abhängt. Nur anfassen wenn das Bild sich ändert, und dann sorgfältig testen.
- **Instagram-Links** (Yannick + Oskar): Echte Accounts – vor Änderung fragen.
- **YouTube Video-ID** (`Q7wlRB4WaYM`): Hardcoded an zwei Stellen (Thumbnail-URL in index.html + iframe-src in script.js) – wenn Video wechselt, beide updaten.
- **`old images/` Ordnername**: Umbenennung bricht die Galerie. Wenn refactored, alle 7 Pfade in index.html anpassen.
- **Vercel Analytics Script**: Das `/_vercel/insights/script.js` kommt von Vercel, nicht von uns. Nicht anfassen.
- **Fun Ending Section**: Bewusste Design-Entscheidung von Yannick – nur ändern/entfernen wenn er das explizit will.
