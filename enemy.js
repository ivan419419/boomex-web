import {findPath} from './maze.js';
export class Enemy{
 constructor(x,y,tileSize,speed=1){this.x=x;this.y=y;this.tileSize=tileSize;this.speed=speed;this.rethink=0;this.path=[];this.size=22;this.phase=Math.random()*Math.PI*2;}
 update(map,columns=13,rows=13,dt=16.667,target=null){const step=Math.min(dt,50);this.rethink-=step;this.phase+=step/130;
  if(!this.path.length){const from={x:Math.floor(this.x/this.tileSize),y:Math.floor(this.y/this.tileSize)};const to=target?{x:Math.floor(target.x/this.tileSize),y:Math.floor(target.y/this.tileSize)}:null;let goal=to&&map[to.y]?.[to.x]===0?to:null;
   if(!goal){const choices=[];for(let y=1;y<rows-1;y++)for(let x=1;x<columns-1;x++)if(map[y][x]===0&&(x!==from.x||y!==from.y))choices.push({x,y});goal=choices[Math.floor(Math.random()*choices.length)];}
   this.path=goal?findPath(map,from,goal).slice(1):[];this.rethink=target?700+Math.random()*350:1000+Math.random()*700;
  }
  if(this.path.length){const node=this.path[0],tx=node.x*this.tileSize+this.tileSize/2,ty=node.y*this.tileSize+this.tileSize/2,dx=tx-this.x,dy=ty-this.y,d=Math.hypot(dx,dy),amount=this.speed*step/16.667;if(d<=amount+0.5){this.x=tx;this.y=ty;this.path.shift();}else{this.x+=dx/d*amount;this.y+=dy/d*amount;}}
 }
 draw(ctx){const bob=Math.sin(this.phase)*1.5;ctx.save();ctx.shadowColor='#ff3fa4';ctx.shadowBlur=10;ctx.fillStyle='#ff3fa4';ctx.beginPath();ctx.ellipse(this.x,this.y+bob,11,10+Math.sin(this.phase*1.4),0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#ffe4f2';ctx.beginPath();ctx.arc(this.x-4,this.y-2+bob,2,0,Math.PI*2);ctx.arc(this.x+4,this.y-2+bob,2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#45183d';ctx.beginPath();ctx.arc(this.x-4,this.y-2+bob,0.9,0,Math.PI*2);ctx.arc(this.x+4,this.y-2+bob,0.9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,170,220,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(this.x,this.y+2+bob,3,.2,Math.PI-.2);ctx.stroke();ctx.restore();}
}
