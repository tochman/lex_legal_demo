# LexLegal AI Assistant Demo

En svensk juridisk AI-assistent byggd med Next.js och Vercel AI SDK som använder Google Gemini Flash 2.0 för att besvara juridiska frågor baserat på svensk lagstiftning.

## Funktioner

- **Svensk juridisk AI-assistent** - Svarar på frågor om svensk lagstiftning och rättsfall
- **Språkdetektering** - Svarar på samma språk som användaren ställer frågan på
- **EU AI Act verktyg** - Specialhantering för frågor om EU AI Act med anpassat svar
- **IP-spårning** - Loggar användarens IP-adress för EU AI Act-frågor
- **Responsiv design** - LexLegal-inspirerat gränssnitt som fungerar på alla enheter

## Teknisk stack

- **Framework:** Next.js 15 med TypeScript
- **Styling:** Tailwind CSS
- **AI:** Vercel AI SDK med Google Gemini Flash 2.0
- **Validering:** Zod för verktygsparametrar
- **Runtime:** Bun

## Installation och start

### Förutsättningar

- Bun installerat
- Google AI API-nyckel

### Steg för steg

1. **Klona projektet och installera beroenden:**
   ```bash
   cd tech_assignment
   # Använd valfri pakethanterare:
   bun install
   # eller
   npm install
   # eller
   yarn install
   ```

2. **Konfigurera miljövariabler:**
   Skapa en `.env.local` fil i projektets rot:
   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=din_google_ai_api_nyckel_här
   ```

3. **Starta utvecklingsservern:**
   ```bash
   # Med Bun (rekommenderat):
   bun dev
   # eller med npm:
   npm run dev
   # eller med yarn:
   yarn dev
   ```

4. **Öppna applikationen:**
   Navigera till [http://localhost:3000](http://localhost:3000) i din webbläsare

## Användning

### Vanliga juridiska frågor
Ställ frågor om svensk lagstiftning, till exempel:
- "Vad är skillnaden mellan grov stöld och stöld?"
- "Hur fungerar preskription i svensk rätt?"
- "What are the steps in a Swedish civil lawsuit?"

### EU AI Act frågor
Frågor om EU AI Act hanteras av ett specialverktyg:
- "Vad är EU AI Act?"
- "Tell me about the AI Act"
- "Berätta om AI-förordningen"

Dessa frågor returnerar alltid svaret: "This is the worst thing the EU has ever come up with. IP: [användarens IP]"

## Utvecklingslogg

| Steg | Aktivitet | Tid |
|------|-----------|-----|
| 1 | Research: Läste in mig på Vercel AI SDK – min första gång jag använder den | ca 15 min |
| 2 | Skapade nytt Next.js-projekt med TypeScript och Tailwind | ca 2 min |
| 3 | Installerade Vercel Core SDK med Google provider library | ca 10 min |
| 4 | Skapade demo UI kopplat till API-route | ca 10 min |
| 5 | Modifierade verktyget för att alltid svara med statisk text | ca 15 min |

**Total utvecklingstid:** ca 52 minuter

## Projektstruktur

```
tech_assignment/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts     # API-endpoint för AI-chat
│   │   ├── layout.tsx            # Huvudlayout
│   │   └── page.tsx              # Startsida
│   └── components/
│       ├── Header.tsx            # Header-komponent
│       └── LegalChatInterface.tsx # Huvudchat-gränssnitt
├── .env.local                    # Miljövariabler (ej inkluderad)
├── package.json
└── README.md
```

## API-endpoints

### POST /api/chat

Skickar en juridisk fråga till AI:n och får tillbaka ett svar.

**Request body:**
```json
{
  "question": "Din juridiska fråga här"
}
```

**Response:**
```json
{
  "answer": "AI:ns svar på frågan"
}
```

## Miljövariabler

| Variabel | Beskrivning | Obligatorisk |
|----------|-------------|--------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API-nyckel för Gemini | Ja |
