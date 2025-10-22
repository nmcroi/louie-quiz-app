/* simpele hulpfuncties; later uitbreiden naar echte adaptiviteit */

export function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

/* kies een vraag op basis van gemakkelijke→moeilijk volgorde */
export function selectQuestion(vragen){
  return vragen.sort((a,b)=>a.moeilijk-b.moeilijk)[0];
} 