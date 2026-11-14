import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cardioSchema, cardioTotals, cardioCSV, stateSchema, initialState } from '../lib/model.ts';
import { CARDIO_GUIDES, CARDIO_ACTIVITIES } from '../lib/cardio-catalog.ts';
const sample=()=>({id:'cardio1',date:'2026-01-01',activity:'treadmill-incline-walk',minutes:30,calories:260,calorieSource:'器械显示',distance:2.5,speed:5,incline:12,level:null,heartRate:135,note:'爬坡记录'});
test('incline cardio validates duration, optional metrics and dates',()=>{
 assert.ok(cardioSchema.safeParse(sample()).success);
 for(const patch of [{minutes:0},{minutes:-1},{minutes:Infinity},{calories:-1},{heartRate:260},{level:1.5},{date:'2999-01-01'},{date:'2026-02-31'},{activity:'unknown'}]) assert.equal(cardioSchema.safeParse({...sample(),...patch}).success,false,JSON.stringify(patch));
 assert.ok(cardioSchema.safeParse({...sample(),calories:null,distance:null,speed:null,incline:null,heartRate:null}).success);
});
test('missing calories are distinct from measured zero and time totals are accurate',()=>{
 assert.deepEqual(cardioTotals([]),{sessions:0,minutes:0,calories:null,missingCalories:0});
 const a=sample(),b={...sample(),id:'b',minutes:15,calories:null},c={...sample(),id:'c',minutes:10,calories:0};
 assert.deepEqual(cardioTotals([a,b,c]),{sessions:3,minutes:55,calories:260,missingCalories:1});
 assert.equal(cardioTotals([c]).calories,0);assert.equal(cardioTotals([b]).calories,null);
});
test('legacy backup gets an empty cardio list without changing strength data',()=>{
 const old=initialState();delete old.cardio;
 const parsed=stateSchema.parse(old);assert.deepEqual(parsed.cardio,[]);assert.deepEqual(parsed.workouts,old.workouts);assert.deepEqual(parsed.exercises,old.exercises);
 parsed.cardio=[sample()];assert.deepEqual(stateSchema.parse(JSON.parse(JSON.stringify(parsed))).cardio,parsed.cardio);
 parsed.cardio.push(sample());assert.equal(stateSchema.safeParse(parsed).success,false);
});
test('cardio CSV exports Chinese activity and preserves all metrics with safe escaping',()=>{
 const s=initialState();s.cardio=[{...sample(),note:'=1+1'}];const csv=cardioCSV(s);
 assert.ok(csv.startsWith('\ufeff'));assert.ok(csv.includes('爬坡机 / 跑步机爬坡'));assert.ok(csv.includes('260'));assert.ok(csv.includes('12'));assert.ok(csv.includes("'=1+1"));assert.equal(csv.split('\r\n').length,2);
});
test('12 cardio activities each have their own real GIF and attribution',()=>{
 assert.equal(CARDIO_ACTIVITIES.length,12);assert.equal(new Set(CARDIO_GUIDES.map(g=>g.id)).size,12);
 for(const g of CARDIO_GUIDES){const m=JSON.parse(readFileSync(new URL(`../public/exercise-media/${g.slug}.json`,import.meta.url)));const bytes=Buffer.from(m.gif.split(',')[1],'base64');assert.equal(bytes.subarray(0,6).toString(),'GIF89a');assert.ok(bytes.includes(Buffer.from('NETSCAPE2.0')));}
 const attr=JSON.parse(readFileSync(new URL('../public/exercise-media/CARDIO_ATTRIBUTION.json',import.meta.url)));assert.equal(attr.exercises.length,12);
});
