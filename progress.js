const STORAGE_KEY='boomex.progress.v1';
const EMPTY=Object.freeze({bestScore:0,unlockedLevel:1,gamesPlayed:0});
let memoryCache={...EMPTY};
function defaultStorage(){try{return globalThis.localStorage;}catch{return null;}}
function normalize(value){return{bestScore:Number.isSafeInteger(value?.bestScore)&&value.bestScore>=0?value.bestScore:0,unlockedLevel:Number.isSafeInteger(value?.unlockedLevel)&&value.unlockedLevel>=1?Math.min(value.unlockedLevel,999):1,gamesPlayed:Number.isSafeInteger(value?.gamesPlayed)&&value.gamesPlayed>=0?value.gamesPlayed:0};}
export function loadProgress(storage=defaultStorage()){if(!storage)return{...memoryCache};try{const raw=storage.getItem(STORAGE_KEY);memoryCache=raw?normalize(JSON.parse(raw)):{...EMPTY};return{...memoryCache};}catch(error){if(error instanceof SyntaxError)memoryCache={...EMPTY};return{...memoryCache};}}
export function saveProgress({score=0,completedLevel=null,gameEnded=false}={},storage=defaultStorage()){const prior=loadProgress(storage);const safeScore=Number.isSafeInteger(score)&&score>=0?score:0;memoryCache={bestScore:Math.max(prior.bestScore,safeScore),unlockedLevel:completedLevel===null?prior.unlockedLevel:Math.max(prior.unlockedLevel,Math.min(999,completedLevel+1)),gamesPlayed:prior.gamesPlayed+(gameEnded?1:0)};try{storage?.setItem(STORAGE_KEY,JSON.stringify(memoryCache));}catch{/* Continue in memory if private mode or storage quota blocks writes. */}return{...memoryCache};}
export function resetProgress(storage=defaultStorage()){memoryCache={...EMPTY};try{storage?.removeItem(STORAGE_KEY);}catch{}return{...memoryCache};}
export const PROGRESS_STORAGE_KEY=STORAGE_KEY;
