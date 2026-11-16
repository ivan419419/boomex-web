import {findPath} from './maze.js';
const enemyImage=new Image();let enemySprite=null;enemyImage.src='assets/images/bomberman_walk.png';
enemyImage.onload=()=>{const c=document.createElement('canvas');c.width=enemyImage.width;c.height=enemyImage.height;const x=c.getContext('2d');x.drawImage(enemyImage,0,0);const d=x.getImageData(0,0,c.width,c.height);for(let i=0;i<d.data.length;i+=4)if(d.data[i]>205&&d.data[i+1]>205&&d.data[i+2]>205)d.data[i+3]=0;x.putImageData(d,0,0);enemySprite=c;};
export class Enemy{
 constructor(x,y,tileSize,speed=1){this.x=x;this.y=y;this.tileSize=tileSize;this.speed=speed;this.rethink=0;this.path=[];this.target=null;this.size=22;}
 update(map,columns=13,rows=13,dt=16.667,target=null){const step=Math.min(dt,50);this.rethink-=step;
  if(!this.path.length){const from={x:Math.floor(this.x/this.tileSize),y:Math.floor(this.y/this.tileSize)};const to=target?{x:Math.floor(target.x/this.tileSize),y:Math.floor(target.y/this.tileSize)}:null;let goal=to&&map[to.y]?.[to.x]===0?to:null;
   if(!goal){const choices=[];for(let y=1;y<rows-1;y++)for(let x=1;x<columns-1;x++)if(map[y][x]===0&&(x!==from.x||y!==from.y))choices.push({x,y});goal=choices[Math.floor(Math.random()*choices.length)];}
   this.path=goal?findPath(map,from,goal).slice(1):[];this.rethink=target?700+Math.random()*350:1000+Math.random()*700;
  }
  if(this.path.length){const node=this.path[0],tx=node.x*this.tileSize+this.tileSize/2,ty=node.y*this.tileSize+this.tileSize/2,dx=tx-this.x,dy=ty-this.y,d=Math.hypot(dx,dy),amount=this.speed*step/16.667;if(d<=amount+0.5){this.x=tx;this.y=ty;this.path.shift();}else{this.x+=dx/d*amount;this.y+=dy/d*amount;}}
 }
 draw(ctx){if(enemySprite){ctx.save();ctx.filter='hue-rotate(290deg) saturate(2) brightness(1.35)';ctx.drawImage(enemySprite,this.x-15,this.y-15,30,30);ctx.restore();}else{ctx.fillStyle='#ff3fa4';ctx.shadowColor='#ff3fa4';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(this.x,this.y,12,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.fillRect(this.x-5,this.y-3,3,3);ctx.fillRect(this.x+3,this.y-3,3,3);}}
}
