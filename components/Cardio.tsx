import { useState } from 'react';
import { Plus, Timer, Flame, Activity, Pencil, Trash2, Copy, Download, ArrowUpRight } from 'lucide-react';
import { cardioSchema, cardioTotals, cardioCSV, dateKey, uid, number, weekStart, type CardioSession } from '@/lib/model';
import { CARDIO_ACTIVITIES, CARDIO_GUIDES, cardioActivity } from '@/lib/cardio-catalog';
import { download } from '@/lib/storage';
import { useGym } from './context';
import { Card, Field, Modal, ErrorText, Empty, SectionHead, Stat } from './ui';
import { TrendChart } from './charts';
import { ExercisePreview, ExerciseDemoModal } from './ExerciseDemo';

export function CardioSummary() {
  const { data, navigate } = useGym();
  const total = cardioTotals(data.cardio.filter(c=>c.date>=dateKey(weekStart()) && c.date<=dateKey()));
  return <Card className="cardio-dashboard"><SectionHead title="本周有氧" subtitle="时间与热量，单独记录每一次坚持" action={<button className="text-link" onClick={()=>{navigate('workout');location.hash='cardio';}}>记录 / 查看有氧<ArrowUpRight size={14}/></button>}/><div className="cardio-summary-values"><div><Timer size={18}/><strong>{number(total.minutes,1)}</strong><span>分钟</span></div><div><Flame size={18}/><strong>{total.calories===null?'--':number(total.calories,1)}</strong><span>kcal</span></div><div><Activity size={18}/><strong>{total.sessions}</strong><span>次有氧</span></div></div><p className="form-hint">{total.missingCalories ? `${total.missingCalories} 条记录未填写热量，未计入热量合计。` : '热量按你填写的器械、手表或手动数据合计。'}</p></Card>;
}

export function CardioRecords() {
  const { data, commit, remove, saving, notify } = useGym();
  const [editor,setEditor] = useState<{session?:CardioSession;copy?:boolean}|null>(null);
  const [activity,setActivity] = useState('全部'); const [month,setMonth] = useState('');
  const [metric,setMetric] = useState<'minutes'|'calories'>('minutes');
  const sessions = [...data.cardio].reverse().sort((a,b)=>b.date.localeCompare(a.date)).filter(c=>(activity==='全部'||c.activity===activity)&&(!month||c.date.startsWith(month)));
  const total=cardioTotals(sessions);
  const daily=new Map<string,number>();
  for(const c of sessions){const val=c[metric];if(val!==null)daily.set(c.date,(daily.get(c.date)||0)+val);}
  const chart=[...daily].sort(([a],[b])=>a.localeCompare(b)).map(([date,value])=>({date,value}));
  return <><div className="cardio-intro"><div><h2>有氧训练记录</h2><p>记录每次时长、热量与器械设置，跟踪耐力训练。</p></div><button className="button primary" onClick={()=>setEditor({})}><Plus size={16}/>记录有氧</button></div>
    <div className="filter-bar cardio-filters"><select aria-label="筛选有氧项目" value={activity} onChange={e=>setActivity(e.target.value)}><option>全部</option>{CARDIO_ACTIVITIES.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select><input aria-label="筛选有氧月份" type="month" value={month} onChange={e=>setMonth(e.target.value)}/>{(activity!=='全部'||month)&&<button className="text-link" onClick={()=>{setActivity('全部');setMonth('');}}>重置筛选</button>}<button className="text-link" onClick={()=>{download(`gym-cardio-${dateKey()}.csv`,cardioCSV(data),'text/csv;charset=utf-8');notify('全部有氧 CSV 已导出');}}><Download size={14}/>导出全部 CSV</button></div>
    <div className="cardio-stats"><Stat label="筛选结果 · 有氧次数" value={total.sessions} unit="次" icon={<Activity size={18}/>} detail="力量与有氧分别统计"/><Stat label="累计有氧时长" value={number(total.minutes,1)} unit="分钟" icon={<Timer size={18}/>} detail="仅累计已保存的实际时长"/><Stat label="已记录热量合计" value={total.calories===null?'--':number(total.calories,1)} unit="kcal" icon={<Flame size={18}/>} detail={total.missingCalories?`${total.missingCalories} 条未填写热量`:'按填写值合计，不自动估算'}/></div>
    <Card><SectionHead title="有氧变化趋势" subtitle="按天合计，跟随上方筛选条件" action={<div className="segmented"><button className={metric==='minutes'?'active':''} onClick={()=>setMetric('minutes')}>时长</button><button className={metric==='calories'?'active':''} onClick={()=>setMetric('calories')}>热量</button></div>}/><TrendChart data={chart} unit={metric==='minutes'?'分钟':'kcal'} label={metric==='minutes'?'每日有氧时长':'每日已记录热量'} emptyText={metric==='minutes'?'保存有氧记录后在这里查看时长趋势':'填写热量后在这里查看热量趋势'}/>{metric==='calories'&&total.missingCalories>0&&<p className="form-hint">未填写的热量不绘制为零；同一天存在未填写记录时，仅合计该天已填写的值。</p>}</Card>
    {!sessions.length?<Card><Empty title={data.cardio.length?'没有匹配的有氧记录':'从一次有氧开始'} text="爬坡、骑行或跑步，记录时间，让坚持有迹可循。" action={<button className="button primary" onClick={()=>setEditor({})}>记录有氧</button>}/></Card>:<div className="workout-list">{sessions.map(c=>{const a=cardioActivity(c.activity);return <Card key={c.id} className="cardio-record"><div className="cardio-record-head"><div><span className="tag">有氧</span><h3>{a.name}</h3><p>{c.date}</p></div><div><strong>{number(c.minutes,1)} <small>分钟</small></strong><span>{c.calories===null?'热量未记录':`${number(c.calories,1)} kcal · ${c.calorieSource}`}</span></div></div><div className="cardio-chips">{c.distance!==null&&<span>{c.distance} km</span>}{c.speed!==null&&<span>速度 {c.speed} km/h</span>}{c.incline!==null&&<span>坡度 {c.incline}%</span>}{c.level!==null&&<span>档位 {c.level}</span>}{c.heartRate!==null&&<span>平均心率 {c.heartRate} bpm</span>}</div>{c.note&&<p className="workout-note">{c.note}</p>}<div className="workout-card-actions"><button className="text-link" onClick={()=>setEditor({session:c,copy:true})}><Copy size={14}/>复制为新记录</button><button className="text-link" onClick={()=>setEditor({session:c})}><Pencil size={14}/>编辑有氧</button><button className="text-link muted-danger" disabled={saving} onClick={()=>remove('删除有氧记录',`确定删除 ${c.date} 的「${a.name}」？`,()=>commit({...data,cardio:data.cardio.filter(x=>x.id!==c.id)},'有氧记录已删除'))}><Trash2 size={14}/>删除有氧</button></div></Card>;})}</div>}
    {editor&&<CardioEditor {...editor} onClose={()=>setEditor(null)}/>}</>;
}

export function CardioLibrary() {
  const [demo,setDemo]=useState<typeof CARDIO_GUIDES[number]|null>(null);
  const [preset,setPreset]=useState<string|null>(null);
  return <><div className="library-intro"><div><strong>有氧动作 <span>{CARDIO_ACTIVITIES.length}</span></strong><p>包含爬坡机、楼梯机、单车等。点开查看分解 GIF，或直接记录本次有氧。</p></div></div><div className="exercise-library">{CARDIO_GUIDES.map(g=><Card className="exercise-library-card" key={g.id}><ExercisePreview exercise={{...g,demoId:g.id}} onOpen={()=>setDemo(g)}/><div className="library-card-content"><div className="library-card-meta"><span className="tag">有氧</span><span>{g.equipment}</span></div><h3>{g.name}</h3><p className="library-english">时长 · 热量 · 距离</p><button className="text-link cardio-library-record" onClick={()=>setPreset(g.slug)}><Plus size={14}/>记录此项目</button></div></Card>)}</div>{demo&&<ExerciseDemoModal exercise={{...demo,demoId:demo.id}} onClose={()=>setDemo(null)}/>}{preset&&<CardioEditor activity={preset} onClose={()=>setPreset(null)}/>}</>;
}

type Numeric = 'minutes'|'calories'|'distance'|'speed'|'incline'|'level'|'heartRate';
export function CardioEditor({session,copy=false,activity='treadmill-incline-walk',onClose}:{session?:CardioSession;copy?:boolean;activity?:string;onClose:()=>void}) {
  const {data,commit,saving}=useGym();const [error,setError]=useState('');
  const [form,setForm]=useState<CardioSession>(()=>session?{...session,...(copy?{id:uid(),date:dateKey()}: {})}:{id:uid(),date:dateKey(),activity:activity as CardioSession['activity'],minutes:NaN,calories:null,calorieSource:'器械显示',distance:null,speed:null,incline:null,level:null,heartRate:null,note:''});
  const selected=cardioActivity(form.activity);
  function numeric(key:Numeric,label:string,min:number,max:number,step='0.1'){
    const value=form[key];return <Field key={key} label={label}><input aria-label={label} type="number" inputMode="decimal" min={min} max={max} step={step} required={key==='minutes'} placeholder={key==='minutes'?'必填':'选填'} value={value!==null&&Number.isFinite(value)?value:''} onChange={e=>setForm({...form,[key]:e.target.value===''?(key==='minutes'?NaN:null):Number(e.target.value)})}/></Field>;
  }
  async function save(e:React.FormEvent){e.preventDefault();const checked=cardioSchema.safeParse(form);if(!checked.success){setError(checked.error.issues[0]?.message||'请检查填写内容');return;}const next=data.cardio.some(c=>c.id===form.id)?data.cardio.map(c=>c.id===form.id?checked.data:c):[...data.cardio,checked.data];if(await commit({...data,cardio:next},'有氧训练已保存'))onClose();}
  return <Modal title={session&&!copy?'编辑有氧训练':'记录有氧训练'} onClose={onClose}><form onSubmit={save}><div className="modal-body"><Field label="有氧项目"><select value={form.activity} onChange={e=>setForm({...form,activity:e.target.value as CardioSession['activity'],speed:null,incline:null,level:null})}>{CARDIO_ACTIVITIES.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></Field><Field label="有氧日期"><input type="date" required max={dateKey()} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field><div className="cardio-form-grid">{numeric('minutes','有氧时长（分钟）',0.1,1440)}{numeric('calories','消耗热量（kcal）',0,20000)}</div><Field label="热量来源" hint="按器械或手表显示填写；不知道可以留空，不会自动估算。"><select value={form.calorieSource} onChange={e=>setForm({...form,calorieSource:e.target.value as CardioSession['calorieSource']})}>{['器械显示','手表 / 手环','手动填写'].map(s=><option key={s}>{s}</option>)}</select></Field><div className="cardio-form-grid">{numeric('distance','距离（km）',0,1000)}{selected.speed&&numeric('speed','速度（km/h）',0,100)}{selected.incline&&numeric('incline','坡度（%）',-20,100)}{selected.level&&numeric('level','器械档位 / 阻力等级',0,100,'1')}{numeric('heartRate','平均心率（bpm）',30,250,'1')}</div><Field label="有氧备注"><textarea maxLength={2000} rows={2} value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="例如：爬坡分段、体感、实际器械型号…"/></Field><ErrorText message={error}/></div><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>取消</button><button className="button primary" disabled={saving}>{saving?'正在保存…':'保存有氧记录'}</button></div></form></Modal>;
}
