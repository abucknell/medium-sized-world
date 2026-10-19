// Shared data helpers for the design concepts. Reads window.MSW (data.js).
(function(){
const D=window.MSW;
const TESTS=[
 {id:"t1",num:1,label:"1A",name:"Superlative Cities and Semantic Ideologies",runs:10},
 {id:"t6",num:6,label:"1B",name:"Least Advanced City",runs:10},
 {id:"t2",num:2,label:"2",name:"Object Permanence",runs:10},
 {id:"t3",num:3,label:"3",name:"Body in the Loop",runs:10},
 {id:"t4",num:4,label:"4",name:"Predigested Worlds",runs:10},
 {id:"t5",num:5,label:"5",name:"Uncomputable Surfaces",runs:10}];
const HTYPE={"Robed guards":"People","Grey child":"People","Disembodied arms":"People","Body-like rubbish":"People",
 "Pig creature":"Creatures","Dog":"Creatures","Egg blob":"Creatures","Cyborg spiders":"Creatures","Heron-like bird":"Creatures",
 "Human-chair hybrid":"Hybrids","Robot":"Machines","Blue robot bug":"Machines","Gun":"Weapons",
 "Glowing lamps":"Objects","Fire hydrant":"Objects","Extra plinths":"Objects",
 "Invented book title":"Text & interface","Game HUD":"Text & interface","Extra beagles":"Copies"};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
function test(label){return TESTS.find(t=>t.label===label)||TESTS[0]}
function worlds(t){return D.worlds.filter(w=>w.test===t.num).sort((a,b)=>a.num-b.num)}
function glitches(t){return D.glitches.filter(g=>g.test===t.num).sort((a,b)=>(a.world-b.world)||(secs(a.time)-secs(b.time)))}
function info(t){return D.tests[t.id]||{}}
function secs(s){const m=String(s||"").match(/(\d+):(\d{2})/);return m?(+m[1])*60+(+m[2]):0}
function spans(s){const out=[];const re=/(\d+):(\d{2})(?:\s*(?:to|-|–)\s*(\d+):(\d{2}))?/g;let m;while((m=re.exec(String(s||"")))){const a=+m[1]*60+ +m[2];out.push([a,m[3]?+m[3]*60+ +m[4]:a])}return out}
function stats(t){
 const ws=worlds(t),gs=glitches(t);
 const people=[];ws.forEach(w=>["caretaker","founder"].forEach(r=>{const c=(w.cast||{})[r];if(c&&c.race&&c.race!=="None")people.push(c)}));
 let yes=0,tot=0;ws.forEach(w=>Object.values(w.checks||{}).forEach(v=>{tot++;if(v==="yes")yes++;else if(v==="partial")yes+=.5}));
 const hall=ws.reduce((n,w)=>n+(w.hallucinations||[]).length,0);
 return {worlds:ws.length,runs:t.runs,glitches:gs.filter(g=>g.world).length,failed:gs.filter(g=>!g.world).length,
  people:people.length,white:people.filter(p=>p.race==="White").length,men:people.filter(p=>p.gender==="Man").length,
  hall,hallWorlds:ws.filter(w=>(w.hallucinations||[]).length).length,
  wash:ws.filter(w=>w.placeWash||["caretaker","founder"].some(r=>{const c=(w.cast||{})[r];return c&&c.previewRace&&c.previewRace!==c.race})).length,
  nw:ws.filter(w=>(w.nonWestern||[]).length).length,
  legible:ws.filter(w=>w.checks&&w.checks.diary==="yes").length,
  adherence:tot?Math.round(yes/tot*100):null};
}
function tally(ws,key){const m={};ws.forEach(w=>{const v=w[key];(Array.isArray(v)?v:v?[v]:[]).forEach(x=>m[x]=(m[x]||0)+1)});return Object.entries(m).sort((a,b)=>b[1]-a[1])}
function hallTypes(ws){const by={};ws.forEach(w=>(w.hallucinations||[]).forEach(x=>{const k=HTYPE[x]||"Other";(by[k]=by[k]||{})[x]=(by[k][x]||0)+1}));return by}
function cast(ws,role,key){const m={};ws.forEach(w=>{const c=(w.cast||{})[role];if(c&&c[key])m[c[key]]=(m[c[key]]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1])}
function numbered(text){return String(text||"").split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean)}
window.C={D,TESTS,esc,pad,test,worlds,glitches,info,secs,spans,stats,tally,hallTypes,cast,numbered};
})();
