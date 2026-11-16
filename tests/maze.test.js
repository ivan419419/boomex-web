import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMaze, findPath, buildSpiralRoute } from '../maze.js';

function seeded(seed) { return () => ((seed=(seed*1664525+1013904223)>>>0)/4294967296); }

test('500 mapas têm corredores e inimigos conectados ao início', () => {
  for(let seed=1;seed<=500;seed++) {
    const {map,start,enemySpawns}=generateMaze(13,13,seeded(seed));
    assert.equal(enemySpawns.length,3);
    for(const enemy of enemySpawns) assert.ok(findPath(map,start,enemy).length>5);
    for(let y=0;y<map.length;y++) for(let x=0;x<map[y].length;x++)
      if(map[y][x]===0) assert.ok(findPath(map,start,{x,y}).length,`mapa ${seed}: ${x},${y}`);
  }
});

test('a rota do fogo anda somente por corredores, inclusive ao reiniciar o trajeto', () => {
  for(let seed=1;seed<=100;seed++) {
    const {map,start}=generateMaze(13,13,seeded(seed));
    const path=buildSpiralRoute(map,start);
    assert.ok(path.length>5);
    path.forEach((p,i)=>{const next=path[(i+1)%path.length];assert.equal(map[p.y][p.x],0);assert.equal(Math.abs(next.x-p.x)+Math.abs(next.y-p.y),1);});
  }
});

test('busca de caminho retorna vazio quando não há rota', () => {
  assert.equal(findPath([[0,1,0]],{x:0,y:0},{x:2,y:0}).length,0);
});
