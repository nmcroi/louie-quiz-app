# 📦 Louie Quiz App - Installatie Instructies

## ✅ Project is klaar voor gebruik!

Ik heb een complete zip file gemaakt van het project: **louie-quiz-app-complete.zip** (57KB)

## 📍 Installatie op je Mac

### Stap 1: Download het project
Het zip bestand staat in je Claude Code omgeving op:
```
/home/user/louie-quiz-app-complete.zip
```

### Stap 2: Verplaats naar je Dropbox
1. Download `louie-quiz-app-complete.zip`
2. Ga naar: `/Users/nielscroiset/Dropbox/Mac (4)/Documents/Vibecoding Projecten`
3. Verplaats het zip bestand daar naartoe
4. Dubbelklik op het zip bestand om uit te pakken

### Stap 3: Open de demo
Er zijn nu 2 manieren om de app te testen:

#### Option A: Standalone Demo (Makkelijkst!)
```
Open: louie-quiz-app/demo-standalone.html
```
Dubbelklik erop → Opent direct in je browser!

#### Option B: Volledige Development Setup
```bash
cd louie-quiz-app
npm install
npm start
```
Dan draait de app op http://localhost:3000

## 📂 Project Structuur

```
louie-quiz-app/
├── demo-standalone.html          ← OPEN DIT VOOR DEMO!
├── public/
│   ├── index.html               ← Hoofdpagina
│   ├── style.css                ← Styling
│   ├── data/                    ← Quiz vragen
│   │   ├── groep5_tafels.json  (12 vragen)
│   │   └── groep5_delen.json   (14 vragen)
│   └── src/                     ← JavaScript
│       ├── app.js
│       ├── storage.js
│       └── adaptive.js
├── python/                       ← Tools
│   └── generate_quiz.py         ← Excel → JSON converter
├── README.md                     ← Project documentatie
└── package.json                  ← Dependencies
```

## 🎮 Features die werken in de demo

✅ **Volledig Gaming Beloningssysteem:**
- +10 punten per goed antwoord
- Level ups (elke 100 punten)
- XP progress bar met animatie
- 8 Achievements om te unlocken
- Daily streak tracking

✅ **Quiz Functionaliteit:**
- 12 tafels vragen (vermenigvuldigen)
- 14 delen vragen
- Hints bij elke vraag
- Uitleg bij fout antwoord
- Visuele feedback (groen/rood animaties)

✅ **Stats Dashboard:**
- Totaal punten
- Huidige level
- Streak counter
- Accuracy percentage
- Achievement overzicht

✅ **Opgeslagen Voortgang:**
- Alles wordt opgeslagen in localStorage
- Sluit en heropen → je voortgang blijft bewaard!

## 🚀 Snel Starten

**Makkelijkste manier:**
1. Ga naar de uitgepakte map
2. Dubbelklik op `demo-standalone.html`
3. Klaar! De app opent in je browser

**Voor development:**
```bash
cd "/Users/nielscroiset/Dropbox/Mac (4)/Documents/Vibecoding Projecten/louie-quiz-app"
npm install
npm start
```

## 📱 Op iPad gebruiken

1. Email `demo-standalone.html` naar jezelf
2. Open op iPad
3. Of gebruik AirDrop vanaf je Mac

## 💡 Tips

- **Test eerst de demo** → demo-standalone.html
- **Bekijk de code** → public/src/ bestanden
- **Voeg vragen toe** → public/data/ JSON bestanden
- **Pas styling aan** → public/style.css

## 🆘 Hulp Nodig?

Als je problemen hebt:
1. Check of alle bestanden zijn uitgepakt
2. Probeer een andere browser (Chrome, Safari, Firefox)
3. Open browser console (F12) om errors te zien

## 🎯 Volgende Stappen

Wil je de app uitbreiden? Vraag Claude Code om:
- Meer quiz categorieën toe te voegen
- Het thema aan te passen (bijv. Spiderman style)
- Geluid effecten toe te voegen
- Nieuwe achievements te maken
- De moeilijkheidsgraad aan te passen

---

**Gemaakt met ❤️ voor Louie**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
