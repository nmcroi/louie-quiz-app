# 🎮 Spelenderwijs Leren - Adaptieve Quiz App voor Louie

Een **gaming-achtige leer-app** speciaal ontworpen voor neurodivergente kinderen, geïnspireerd op het Duolingo succes-model.

## 🎯 Projectdoel

Deze app is ontwikkeld voor **Louie (11 jaar, groep 6)** die ADD heeft en anders leert dan andere kinderen. Het doel is om leren **leuk, motiverend en belonenend** te maken door gaming-elementen toe te voegen.

### 🧠 Waarom deze app?

**Louie's leeruitdagingen:**
- Moeite met concentratie en aandacht vasthouden
- Moeite met starten van opdrachten  
- Opdrachten begrijpen is soms lastig
- Heeft succeservaringen nodig om gemotiveerd te blijven
- Leert beter met visuele en gaming-achtige feedback

**Wat werkt voor hem (Duolingo model):**
- ⭐ Punten en beloningen
- 🏆 Level-ups en achievements  
- 🔥 Daily streaks
- 🎮 Gaming interface
- 🎉 Directe positieve feedback

## ✨ Features

### 🎮 Gaming Beloningssysteem
- **10 punten** per goed antwoord
- **Level ups** elke 100 punten
- **Daily streak** tracking
- **XP progress bar** 
- **Achievement badges** voor mijlpalen
- **Positieve feedback** ("Geweldig! 🎉", "Top! 🚀")

### 📚 Leerinhoud (Groep 6)
- **🎯 Rekenen - Tafels:** 12 vragen (6×7, 8×9, 7×8, etc.)
- **🔢 Rekenen - Delen:** 14 vragen (42÷6, 72÷8, etc.)  
- **📖 Lezen & Taal:** (uitbreiding gepland)

### 🎨 Visuele Interface
- **Gaming background** (paars gradient)
- **Animaties** (pulse bij goed, shake bij fout)
- **Rewards bar** bovenaan scherm
- **Popup achievements** met celebratie
- **Touch-friendly** buttons voor iPad

## 🏗️ Technische Architectuur

### Frontend Stack
- **HTML5** - Semantische structuur
- **CSS3** - Gaming styling met animaties
- **Vanilla JavaScript ES6** - Modulaire code
- **LocalStorage** - Voortgang opslaan

### Project Structuur
```
📁 Project Louie Quiz App/
├── 📁 public/                 # Web applicatie
│   ├── index.html            # Hoofdpagina  
│   ├── style.css             # Gaming styling
│   ├── 📁 data/               # Quiz bestanden
│   │   ├── groep5_tafels.json
│   │   └── groep5_delen.json
│   └── 📁 src/                # JavaScript modules
│       ├── app.js            # Hoofdlogica
│       ├── storage.js        # Beloningssysteem
│       └── adaptive.js       # Vraag selectie
├── 📁 python/                # Tools
│   ├── generate_quiz.py      # Excel → JSON converter
│   └── README.md            # Python tool docs
├── 📁 chat-history/          # Ontwikkeling historie
├── package.json             # Dependencies
├── capacitor.config.ts      # iOS config
└── README.md               # Dit bestand
```

### Data Flow
1. **Profiel keuze** → Leeftijd instellen (6 of 10 jaar)
2. **Categorie keuze** → JSON data laden
3. **Quiz logica** → Vragen tonen, antwoorden checken
4. **Beloningssysteem** → Punten, levels, achievements
5. **Voortgang opslaan** → localStorage persistence

## 🚀 Installatie & Gebruik

### Lokaal Draaien
```bash
# Navigeer naar project
cd "Project Louie Quiz App"

# Installeer dependencies  
npm install

# Start development server
npm start

# Open in browser
# http://localhost:3000
```

### iPad Toegang
```bash
# Vind je lokale IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Op iPad ga naar:
# http://[JE-IP]:3000
# Bijvoorbeeld: http://192.168.178.40:3000
```

### iOS App Deployment
```bash
# Voeg iOS platform toe
npx cap add ios

# Build voor iOS  
npm run build

# Open in Xcode
npm run ios
```

## 📊 Beloningssysteem

### Punten & Levels
- **10 punten** per goed antwoord
- **Level 1-10+** (elke 100 punten = level up)
- **XP progress bar** voor volgende level

### Achievements
| Badge | Naam | Beschrijving |
|-------|------|--------------|
| 🎯 | Eerste Goed! | Je eerste goede antwoord |
| 🔥 | 3-Dag Streak! | 3 dagen op rij gespeeld |
| ⚡ | Week Warrior! | 7 dagen op rij gespeeld |
| ⭐ | Level 5! | Level 5 bereikt |
| 🏆 | Level 10! | Level 10 bereikt |
| 💯 | Honderd Punten! | 100 punten verzameld |
| 🚀 | Vijfhonderd Punten! | 500 punten verzameld |

### Stats Dashboard
- **Totaal punten** verdiend
- **Huidige level** en voortgang
- **Streak counter** (dagen achter elkaar)
- **Accuracy percentage** (% goed)

## 🎯 Leerfilosofie

### Voor Neurodivergente Kinderen
- **Korte sessies** (5-15 minuten ideaal)
- **Directe feedback** (visueel + auditief)
- **Succeservaringen** bij elke vraag
- **Autonomie** (eigen tempo, eigen keuzes)
- **Predictability** (duidelijke structuur)

### Adaptieve Elementen
- **Moeilijkheidsgraad** sorting (makkelijk → moeilijk)
- **Vraagtypen** mix (meerkeeuze + invul)
- **Hints & uitleg** bij elke vraag
- **Voortgang tracking** per onderwerp

## 🔧 Development Status

### ✅ Voltooid
- [x] Gaming beloningssysteem
- [x] Categoriekeuze interface  
- [x] Rekenvragen (tafels & delen)
- [x] Visuele feedback & animaties
- [x] Achievement popups
- [x] Stats dashboard
- [x] iPad responsive design

### ⚠️ Bekend Issues  
- [ ] JavaScript categoriekeuze bug
- [ ] Module loading inconsistentie
- [ ] Event handlers niet altijd responsive

### 🔮 Roadmap

**Korte termijn:**
- [ ] **Debug JavaScript** functionaliteit
- [ ] **Stoere thema** elementen (Spiderman style)
- [ ] **Audio feedback** toevoegen
- [ ] **Meer categorieën** (Nederlands, Engels)

**Middellange termijn:**
- [ ] **Echte groep 6 leerstof** integratie
- [ ] **Personalisatie** (kleuren, fonts, achtergronden) 
- [ ] **Leraar dashboard** voor voortgang
- [ ] **Offline functionaliteit**

**Lange termijn:**
- [ ] **AI-adaptieve moeilijkheidsgraad**
- [ ] **Multiplayer challenges** met vrienden
- [ ] **Curriculum mapping** met school
- [ ] **Parent analytics** dashboard

## 👨‍💻 Voor Developers

### Nieuwe Categorieën Toevoegen
```python
# 1. Maak Excel met kolommen:
# leeftijd, categorie, type, vraag, antwoord, opties, moeilijk

# 2. Converteer naar JSON:
python python/generate_quiz.py vragen.xlsx

# 3. JSON wordt gegenereerd als:
# public/data/groep{leeftijd}_{categorie}.json
```

### Custom Achievements
```javascript
// Voeg toe aan storage.js achievements array:
{ 
  id: 'my_achievement', 
  name: '🎉 Nieuwe Badge!', 
  desc: 'Beschrijving van achievement',
  condition: () => rewards.someCondition >= target 
}
```

### Styling Aanpassen
```css
/* CSS custom properties in style.css */
:root {
  --primary: #4e9cff;    /* Hoofdkleur */
  --gold: #ffd700;       /* Achievement kleur */  
  --gaming-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🤝 Contributing

Dit is een persoonlijk project voor Louie, maar ideeën en feedback zijn welkom!

### Development Setup
1. Fork/clone repository
2. Maak feature branch
3. Test op verschillende devices
4. Submit pull request

### Testing Checklist
- [ ] Werkt op Safari (iPad)
- [ ] Werkt op Chrome (Desktop)  
- [ ] LocalStorage wordt correct opgeslagen
- [ ] Achievements triggeren correct
- [ ] Responsive design klopt

## 📞 Support & Contact

**Voor vragen over dit project:**
- Check chat-history/ voor ontwikkeling context
- Test eerst op http://localhost:3000
- Gebruik browser developer tools voor debugging

**Voor Louie's vader:**
- Deze app is speciaal voor jouw zoon ontworpen
- Pas het aan naar wat voor hem werkt
- Voeg onderwerpen toe die hij leuk vindt
- Het belangrijkste: het moet leuk blijven! 🎮

---

*"Het doel is niet perfect leren, maar plezierig leren."* 🌟

**Gemaakt met ❤️ voor neurodivergente kinderen**