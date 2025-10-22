import {saveResult, getNextQuestion} from './storage.js';
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

let vragen = [];
let actieveVragen = [];
let huidig = null;
let leeftijd = null;
let categorieen = [];

/* -------- 0a. profiel kiezen -------- */
profileSection.addEventListener('click', async e=>{
  if(!e.target.dataset.age) return;
  leeftijd = Number(e.target.dataset.age);
  await zoekCategorieen();
  toonCategorieKeuze();
});

/* -------- 0b. zoek beschikbare categorieën -------- */
async function zoekCategorieen() {
  // Simpel: kijk welke bestanden bestaan in data/ voor deze leeftijd
  // Hardcoded voorbeeldcategorieën, in praktijk kun je dit dynamisch maken
  const cats = ['Dieren','Rekenen'];
  categorieen = [];
  for(const cat of cats) {
    const bestand = `data/groep${leeftijd}_${cat.toLowerCase()}.json`;
    try {
      const res = await fetch(bestand);
      if(res.ok) categorieen.push({naam:cat, bestand});
    } catch {}
  }
}

/* -------- 0c. toon categorieknoppen -------- */
function toonCategorieKeuze(){
  profileSection.hidden = true;
  catsSection.hidden    = false;
  catButtons.innerHTML  = '';
  categorieen.forEach(cat=>{
    const knop = document.createElement('button');
    knop.textContent = cat.naam;
    knop.onclick = ()=>startQuiz(cat);
    catButtons.appendChild(knop);
  });
  terugBtn.hidden = false;
}

terugBtn.onclick = ()=>{
  catsSection.hidden = true;
  profileSection.hidden = false;
};

/* -------- 1. Quiz starten met gekozen categorie -------- */
async function startQuiz(cat){
  // Laad vragen uit het juiste bestand
  const res = await fetch(cat.bestand);
  actieveVragen = await res.json();
  // Zet thema-kleur
  document.documentElement.style.setProperty('--primary', actieveVragen[0].kleur || '#4e9cff');
  catsSection.hidden = true;
  quizSection.hidden = false;
  toonVraag(selectQuestion(actieveVragen));
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
    userAnswer = btn.previousSibling.value.trim();
    if(!userAnswer) return;
  }

  const correct = (userAnswer.toLowerCase() === huidig.antwoord.toLowerCase());
  saveResult(leeftijd, huidig.id, correct);

  feedbackEl.textContent = correct ? 'Goed zo!' : `Helaas, juist antwoord: ${huidig.antwoord}` + (huidig.uitleg ? `\n${huidig.uitleg}` : '');
  if(btn) btn.classList.add(correct ? 'correct':'fout');
  volgendeBtn.hidden = false;
}

/* -------- 4. volgende vraag -------- */
volgendeBtn.onclick = ()=>{
  const q = getNextQuestion(actieveVragen);
  if(q){ toonVraag(q); }
  else  {
    vraagEl.textContent='Knap gedaan! Alle vragen beantwoord.';
    plaatjeEl.hidden=true;
    antwoordenEl.innerHTML='';
    volgendeBtn.hidden=true;
    feedbackEl.textContent = '';
  }
}; 