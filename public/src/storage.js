const PROGRESS_KEY = 'spelenderwijs-progress';
const REWARDS_KEY = 'spelenderwijs-rewards';

/* ============================================
   PROGRESS TRACKING
============================================ */

/* Sla resultaat op in localStorage */
export function saveResult(age, id, correct) {
  const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  if(!data[age]) data[age] = {};
  data[age][id] = {correct, ts: Date.now()};
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  console.log(`Resultaat opgeslagen: ${id} = ${correct}`);
}

/* Kies de eerstvolgende onbeantwoorde vraag */
export function getNextQuestion(vragen) {
  const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  return vragen.find(v => !(data?.[v.leeftijd]?.[v.id]));
}

/* ============================================
   REWARDS SYSTEEM
============================================ */

const POINTS_PER_CORRECT = 10;
const POINTS_PER_LEVEL = 100;

// Achievement definities
const ACHIEVEMENTS = [
  {
    id: 'first_correct',
    name: '🎯 Eerste Goed!',
    desc: 'Je eerste goede antwoord',
    condition: (r) => r.totalCorrect >= 1
  },
  {
    id: 'streak_3',
    name: '🔥 3-Dag Streak!',
    desc: '3 dagen op rij gespeeld',
    condition: (r) => r.streak >= 3
  },
  {
    id: 'streak_7',
    name: '⚡ Week Warrior!',
    desc: '7 dagen op rij gespeeld',
    condition: (r) => r.streak >= 7
  },
  {
    id: 'level_5',
    name: '⭐ Level 5!',
    desc: 'Level 5 bereikt',
    condition: (r) => r.level >= 5
  },
  {
    id: 'level_10',
    name: '🏆 Level 10!',
    desc: 'Level 10 bereikt',
    condition: (r) => r.level >= 10
  },
  {
    id: 'points_100',
    name: '💯 Honderd Punten!',
    desc: '100 punten verzameld',
    condition: (r) => r.totalPoints >= 100
  },
  {
    id: 'points_500',
    name: '🚀 Vijfhonderd Punten!',
    desc: '500 punten verzameld',
    condition: (r) => r.totalPoints >= 500
  }
];

/* Haal huidige rewards data op */
export function getRewards() {
  const defaultRewards = {
    points: 0,           // Punten voor huidige level
    totalPoints: 0,      // Totaal punten ooit verdiend
    level: 1,            // Huidig level
    streak: 0,           // Dagen achter elkaar
    maxStreak: 0,        // Langste streak ooit
    lastPlayDate: null,  // Laatste keer gespeeld
    achievements: [],    // Unlocked achievement IDs
    totalCorrect: 0,     // Totaal aantal goede antwoorden
    totalAnswered: 0,    // Totaal aantal vragen beantwoord
    newLevelUnlocked: false,
    newAchievements: []
  };

  const stored = localStorage.getItem(REWARDS_KEY);
  return stored ? {...defaultRewards, ...JSON.parse(stored)} : defaultRewards;
}

/* Sla rewards data op */
function saveRewards(rewards) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}

/* Update rewards na een antwoord */
export function updateRewards(correct) {
  const rewards = getRewards();

  // Reset nieuwe unlocks
  rewards.newLevelUnlocked = false;
  rewards.newAchievements = [];

  // Update statistieken
  rewards.totalAnswered++;
  if(correct) {
    rewards.totalCorrect++;
    rewards.points += POINTS_PER_CORRECT;
    rewards.totalPoints += POINTS_PER_CORRECT;
    console.log(`+${POINTS_PER_CORRECT} punten! Totaal: ${rewards.totalPoints}`);
  }

  // Check voor level up
  const oldLevel = rewards.level;
  rewards.level = Math.floor(rewards.totalPoints / POINTS_PER_LEVEL) + 1;
  rewards.points = rewards.totalPoints % POINTS_PER_LEVEL;

  if(rewards.level > oldLevel) {
    rewards.newLevelUnlocked = true;
    console.log(`🎉 LEVEL UP! Nu level ${rewards.level}`);
  }

  // Update daily streak
  const today = new Date().toDateString();
  if(rewards.lastPlayDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if(rewards.lastPlayDate === yesterdayStr) {
      // Streak continues
      rewards.streak++;
      console.log(`🔥 Streak: ${rewards.streak} dagen`);
    } else if(rewards.lastPlayDate === null) {
      // Eerste keer
      rewards.streak = 1;
    } else {
      // Streak broken
      console.log('Streak is gereset');
      rewards.streak = 1;
    }

    rewards.lastPlayDate = today;
    if(rewards.streak > rewards.maxStreak) {
      rewards.maxStreak = rewards.streak;
    }
  }

  // Check voor nieuwe achievements
  const oldAchievements = [...rewards.achievements];
  ACHIEVEMENTS.forEach(achievement => {
    if(!rewards.achievements.includes(achievement.id) && achievement.condition(rewards)) {
      rewards.achievements.push(achievement.id);
      rewards.newAchievements.push(achievement);
      console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }
  });

  saveRewards(rewards);
  return rewards;
}

/* Haal XP percentage op voor huidige level */
export function getXPPercentage() {
  const rewards = getRewards();
  return (rewards.points / POINTS_PER_LEVEL) * 100;
}

/* Haal accuracy percentage op */
export function getAccuracy() {
  const rewards = getRewards();
  if(rewards.totalAnswered === 0) return 0;
  return Math.round((rewards.totalCorrect / rewards.totalAnswered) * 100);
}

/* Haal alle achievements op (locked + unlocked) */
export function getAllAchievements() {
  const rewards = getRewards();
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: rewards.achievements.includes(ach.id)
  }));
}

/* Reset alle data (voor testing) */
export function resetAllData() {
  if(confirm('Weet je zeker dat je alle voortgang wilt wissen?')) {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(REWARDS_KEY);
    console.log('Alle data gewist!');
    location.reload();
  }
}
