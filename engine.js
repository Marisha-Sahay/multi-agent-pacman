(function(root){
'use strict';
const MAP=[
'#####################',
'#o........#........o#',
'#.###.###.#.###.###.#',
'#...................#',
'#.###.#.#####.#.###.#',
'#.....#...#...#.....#',
'#####.###.#.###.#####',
'#.....#.......#.....#',
'#.###.#.## ##.#.###.#',
'#.......#   #.......#',
'#.###.#.#####.#.###.#',
'#.....#.......#.....#',
'#####.#.#####.#.#####',
'#.........#.........#',
'#.###.###.#.###.###.#',
'#o..#...........#..o#',
'###.#.#.#####.#.#.###',
'#.....#...#...#.....#',
'#.#######.#.#######.#',
'#...................#',
'#####################'];
const DIRS=[{x:0,y:-1},{x:-1,y:0},{x:0,y:1},{x:1,y:0}];
const key=p=>`${p.x},${p.y}`;
const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
class Game{
 constructor(){this.reset();}
 reset(){this.level=1;this.score=0;this.lives=3;this.tick=0;this.power=0;this.state='ready';this.auto=false;this.load();}
 load(){this.pellets=new Set();this.powers=new Set();MAP.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='.'||c==='o')this.pellets.add(`${x},${y}`);if(c==='o')this.powers.add(`${x},${y}`);}));this.spawn();}
 spawn(){this.player={x:10,y:15,dir:{x:-1,y:0}};this.wanted={x:-1,y:0};this.power=0;this.chain=0;this.ghosts=[['Blinky','#ff5b73',10,7,'Chase'],['Pinky','#ff9bd4',9,9,'Ambush'],['Inky','#50d9f7',10,9,'Flank'],['Clyde','#ffb85b',11,9,'Patrol']].map(([name,color,x,y,strategy],i)=>({name,color,x,y,strategy,id:i,dir:{x:0,y:-1},cooldown:0,target:{x:0,y:0}}));}
 open(x,y){return y>=0&&y<MAP.length&&x>=0&&x<MAP[0].length&&MAP[y][x]!=='#';}
 neighbors(p){return DIRS.map(d=>({x:p.x+d.x,y:p.y+d.y,dir:d})).filter(p=>this.open(p.x,p.y));}
 path(start,target){const q=[{...start}],seen=new Set([key(start)]),parents=new Map();let end=start;for(let i=0;i<q.length;i++){const p=q[i];if(distance(p,target)<distance(end,target))end=p;if(key(p)===key(target)){end=p;break;}for(const n of this.neighbors(p)){if(!seen.has(key(n))){seen.add(key(n));parents.set(key(n),p);q.push(n);}}}if(key(end)===key(start))return start;let p=end;while(parents.has(key(p))&&key(parents.get(key(p)))!==key(start))p=parents.get(key(p));return p;}
 autoDirection(){const threat=this.ghosts.filter(g=>!g.cooldown);const candidates=this.neighbors(this.player);let best=candidates[0],bestScore=-Infinity;for(const n of candidates){let cost=Infinity;for(const p of this.pellets){const [x,y]=p.split(',').map(Number);cost=Math.min(cost,distance(n,{x,y}));}let value=-cost+(this.pellets.has(key(n))?2:0);for(const g of threat){const d=distance(n,g);value+=this.power?(d<5?6-d:0):-(d<5?(5-d)*6:0);}if(n.dir.x===this.player.dir.x&&n.dir.y===this.player.dir.y)value+=0.3;if(value>bestScore){bestScore=value;best=n;}}return best?.dir||this.player.dir;}
 target(g){const p=this.player,corner=[{x:19,y:1},{x:1,y:1},{x:19,y:19},{x:1,y:19}][g.id];if(this.tick%180<35)return corner;if(g.id===0)return p;if(g.id===1)return{x:p.x+p.dir.x*4,y:p.y+p.dir.y*4};if(g.id===2){const b=this.ghosts[0],ahead={x:p.x+p.dir.x*2,y:p.y+p.dir.y*2};return{x:2*ahead.x-b.x,y:2*ahead.y-b.y};}return distance(g,p)<7?corner:p;}
 collision(g,crossed=false){if(g.cooldown||(!crossed&&distance(g,this.player)!==0))return false;if(this.power){this.score+=200*2**this.chain++;g.x=10;g.y=9;g.cooldown=16;return false;}this.lives--;if(this.lives<=0)this.state='over';else{this.spawn();this.state='ready';}return true;}
 step(){if(this.state!=='running')return;this.tick++;if(this.power>0)this.power--;const previous={...this.player};if(this.auto)this.wanted=this.autoDirection();if(this.open(this.player.x+this.wanted.x,this.player.y+this.wanted.y))this.player.dir={...this.wanted};const d=this.player.dir;if(this.open(this.player.x+d.x,this.player.y+d.y)){this.player.x+=d.x;this.player.y+=d.y;}const k=key(this.player);if(this.pellets.delete(k)){this.score+=10;if(this.powers.delete(k)){this.power=65;this.chain=0;this.score+=40;}}
 for(const g of this.ghosts)if(this.collision(g))return;
 for(const g of this.ghosts){if(g.cooldown){g.cooldown--;continue;}if(this.tick%(this.power?2:5)===0)continue;const old={...g};g.target=this.target(g);let next;if(this.power){const choices=this.neighbors(g);choices.sort((a,b)=>distance(b,this.player)-distance(a,this.player));next=choices[0];}else next=this.path(g,g.target);if(next){g.dir={x:next.x-g.x,y:next.y-g.y};g.x=next.x;g.y=next.y;}const crossed=old.x===this.player.x&&old.y===this.player.y&&g.x===previous.x&&g.y===previous.y;if(this.collision(g,crossed))return;}
 if(this.pellets.size===0){this.level++;this.load();this.state='ready';}
 }
}
const api={Game,MAP,DIRS,key,distance};if(typeof module!=='undefined')module.exports=api;else root.Pacman=api;
})(typeof window==='undefined'?globalThis:window);
