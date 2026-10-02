const assert=require('node:assert/strict');const {Game,MAP,key}=require('./engine');
assert(MAP.every(r=>r.length===21));
const g=new Game();const reachable=new Set(),queue=[g.player];for(let i=0;i<queue.length;i++){const p=queue[i];if(reachable.has(key(p)))continue;reachable.add(key(p));queue.push(...g.neighbors(p).filter(n=>!reachable.has(key(n))));}assert([...g.pellets].every(p=>reachable.has(p)),'all pellets reachable');assert(g.ghosts.every(p=>reachable.has(key(p))),'ghost spawns connected');
g.state='running';g.player={x:1,y:2,dir:{x:0,y:-1}};g.wanted={x:0,y:-1};g.step();assert.equal(g.score,50);assert(g.power>0);const ghost=g.ghosts[0];ghost.x=g.player.x;ghost.y=g.player.y;g.collision(ghost);assert.equal(g.score,250);assert(ghost.cooldown>0);
g.power=0;ghost.cooldown=0;ghost.x=g.player.x;ghost.y=g.player.y;assert(g.collision(ghost));assert.equal(g.lives,2);assert.equal(g.state,'ready');
const paused=new Game();paused.state='paused';const before=JSON.stringify(paused);paused.step();assert.equal(JSON.stringify(paused),before);
const level=new Game();level.state='running';level.pellets=new Set(['9,15']);level.step();assert.equal(level.level,2);
const sim=new Game();sim.auto=true;for(let i=0;i<2000;i++){if(sim.state==='ready')sim.state='running';if(sim.state==='over')sim.reset(),sim.auto=true,sim.state='running';sim.step();assert(sim.open(sim.player.x,sim.player.y));for(const gh of sim.ghosts)assert(sim.open(gh.x,gh.y));}console.log('Passed: maze connectivity, power/scoring, collisions, pause, level progression, 2000-step agent simulation.');
