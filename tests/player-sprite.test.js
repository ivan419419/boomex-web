import test from 'node:test';
import assert from 'node:assert/strict';

test('sprite do cão usa as quatro direções, anima o movimento e cabe no bloco de 32 pixels', async () => {
 const calls=[], listeners={}, context={save(){},restore(){},drawImage(...args){calls.push(args);}};
 const canvas={getContext(){return context;},addEventListener(name,fn){listeners['canvas:'+name]=fn;}};
 globalThis.document={getElementById(){return canvas;},addEventListener(name,fn){listeners['document:'+name]=fn;}};
 globalThis.window={addEventListener(name,fn){listeners['window:'+name]=fn;}};
 let image;globalThis.Image=class{constructor(){image=this;}};
 const {initPlayer,updatePlayer,setButtonDirection}=await import('../player.js');image.onload();
 const map=Array.from({length:13},(_,y)=>Array.from({length:13},(_,x)=>x===0||y===0||x===12||y===12?1:0));initPlayer(map,32,13,13);
 for(const [direction,row] of [[1,3],[2,1],[3,2],[4,0]]){setButtonDirection(direction);updatePlayer(130);const args=calls.at(-1);assert.equal(args[2],row*64);assert.equal(args[3],64);assert.equal(args[4],64);assert.equal(args[7],32);assert.equal(args[8],32);}
 setButtonDirection(1);updatePlayer(130);assert.equal(calls.at(-1)[2],192);setButtonDirection(0);updatePlayer(130);assert.equal(calls.at(-1)[2],192,'parado mantém a última direção');
});
