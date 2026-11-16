export const DIRECTIONS = [[1,0],[-1,0],[0,1],[0,-1]];

export function findPath(map, start, goal) {
  const rows=map.length, columns=map[0]?.length??0;
  const key=(x,y)=>`${x},${y}`;
  const queue=[[start.x,start.y]], parents=new Map([[key(start.x,start.y),null]]);
  for(let i=0;i<queue.length;i++){
    const [x,y]=queue[i]; if(x===goal.x&&y===goal.y) break;
    for(const [dx,dy] of DIRECTIONS){const nx=x+dx,ny=y+dy,k=key(nx,ny);
      if(nx<0||ny<0||nx>=columns||ny>=rows||map[ny][nx]!==0||parents.has(k))continue;
      parents.set(k,[x,y]);queue.push([nx,ny]);}
  }
  const end=key(goal.x,goal.y); if(!parents.has(end))return [];
  const path=[];let current=[goal.x,goal.y];while(current){path.push({x:current[0],y:current[1]});current=parents.get(key(...current));}
  return path.reverse();
}

export function generateMaze(columns=13,rows=13,random=Math.random,enemyCount=3){
  const map=Array.from({length:rows},()=>Array(columns).fill(1));
  const start={x:1,y:1};map[start.y][start.x]=0;
  const stack=[start],visited=new Set(['1,1']);
  while(stack.length){const current=stack.at(-1);const options=DIRECTIONS.map(([dx,dy])=>({x:current.x+dx*2,y:current.y+dy*2,dx,dy})).filter(p=>p.x>0&&p.y>0&&p.x<columns-1&&p.y<rows-1&&!visited.has(`${p.x},${p.y}`));
    if(!options.length){stack.pop();continue;}const next=options[Math.floor(random()*options.length)];map[current.y+next.dy][current.x+next.dx]=0;map[next.y][next.x]=0;visited.add(`${next.x},${next.y}`);stack.push({x:next.x,y:next.y});}
  // Destructible walls create optional shortcuts without cutting the generated maze paths.
  for(let y=1;y<rows-1;y++)for(let x=1;x<columns-1;x++)if(map[y][x]===1&&random()<0.30){
    const horizontal=map[y][x-1]===0&&map[y][x+1]===0,vertical=map[y-1][x]===0&&map[y+1][x]===0;
    if((horizontal||vertical)&&Math.abs(x-start.x)+Math.abs(y-start.y)>2)map[y][x]=2;
  }
  const floors=[];for(let y=1;y<rows-1;y++)for(let x=1;x<columns-1;x++)if(map[y][x]===0&&!(x===1&&y===1))floors.push({x,y});
  const far=floors.filter(p=>Math.abs(p.x-start.x)+Math.abs(p.y-start.y)>=6);
  for(let i=far.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[far[i],far[j]]=[far[j],far[i]];}
  const enemySpawns=far.slice(0,Math.min(Math.max(1,enemyCount),far.length));
  // A perfect-maze backbone guarantees an always-open route from spawn to every floor cell.
  const reachable=new Set();const q=[start];for(let i=0;i<q.length;i++){let p=q[i];let k=`${p.x},${p.y}`;if(reachable.has(k))continue;reachable.add(k);for(const [dx,dy] of DIRECTIONS){let x=p.x+dx,y=p.y+dy;if(map[y]?.[x]===0&&!reachable.has(`${x},${y}`))q.push({x,y});}}
  const allFloor=floors.every(p=>reachable.has(`${p.x},${p.y}`));
  if(!allFloor||enemySpawns.length<2)throw new Error('Gerador criou um labirinto sem conectividade ou espaço suficiente.');
  return {map,start,enemySpawns};
}

export function buildSpiralRoute(map,start){
  const rows=map.length,columns=map[0].length,order=[];
  let left=1,right=columns-2,top=1,bottom=rows-2;
  while(left<=right&&top<=bottom){for(let x=left;x<=right;x++)order.push({x,y:top});for(let y=top+1;y<=bottom;y++)order.push({x:right,y});if(bottom>top)for(let x=right-1;x>=left;x--)order.push({x,y:bottom});if(right>left)for(let y=bottom-1;y>top;y--)order.push({x:left,y});left++;right--;top++;bottom--;}
  const targets=order.filter(p=>map[p.y][p.x]===0&&!(p.x===start.x&&p.y===start.y));
  let route=[],cursor=start;for(const target of targets){const segment=findPath(map,cursor,target);if(segment.length>1){route.push(...segment.slice(1));cursor=target;}}
  if(route.length){const closing=findPath(map,cursor,route[0]);route.push(...closing.slice(1,-1));}
  return route.length?route:[start];
}
