import {saveResult, getNextQuestion, updateRewards, getRewards, getXPPercentage, getAccuracy, getAllAchievements} from './storage.js';
import {selectQuestion, shuffle} from './adaptive.js';

const profileSection = document.getElementById('profile');
const catsSection    = document.getElementById('cats');
const catButtons     = document.getElementById('cat-buttons');
const quizSection    = document.getElementById('quiz');
const vraagEl        = document.getElementById('vraagtekst');
const plaatjeEl      = document.getElementById('plaatje');
const antwoordenEl   = document.getElementById('antwoorden');
const feedbackEl     = document.getElementById('feedback');
const volgendeBtn    = document.getElementById('volgende');
const terugBtn       = document.getElementById('terug');
const statsBtn       = document.getElementById('stats-btn');
const rewardsBar     = document.getElementById('rewards-bar');

let vragen = [];
let actieveVragen = [];
let huidig = null;
let leeftijd = null;
let groep = null;
let categorieen = [];

// Mapping van leeftijd naar groepniveau
const LEEFTIJD_NAAR_GROEP = {
  6: 2,   // Elio (6 jaar) → groep 2 niveau
  10: 5   // Louie (10 jaar) → groep 5 niveau
};

/* -------- 0a. profiel kiezen -------- */
profileSection.addEventListener('click', async e=>{
  if(!e.target.dataset.age) return;
  leeftijd = Number(e.target.dataset.age);
  groep = LEEFTIJD_NAAR_GROEP[leeftijd] || leeftijd;
  console.log(`Profiel gekozen: leeftijd ${leeftijd}, groep ${groep}`);
  await zoekCategorieen();
  toonCategorieKeuze();
});

/* -------- 0b. zoek beschikbare categorieën -------- */
async function zoekCategorieen() {
  // Zoek beschikbare categorieën voor dit groepniveau
  const mogelijkeCats = ['dieren', 'rekenen', 'tafels', 'delen'];
  categorieen = [];

  for(const cat of mogelijkeCats) {
    const bestand = `data/groep${groep}_${cat}.json`;
    try {
      const res = await fetch(bestand);
      if(res.ok) {
        // Capitalize eerste letter voor display
        const naam = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorieen.push({naam, bestand});
        console.log(`Categorie gevonden: ${naam} (${bestand})`);
      }
    } catch(err) {
      console.log(`Categorie niet gevonden: ${bestand}`);
    }
  }
  console.log(`Totaal ${categorieen.length} categorieën gevonden`);
}

/* -------- 0c. toon categorieknoppen -------- */
function toonCategorieKeuze(){
  profileSection.hidden = true;
  catsSection.hidden    = false;
  catButtons.innerHTML  = '';

  if(categorieen.length === 0) {
    catButtons.innerHTML = '<p>Geen categorieën beschikbaar voor dit niveau.</p>';
  } else {
    categorieen.forEach(cat=>{
      const knop = document.createElement('button');
      knop.textContent = cat.naam;
      knop.onclick = ()=>startQuiz(cat);
      catButtons.appendChild(knop);
      console.log(`Categorie knop aangemaakt: ${cat.naam}`);
    });
  }

  terugBtn.hidden = false;
  statsBtn.hidden = false;
}

terugBtn.onclick = ()=>{
  catsSection.hidden = true;
  profileSection.hidden = false;
  terugBtn.hidden = true;
  statsBtn.hidden = true;
};

/* -------- Stats button event -------- */
statsBtn.onclick = ()=>{
  toonStats();
};

/* -------- Update rewards bar met huidige data -------- */
function updateRewardsBar() {
  const rewards = getRewards();
  const xpPerc = getXPPercentage();

  document.getElementById('level-display').textContent = `🏆 Level ${rewards.level}`;
  document.getElementById('points-display').textContent = `⭐ ${rewards.totalPoints} pts`;
  document.getElementById('streak-display').textContent = `🔥 ${rewards.streak}`;
  document.getElementById('xp-progress').style.width = `${xpPerc}%`;

  console.log(`Rewards bar updated: Level ${rewards.level}, ${rewards.totalPoints} pts, ${rewards.streak} streak`);
}

/* -------- Toon stats dashboard -------- */
function toonStats() {
  const statsSection = document.getElementById('stats');
  const statsOverview = document.getElementById('stats-overview');
  const achievementsGrid = document.getElementById('achievements-grid');

  const rewards = getRewards();
  const accuracy = getAccuracy();
  const allAchievements = getAllAchievements();

  // Verberg andere secties
  profileSection.hidden = true;
  catsSection.hidden = true;
  quizSection.hidden = true;
  rewardsBar.hidden = false;
  statsSection.hidden = false;

  // Toon stats overview
  statsOverview.innerHTML = `
    <div class="stat-card highlight">
      <div class="stat-number">${rewards.level}</div>
      <div class="stat-label">Level</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${rewards.totalPoints}</div>
      <div class="stat-label">Totaal Punten</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${rewards.streak}</div>
      <div class="stat-label">Huidige Streak</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${rewards.maxStreak}</div>
      <div class="stat-label">Beste Streak</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${rewards.totalCorrect}</div>
      <div class="stat-label">Goed Beantwoord</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${accuracy}%</div>
      <div class="stat-label">Accuraatheid</div>
    </div>
  `;

  // Toon achievements
  achievementsGrid.innerHTML = allAchievements.map(ach => `
    <div class="achievement ${ach.unlocked ? 'unlocked' : ''}">
      <div class="achievement-icon">${ach.unlocked ? ach.name.split(' ')[0] : '🔒'}</div>
      <div class="achievement-name">${ach.unlocked ? ach.name.substring(2) : '???'}</div>
      <div class="achievement-desc">${ach.unlocked ? ach.desc : 'Nog niet ontgrendeld'}</div>
    </div>
  `).join('');

  // Back button
  document.getElementById('back-to-cats').onclick = ()=>{
    statsSection.hidden = true;
    toonCategorieKeuze();
  };
}

/* -------- Toon achievement popup -------- */
function toonAchievementPopup(achievement) {
  const popup = document.getElementById('achievement-popup');
  const details = document.getElementById('achievement-details');

  details.innerHTML = `
    <div style="font-size: 4rem; margin: 1rem 0;">${achievement.name.split(' ')[0]}</div>
    <h3>${achievement.name.substring(2)}</h3>
    <p>${achievement.desc}</p>
  `;

  popup.style.display = 'flex';

  document.getElementById('close-popup').onclick = ()=>{
    popup.style.display = 'none';
  };
}

/* -------- Toon level up popup -------- */
function toonLevelUpPopup(level) {
  const popup = document.getElementById('levelup-popup');
  const details = document.getElementById('levelup-details');

  details.innerHTML = `
    <div style="font-size: 4rem; margin: 1rem 0;">🏆</div>
    <h3>Je bent nu Level ${level}!</h3>
    <p>Blijf zo doorgaan! 💪</p>
  `;

  popup.style.display = 'flex';

  document.getElementById('close-levelup').onclick = ()=>{
    popup.style.display = 'none';
  };
}

/* -------- 1. Quiz starten met gekozen categorie -------- */
async function startQuiz(cat){
  console.log(`Quiz starten voor categorie: ${cat.naam}`);
  try {
    // Laad vragen uit het juiste bestand
    const res = await fetch(cat.bestand);
    if(!res.ok) throw new Error(`Failed to load ${cat.bestand}`);

    actieveVragen = await res.json();
    console.log(`${actieveVragen.length} vragen geladen`);

    // Zet thema-kleur
    document.documentElement.style.setProperty('--primary', actieveVragen[0]?.kleur || '#4e9cff');

    // Verberg categorie menu, toon quiz en rewards bar
    catsSection.hidden = true;
    quizSection.hidden = false;
    rewardsBar.hidden = false;

    // Update rewards bar met huidige stats
    updateRewardsBar();

    // Start met eerste vraag
    toonVraag(selectQuestion(actieveVragen));
  } catch(err) {
    console.error('Fout bij laden van quiz:', err);
    alert('Er ging iets mis bij het laden van de vragen. Probeer opnieuw.');
  }
}

/* -------- 2. één vraag tonen -------- */
function toonVraag(vraag){
  huidig = vraag;
  antwoordenEl.innerHTML = '';
  feedbackEl.textContent = '';
  volgendeBtn.hidden = true;

  vraagEl.textContent = vraag.vraag;
  plaatjeEl.src = vraag.plaatje || '';
  plaatjeEl.hidden = !vraag.plaatje;

  let opties = vraag.type === 'mcq' ? shuffle([...vraag.opties]) : ['antwoord'];
  opties.forEach(opt=>{
    const btn = document.createElement('button');
    btn.textContent = vraag.type==='invul' ? 'Controleer' : opt;
    btn.onclick = ()=>controleerAntwoord(opt, btn);
    antwoordenEl.appendChild(btn);
  });

  if(vraag.type==='invul'){
    const inp = document.createElement('input');
    inp.placeholder = 'Typ je antwoord';
    antwoordenEl.insertBefore(inp, antwoordenEl.firstChild);
  }
  // Hint tonen als die er is
  if(vraag.hint){
    const hint = document.createElement('div');
    hint.textContent = 'Tip: ' + vraag.hint;
    hint.style.fontStyle = 'italic';
    hint.style.margin = '0.5em 0';
    antwoordenEl.appendChild(hint);
  }
}

/* -------- 3. controleren -------- */
function controleerAntwoord(opt, btn){
  let userAnswer = opt;
  if(huidig.type==='invul'){
    const input = antwoordenEl.querySelector('input');
    userAnswer = input ? input.value.trim() : '';
    if(!userAnswer) {
      alert('Vul eerst een antwoord in!');
      return;
    }
  }

  const correct = (userAnswer.toLowerCase() === huidig.antwoord.toLowerCase());

  // Sla resultaat op
  saveResult(leeftijd, huidig.id, correct);

  // Update beloningssysteem
  const rewards = updateRewards(correct);
  updateRewardsBar();

  // Feedback tonen
  if(correct) {
    const complimenten = ['Goed zo! 🎉', 'Super! 🌟', 'Geweldig! 🚀', 'Top! ⭐', 'Perfect! 💯'];
    feedbackEl.textContent = complimenten[Math.floor(Math.random() * complimenten.length)];
    feedbackEl.style.color = 'var(--green)';
  } else {
    feedbackEl.textContent = `Het juiste antwoord is: ${huidig.antwoord}`;
    if(huidig.uitleg) feedbackEl.textContent += `\n\n${huidig.uitleg}`;
    feedbackEl.style.color = 'var(--red)';
  }

  // Animatie toevoegen aan button
  if(btn) {
    btn.classList.add(correct ? 'correct':'fout');
    btn.disabled = true;
  }

  // Alle buttons disablen na antwoord
  antwoordenEl.querySelectorAll('button').forEach(b => b.disabled = true);
  const input = antwoordenEl.querySelector('input');
  if(input) input.disabled = true;

  volgendeBtn.hidden = false;

  // Toon popups voor achievements en level ups (met delay voor betere UX)
  setTimeout(() => {
    if(rewards.newLevelUnlocked) {
      toonLevelUpPopup(rewards.level);
    } else if(rewards.newAchievements.length > 0) {
      // Toon eerste nieuwe achievement
      toonAchievementPopup(rewards.newAchievements[0]);
    }
  }, 800);
}

/* -------- 4. volgende vraag -------- */
volgendeBtn.onclick = ()=>{
  const q = getNextQuestion(actieveVragen);
  if(q){
    toonVraag(q);
  } else {
    // Alle vragen beantwoord
    vraagEl.textContent = '🎉 Knap gedaan! Alle vragen beantwoord!';
    plaatjeEl.hidden = true;
    antwoordenEl.innerHTML = '<button id="terug-naar-cats">← Kies andere categorie</button>';
    volgendeBtn.hidden = true;
    feedbackEl.textContent = '';

    // Event listener voor terug knop
    document.getElementById('terug-naar-cats').onclick = ()=>{
      quizSection.hidden = true;
      rewardsBar.hidden = true;
      toonCategorieKeuze();
    };
  }
}; 