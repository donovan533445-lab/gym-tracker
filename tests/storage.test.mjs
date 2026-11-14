import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DataRepository } from '../lib/storage.ts';
import { initialState } from '../lib/model.ts';
const repo = () => new DataRepository(`test-${crypto.randomUUID()}`);
test('new repository is empty and new instance preserves committed data', async () => {
  const name = `test-${crypto.randomUUID()}`;
  const first = new DataRepository(name);
  const loaded = await first.load();
  assert.equal(loaded.data.workouts.length, 0);
  loaded.data.settings.name = '持久化测试';
  assert.equal(await first.save(loaded.data, 0), 1);
  const second = await new DataRepository(name).load();
  assert.equal(second.data.settings.name, '持久化测试');
  assert.equal(second.revision, 1);
});
test('simultaneous writes with the same revision cannot overwrite each other', async () => {
  const r = repo();
  const a = initialState(); a.settings.name = 'A';
  const b = initialState(); b.settings.name = 'B';
  const results = await Promise.allSettled([r.save(a, 0), r.save(b, 0)]);
  assert.equal(results.filter(x=>x.status === 'fulfilled').length, 1);
  assert.equal(results.filter(x=>x.status === 'rejected').length, 1);
  assert.equal((await r.load()).revision, 1);
});
test('invalid data and stale revisions preserve the last valid state', async () => {
  const r = repo(); const d = initialState();
  await r.save(d, 0);
  await assert.rejects(r.save({...d, settings:{...d.settings, weeklyTarget:0}},1));
  await assert.rejects(r.save(d, 0), /另一标签页/);
  assert.equal((await r.load()).revision, 1);
});
test('corrupted stored state is surfaced without silently resetting it', async () => {
  const name = `test-${crypto.randomUUID()}`; const r = new DataRepository(name);
  await r.save(initialState(), 0);
  await new Promise((resolve, reject)=>{
    const q=indexedDB.open(name,1); q.onerror=reject;
    q.onsuccess=()=>{const db=q.result;const tx=db.transaction('state','readwrite');tx.objectStore('state').put({data:{bad:true},revision:4},'current');tx.oncomplete=()=>{db.close();resolve();};};
  });
  await assert.rejects(r.load(), /校验失败/);
  await assert.rejects(r.save(initialState(), 0), /另一标签页/);
});
test('legacy catalog migration is atomic, persistent and never resets training data', async()=>{
  const name=`test-${crypto.randomUUID()}`;
  const r=new DataRepository(name);const old=initialState();delete old.catalogVersion;
  old.exercises=old.exercises.filter(e=>/^exercise-\d-\d$/.test(e.id)).map(({demoId,...e})=>e);
  old.settings.name='历史用户';old.workouts=[{id:'historical',date:'2026-01-01',name:'旧记录',note:'保留',entries:[{exerciseId:'exercise-0-0',sets:[{weight:50,reps:5,rpe:8}]}]}];
  await r.save(old,0);
  const results=await Promise.all([r.load(),new DataRepository(name).load()]);
  for(const result of results){assert.equal(result.data.exercises.length,100);assert.equal(result.revision,2);assert.deepEqual(result.data.workouts,old.workouts);assert.equal(result.data.settings.name,'历史用户');}
  const state=results[0];state.data.exercises=state.data.exercises.filter(e=>e.id!=='exercise-0-1');
  await r.save(state.data,state.revision);
  const loaded=await r.load();assert.equal(loaded.data.exercises.length,99);assert.equal(loaded.revision,3);
});
test('cardio edits and deletion survive reopening without changing strength records',async()=>{
 const r=repo(),s=initialState();s.cardio=[{id:'cardio',date:'2026-01-01',activity:'stair-climber',minutes:20,calories:null,calorieSource:'器械显示',distance:null,speed:null,incline:null,level:5,heartRate:null,note:''}];
 let rev=await r.save(s,0);let loaded=await r.load();assert.equal(loaded.data.cardio[0].minutes,20);loaded.data.cardio[0].minutes=35;rev=await r.save(loaded.data,rev);loaded=await r.load();assert.equal(loaded.data.cardio[0].minutes,35);assert.deepEqual(loaded.data.workouts,s.workouts);await r.save({...loaded.data,cardio:[]},rev);assert.equal((await r.load()).data.cardio.length,0);
});
