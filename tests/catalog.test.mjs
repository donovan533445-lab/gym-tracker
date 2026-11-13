import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initialState, upgradeCatalog, stateSchema, mergeBuiltinExercises } from '../lib/model.ts';
import { EXERCISE_CATALOG } from '../lib/exercise-catalog.ts';
function gifFrames(bytes) {
  assert.match(bytes.subarray(0,6).toString(), /^GIF8[79]a$/);
  let p=13, frames=0;
  if(bytes[10]&128) p+=3*(2**((bytes[10]&7)+1));
  const subBlocks=()=>{while(bytes[p]){const n=bytes[p++];p+=n;}p++;};
  while(p<bytes.length){
    const type=bytes[p++];
    if(type===0x3b) break;
    if(type===0x21){p++;subBlocks();}
    else if(type===0x2c){frames++;const flags=bytes[p+8];p+=9;if(flags&128)p+=3*(2**((flags&7)+1));p++;subBlocks();}
    else assert.fail(`Invalid GIF block ${type}`);
  }
  return frames;
}
test('100 unique exercises each have a real animated GIF, PNG poster and attributed source',()=>{
  assert.equal(EXERCISE_CATALOG.length,100);
  assert.equal(new Set(EXERCISE_CATALOG.map(e=>e.id)).size,100);
  assert.equal(new Set(EXERCISE_CATALOG.map(e=>e.slug)).size,100);
  const attribution=JSON.parse(readFileSync(new URL('../public/exercise-media/ATTRIBUTION.json',import.meta.url)));
  assert.equal(attribution.exercises.length,100);
  for(const e of EXERCISE_CATALOG){
    const media=JSON.parse(readFileSync(new URL(`../public/exercise-media/${e.slug}.json`,import.meta.url)));
    const gif=Buffer.from(media.gif.split(',')[1],'base64');
    assert.equal(gifFrames(gif),4,`${e.name} must contain the complete 1→2→3→2 sequence`);
    assert.ok(gif.includes(Buffer.from('NETSCAPE2.0')),`${e.name} must loop`);
    assert.equal(Buffer.from(media.poster.split(',')[1],'base64').subarray(1,4).toString(),'PNG');
    assert.equal(e.steps.length,3);
    assert.ok(e.steps.every(s=>s.length>8));
    assert.ok(e.sourceUrl.startsWith('https://bryllim.github.io/workout-guide/exercises/'));
  }
});
test('catalog upgrade preserves original IDs, custom exercises, renames and workout links',()=>{
  const state=initialState(); delete state.catalogVersion;
  state.exercises=state.exercises.filter(e=>/^exercise-\d-\d$/.test(e.id)).map(({demoId,...e})=>e);
  assert.equal(state.exercises.length,29);
  state.exercises[0].name='我自己的卧推名称';
  state.exercises.push({id:'custom',name:'自定义动作',group:'其他'});
  state.workouts=[{id:'old',name:'历史训练',date:'2026-01-01',note:'保留',entries:[{exerciseId:'exercise-0-0',sets:[{weight:50,reps:5,rpe:8}]}]}];
  const upgraded=upgradeCatalog(state);
  assert.equal(upgraded.exercises.length,101);
  assert.deepEqual(upgraded.workouts,state.workouts);
  assert.equal(upgraded.exercises[0].name,'我自己的卧推名称');
  assert.equal(upgraded.exercises[0].demoId,undefined,'renamed exercises do not silently get a different demo');
  assert.ok(upgraded.exercises.some(e=>e.id==='custom'));
  assert.ok(stateSchema.safeParse(upgraded).success);
  assert.equal(upgradeCatalog(upgraded),upgraded);
});
test('deleted built-ins stay deleted after reload; deliberate refill works without duplicates',()=>{
  const state=initialState();state.exercises=state.exercises.filter(e=>e.id!=='exercise-0-0');
  assert.equal(upgradeCatalog(state).exercises.length,99);
  assert.equal(mergeBuiltinExercises(state).exercises.length,100);
  const old=initialState();delete old.catalogVersion;old.exercises=[{id:'custom-bench',name:'平板杠铃卧推',group:'胸部'}];
  const migrated=upgradeCatalog(old);
  assert.equal(migrated.exercises.length,100);
  assert.equal(migrated.exercises.find(e=>e.name==='平板杠铃卧推').id,'custom-bench');
});
test('full custom catalogs are preserved within the schema limit',()=>{
  const state=initialState();delete state.catalogVersion;
  state.exercises=Array.from({length:500},(_,i)=>({id:`custom-${i}`,name:`自定义${i}`,group:'其他'}));
  const upgraded=upgradeCatalog(state);
  assert.equal(upgraded.exercises.length,500);
  assert.deepEqual(upgraded.exercises,state.exercises);
  assert.ok(stateSchema.safeParse(upgraded).success);
});
