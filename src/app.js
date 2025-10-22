import {saveResult, getNextQuestion, getStats, getRewards} from './storage.js';
import {selectQuestion, shuffle} from './adaptive.js';

const profileSection = document.getElementById('profile');
const quizSection    = document.getElementById('quiz');
const catsSection    = document.getElementById('cats');
const statsSection   = document.getElementById('stats');
const vraagEl        = document.getElementById('vraagtekst');
const plaatjeEl      = document.getElementById('plaatje');
const antwoordenEl   = document.getElementById('antwoorden');
const feedbackEl     = document.getElementById('feedback');
const volgendeBtn    = document.getElementById('volgende');
const catButtonsEl   = document.getElementById('cat-buttons');
const terugBtn       = document.getElementById('terug');
const statsBtn       = document.getElementById('stats-btn');
const backToCatsBtn  = document.getElementById('back-to-cats');

// Rewards elements
const rewardsBar     = document.getElementById('rewards-bar');
const levelDisplay   = document.getElementById('level-display');
const pointsDisplay  = document.getElementById('points-display');
const streakDisplay  = document.getElementById('streak-display');
const xpProgress     = document.getElementById('xp-progress');

// Popups
const achievementPopup = document.getElementById('achievement-popup');
const levelupPopup     = document.getElementById('levelup-popup');
const closePopupBtn    = document.getElementById('close-popup');
const closeLevelupBtn  = document.getElementById('close-levelup');

let vragen = [];          // actieve vragenlijst
let huidig = null;        // huidige vraag‑object
let leeftijd = null;      // 6 of 10
let categories = [        // beschikbare categorieën
  { id: 'tafels', name: '🎯 Rekenen - Tafels', color: '#ff6b6b' },
  { id: 'delen', name: '🔢 Rekenen - Delen', color: '#4ecdc4' },
  { id: 'lezen', name: '📚 Lezen & Taal', color: '#45b7d1' }
];

/* -------- 0. profiel kiezen -------- */
profileSection.addEventListener('click', async e=>{
  if(e.target.dataset.age){
    console.log('Profile clicked, age:', e.target.dataset.age);
    leeftijd = Number(e.target.dataset.age);
    profileSection.hidden = true;
    catsSection.hidden = false;
    
    // Direct add category buttons without function call
    catButtonsEl.innerHTML = `
      <button style="background: #ff6b6b; margin: 1rem; padding: 1rem 2rem; border: none; border-radius: 12px; color: white; font-size: 1.2rem; cursor: pointer;" onclick="startTafels()">🎯 Rekenen - Tafels</button>
      <button style="background: #4ecdc4; margin: 1rem; padding: 1rem 2rem; border: none; border-radius: 12px; color: white; font-size: 1.2rem; cursor: pointer;" onclick="startDelen()">🔢 Rekenen - Delen</button>
    `;
    terugBtn.hidden = false;
    statsBtn.hidden = false;
    rewardsBar.hidden = false;
  }
});

// Simple start functions
window.startTafels = async function() {
  console.log('Starting tafels');
  await laadVragen(leeftijd, 'tafels');
  catsSection.hidden = true;
  quizSection.hidden = false;
  toonVraag(selectQuestion(vragen));
};

window.startDelen = async function() {
  console.log('Starting delen');
  await laadVragen(leeftijd, 'delen');
  catsSection.hidden = true;
  quizSection.hidden = false;
  toonVraag(selectQuestion(vragen));
};

/* -------- 1. categorieën tonen -------- */
function toonCategorieen(){
  console.log('toonCategorieen called');
  console.log('catButtonsEl:', catButtonsEl);
  
  if(!catButtonsEl) {
    console.error('cat-buttons element not found!');
    return;
  }
  
  catButtonsEl.innerHTML = '';
  terugBtn.hidden = false;
  statsBtn.hidden = false;
  rewardsBar.hidden = false;
  updateRewardsDisplay();
  
  console.log('Adding categories:', categories);
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.name;
    btn.style.background = cat.color;
    btn.onclick = () => startCategorie(cat.id);
    catButtonsEl.appendChild(btn);
    console.log('Added button:', cat.name);
  });
}

/* -------- 2. data laden -------- */
async function laadVragen(age, category){
  try {
    const groep = age === 6 ? 2 : 5;
    const res = await fetch(`data/groep${groep}_${category}.json`);
    vragen = await res.json();
    vragen.forEach(v => v.leeftijd = age);
  } catch(e) {
    // Fallback naar algemene vragen als categorie niet bestaat
    const res = await fetch(`data/groep${age===6?2:5}.json`);
    vragen = await res.json();
    vragen.forEach(v => v.leeftijd = age);
  }
}

/* -------- 3. categorie starten -------- */
async function startCategorie(categoryId){
  await laadVragen(leeftijd, categoryId);
  catsSection.hidden = true;
  quizSection.hidden = false;
  toonVraag(selectQuestion(vragen));
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
}

/* -------- 3. controleren -------- */
function controleerAntwoord(opt, btn){
  let userAnswer = opt;
  if(huidig.type==='invul'){
    userAnswer = btn.previousSibling.value.trim();
    if(!userAnswer) return;
  }

  const correct = (userAnswer.toLowerCase() === huidig.antwoord.toLowerCase());
  saveResult(leeftijd, huidig.id, correct);

  // Update feedback met gaming elementen
  if(correct) {
    const encouragements = ['Geweldig! 🎉', 'Super! ⭐', 'Perfect! 🔥', 'Top! 🚀', 'Fantastisch! 💯'];
    feedbackEl.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
  } else {
    feedbackEl.textContent = `Oeps! Het goede antwoord is: ${huidig.antwoord} 🤔`;
  }
  
  if(btn) btn.classList.add(correct ? 'correct':'fout');
  volgendeBtn.hidden = false;
  
  // Update rewards display
  updateRewardsDisplay();
}

/* -------- 6. volgende vraag -------- */
volgendeBtn.onclick = ()=>{
  const q = getNextQuestion(vragen);
  if(q){ toonVraag(q); }
  else  { vraagEl.textContent='Knap gedaan! Alle vragen beantwoord.'; plaatjeEl.hidden=true; antwoordenEl.innerHTML=''; volgendeBtn.hidden=true; }
};

/* -------- 7. terug naar categorieën -------- */
terugBtn.onclick = ()=>{
  catsSection.hidden = true;
  profileSection.hidden = false;
  terugBtn.hidden = true;
  rewardsBar.hidden = true;
  statsBtn.hidden = true;
};

/* -------- 8. stats tonen -------- */
statsBtn.onclick = ()=>{
  catsSection.hidden = true;
  statsSection.hidden = false;
  toonStats();
};

backToCatsBtn.onclick = ()=>{
  statsSection.hidden = true;
  catsSection.hidden = false;
};

/* -------- 9. popup handlers -------- */
closePopupBtn.onclick = ()=>{
  achievementPopup.style.display = 'none';
};

closeLevelupBtn.onclick = ()=>{
  levelupPopup.style.display = 'none';
};

/* -------- 10. rewards display updates -------- */
function updateRewardsDisplay() {
  if(!leeftijd) {
    console.log('No age set yet, skipping rewards update');
    return;
  }
  
  try {
    const rewards = getRewards(leeftijd);
    
    if(levelDisplay) levelDisplay.textContent = `🏆 Level ${rewards.level}`;
    if(pointsDisplay) pointsDisplay.textContent = `⭐ ${rewards.points} pts`;
    if(streakDisplay) streakDisplay.textContent = `🔥 ${rewards.streak}`;
    
    // XP progress bar (progress to next level)
    if(xpProgress) {
      const currentLevelXP = (rewards.level - 1) * 100;
      const nextLevelXP = rewards.level * 100;
      const progress = ((rewards.totalPoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
      xpProgress.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // Check for new achievements and level ups
    setTimeout(() => {
      if(rewards.newLevelUnlocked) {
        toonLevelUpPopup(rewards.level);
        // Reset flag
        rewards.newLevelUnlocked = false;
        import('./storage.js').then(storage => storage.saveRewards(leeftijd, rewards));
      }
      
      if(rewards.newAchievements && rewards.newAchievements.length > 0) {
        toonAchievementPopup(rewards.newAchievements[0]);
        // Remove shown achievement
        rewards.newAchievements.shift();
        import('./storage.js').then(storage => storage.saveRewards(leeftijd, rewards));
      }
    }, 500);
  } catch(error) {
    console.error('Error updating rewards display:', error);
  }
}

function toonLevelUpPopup(level) {
  const levelupDetails = document.getElementById('levelup-details');
  levelupDetails.innerHTML = `
    <div style="font-size: 3rem; margin: 1rem 0;">🎉</div>
    <p style="font-size: 1.3rem; margin: 0.5rem 0;">Je bent nu <strong>Level ${level}</strong>!</p>
    <p style="color: #666;">Geweldig werk! Je wordt steeds beter!</p>
  `;
  levelupPopup.style.display = 'flex';
}

function toonAchievementPopup(achievement) {
  const achievementDetails = document.getElementById('achievement-details');
  achievementDetails.innerHTML = `
    <div style="font-size: 3rem; margin: 1rem 0;">${achievement.name.split(' ')[0]}</div>
    <p style="font-size: 1.2rem; margin: 0.5rem 0;"><strong>${achievement.name.slice(2)}</strong></p>
    <p style="color: #666;">${achievement.desc}</p>
  `;
  achievementPopup.style.display = 'flex';
}

function toonStats() {
  const stats = getStats(leeftijd);
  const statsOverview = document.getElementById('stats-overview');
  const achievementsGrid = document.getElementById('achievements-grid');
  
  // Stats cards
  statsOverview.innerHTML = `
    <div class="stat-card ${stats.level >= 5 ? 'highlight' : ''}">
      <div class="stat-number">${stats.level}</div>
      <div class="stat-label">Level</div>
    </div>
    <div class="stat-card ${stats.totalPoints >= 100 ? 'highlight' : ''}">
      <div class="stat-number">${stats.totalPoints}</div>
      <div class="stat-label">Totaal Punten</div>
    </div>
    <div class="stat-card ${stats.streak >= 3 ? 'highlight' : ''}">
      <div class="stat-number">${stats.streak}</div>
      <div class="stat-label">Huidige Streak</div>
    </div>
    <div class="stat-card ${stats.accuracy >= 80 ? 'highlight' : ''}">
      <div class="stat-number">${stats.accuracy}%</div>
      <div class="stat-label">Accuracy</div>
    </div>
  `;
  
  // Achievements grid
  const allAchievements = [
    { id: 'first_correct', name: '🎯 Eerste Goed!', desc: 'Je eerste goede antwoord' },
    { id: 'streak_3', name: '🔥 3-Dag Streak!', desc: '3 dagen op rij gespeeld' },
    { id: 'streak_7', name: '⚡ Week Warrior!', desc: '7 dagen op rij gespeeld' },
    { id: 'level_5', name: '⭐ Level 5!', desc: 'Level 5 bereikt' },
    { id: 'level_10', name: '🏆 Level 10!', desc: 'Level 10 bereikt' },
    { id: 'points_100', name: '💯 Honderd Punten!', desc: '100 punten verzameld' },
    { id: 'points_500', name: '🚀 Vijfhonderd Punten!', desc: '500 punten verzameld' }
  ];
  
  achievementsGrid.innerHTML = allAchievements.map(achievement => {
    const unlocked = stats.achievements.includes(achievement.id);
    return `
      <div class="achievement ${unlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
        <div class="achievement-name">${achievement.name.slice(2)}</div>
        <div class="achievement-desc">${achievement.desc}</div>
      </div>
    `;
  }).join('');
} 