const KEY = 'spelenderwijs-progress';

/* sla resultaat op in localStorage */
export function saveResult(age,id,correct){
  const data = JSON.parse(localStorage.getItem(KEY) || '{}');
  if(!data[age]) data[age]={};
  data[age][id] = {correct, ts:Date.now()};
  localStorage.setItem(KEY, JSON.stringify(data));
}

/* kies de eerstvolgende onbeantwoorde vraag */
export function getNextQuestion(vragen){
  const data = JSON.parse(localStorage.getItem(KEY) || '{}');
  return vragen.find(v=>!(data?.[v.leeftijd]?.[v.id]));
} 