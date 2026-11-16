import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProgress, saveProgress, resetProgress, PROGRESS_STORAGE_KEY } from '../progress.js';

function storage(initial=null){let value=initial;return{getItem(){return value;},setItem(key,next){assert.equal(key,PROGRESS_STORAGE_KEY);value=next;},removeItem(key){assert.equal(key,PROGRESS_STORAGE_KEY);value=null;},peek(){return value;}};}

test('recorde and unlocked levels persist locally and are never downgraded',()=>{
 const local=storage();assert.deepEqual(loadProgress(local),{bestScore:0,unlockedLevel:1,gamesPlayed:0,campaignComplete:false});
 assert.deepEqual(saveProgress({score:450,completedLevel:3,gameEnded:true},local),{bestScore:450,unlockedLevel:4,gamesPlayed:1,campaignComplete:false});
 assert.deepEqual(saveProgress({score:100,completedLevel:1},local),{bestScore:450,unlockedLevel:4,gamesPlayed:1,campaignComplete:false});
 assert.deepEqual(loadProgress(local),{bestScore:450,unlockedLevel:4,gamesPlayed:1,campaignComplete:false});
});

test('corrupt or unavailable local storage degrades safely to memory/default progress',()=>{
 const broken=storage('{not json');assert.deepEqual(loadProgress(broken),{bestScore:0,unlockedLevel:1,gamesPlayed:0,campaignComplete:false});
 const throwing={getItem(){throw Error('storage unavailable');},setItem(){throw Error('quota');},removeItem(){throw Error('blocked');}};
 assert.doesNotThrow(()=>saveProgress({score:90,completedLevel:1},throwing));
 assert.deepEqual(loadProgress(throwing),{bestScore:90,unlockedLevel:2,gamesPlayed:0,campaignComplete:false});
 assert.deepEqual(loadProgress(undefined),{bestScore:90,unlockedLevel:2,gamesPlayed:0,campaignComplete:false});
});

test('legacy saves above phase 25 migrate to the campaign cap',()=>{const local=storage(JSON.stringify({bestScore:3,unlockedLevel:80,gamesPlayed:1}));assert.equal(loadProgress(local).unlockedLevel,25);});

test('reset clears only this game progress',()=>{const local=storage();saveProgress({score:99,completedLevel:4},local);assert.deepEqual(resetProgress(local),{bestScore:0,unlockedLevel:1,gamesPlayed:0,campaignComplete:false});assert.equal(local.peek(),null);});
