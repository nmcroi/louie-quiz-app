const KEY = 'spelenderwijs-progress';
const REWARD_KEY = 'spelenderwijs-rewards';

/* sla resultaat op in localStorage EN update beloningen */
export function saveResult(age,id,correct){
  const data = JSON.parse(localStorage.getItem(KEY) || '{}');
  if(!data[age]) data[age]={};
  data[age][id] = {correct, ts:Date.now()};
  localStorage.setItem(KEY, JSON.stringify(data));
  
  // Update beloningssysteem
  if(correct) {
    addPoints(age, 10); // 10 punten per goede vraag
    updateStreak(age);
    checkAchievements(age);
  }
}

/* kies de eerstvolgende onbeantwoorde vraag */
export function getNextQuestion(vragen){
  const data = JSON.parse(localStorage.getItem(KEY) || '{}');
  return vragen.find(v=>!(data?.[v.leeftijd]?.[v.id]));
}

/* === BELONINGSSYSTEEM === */

/* voeg punten toe en update level */
export function addPoints(age, points) {
  const rewards = getRewards(age);
  rewards.points += points;
  rewards.totalPoints += points;
  
  // Level up check (elke 100 punten = level up)
  const newLevel = Math.floor(rewards.totalPoints / 100) + 1;
  if(newLevel > rewards.level) {
    rewards.level = newLevel;
    rewards.newLevelUnlocked = true;
    rewards.lastLevelUp = Date.now();
  }
  
  saveRewards(age, rewards);
  return rewards;
}

/* update daily streak */
export function updateStreak(age) {
  const rewards = getRewards(age);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24*60*60*1000).toDateString();
  
  if(rewards.lastPlayDate === today) {
    // Al gespeeld vandaag
    return rewards;
  } else if(rewards.lastPlayDate === yesterday) {
    // Streak continues
    rewards.streak++;
  } else {
    // Streak broken or first time
    rewards.streak = 1;
  }
  
  rewards.lastPlayDate = today;
  if(rewards.streak > rewards.maxStreak) {
    rewards.maxStreak = rewards.streak;
  }
  
  saveRewards(age, rewards);
  return rewards;
}

/* haal beloningsdata op */
export function getRewards(age) {
  const rewards = JSON.parse(localStorage.getItem(REWARD_KEY) || '{}');
  if(!rewards[age]) {
    rewards[age] = {
      points: 0,
      totalPoints: 0,
      level: 1,
      streak: 0,
      maxStreak: 0,
      lastPlayDate: null,
      achievements: [],
      newLevelUnlocked: false,
      lastLevelUp: null
    };
  }
  return rewards[age];
}

/* sla beloningsdata op */
export function saveRewards(age, rewardData) {
  const rewards = JSON.parse(localStorage.getItem(REWARD_KEY) || '{}');
  rewards[age] = rewardData;
  localStorage.setItem(REWARD_KEY, JSON.stringify(rewards));
}

/* check voor nieuwe achievements */
export function checkAchievements(age) {
  const rewards = getRewards(age);
  const newAchievements = [];
  
  // Achievement definities
  const achievements = [
    { id: 'first_correct', name: '🎯 Eerste Goed!', desc: 'Je eerste goede antwoord', condition: () => rewards.totalPoints >= 10 },
    { id: 'streak_3', name: '🔥 3-Dag Streak!', desc: '3 dagen op rij gespeeld', condition: () => rewards.streak >= 3 },
    { id: 'streak_7', name: '⚡ Week Warrior!', desc: '7 dagen op rij gespeeld', condition: () => rewards.streak >= 7 },
    { id: 'level_5', name: '⭐ Level 5!', desc: 'Level 5 bereikt', condition: () => rewards.level >= 5 },
    { id: 'level_10', name: '🏆 Level 10!', desc: 'Level 10 bereikt', condition: () => rewards.level >= 10 },
    { id: 'points_100', name: '💯 Honderd Punten!', desc: '100 punten verzameld', condition: () => rewards.totalPoints >= 100 },
    { id: 'points_500', name: '🚀 Vijfhonderd Punten!', desc: '500 punten verzameld', condition: () => rewards.totalPoints >= 500 }
  ];
  
  achievements.forEach(achievement => {
    if(!rewards.achievements.includes(achievement.id) && achievement.condition()) {
      rewards.achievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  });
  
  if(newAchievements.length > 0) {
    rewards.newAchievements = newAchievements;
    saveRewards(age, rewards);
  }
  
  return newAchievements;
}

/* haal stats op voor display */
export function getStats(age) {
  const progress = JSON.parse(localStorage.getItem(KEY) || '{}');
  const rewards = getRewards(age);
  
  const userProgress = progress[age] || {};
  const totalAnswered = Object.keys(userProgress).length;
  const correctAnswers = Object.values(userProgress).filter(a => a.correct).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  
  return {
    totalAnswered,
    correctAnswers,
    accuracy,
    ...rewards
  };
} 