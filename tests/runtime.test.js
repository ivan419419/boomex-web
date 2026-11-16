import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMaze } from '../maze.js';
import { saveProgress, loadProgress } from '../progress.js';

test('o estado local do jogo suporta pontuação, progressão, game over e continuidade após recarregar', () => {
  let data=null;const storage={getItem(){return data;},setItem(_key,value){data=value;}};
  assert.equal(loadProgress(storage).unlockedLevel,1);
  saveProgress({score:225,completedLevel:1,gameEnded:true},storage);
  const reloaded=loadProgress(storage);
  assert.equal(reloaded.bestScore,225);assert.equal(reloaded.unlockedLevel,2);assert.equal(reloaded.gamesPlayed,1);
  saveProgress({score:10,gameEnded:true},storage);
  assert.equal(loadProgress(storage).bestScore,225);assert.equal(loadProgress(storage).unlockedLevel,2);assert.equal(loadProgress(storage).gamesPlayed,2);
});

test('a nova fase continua acessível pelo mesmo início gerado',()=>{
 const level1=generateMaze(13,13,()=>.37),level2=generateMaze(13,13,()=>.71);
 assert.notDeepEqual(level1.map,level2.map);
 for(const p of level2.enemySpawns){let frontier=[level2.start],visited=new Set();while(frontier.length){const n=frontier.pop(),k=n.x+','+n.y;if(visited.has(k))continue;visited.add(k);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(level2.map[n.y+dy]?.[n.x+dx]===0)frontier.push({x:n.x+dx,y:n.y+dy});}assert(visited.has(p.x+','+p.y));}
});
