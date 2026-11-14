import { CARDIO_TYPES, cardioActivity } from "./cardio-catalog.ts";
import { z } from "zod";
import { EXERCISE_CATALOG, CATALOG_VERSION } from "./exercise-catalog.ts";

export const GROUPS = ["胸部", "肩部", "背部", "腿部", "手臂", "其他"] as const;
const id = z.string().min(1).max(100);
const name = z.string().trim().min(1, "请填写名称").max(80);
export const dateKey = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !isNaN(Date.parse(v)) && dateKey(new Date(v + "T12:00:00")) === v,
    "日期无效",
  );
export const exerciseSchema = z.object({ id, name, group: z.enum(GROUPS), demoId: z.string().max(100).optional() });
export const setSchema = z.object({
  weight: z.number().finite().min(0).max(1000),
  reps: z.number().int().min(1).max(200),
  rpe: z.number().min(1).max(10).nullable(),
});
export const workoutSchema = z
  .object({
    id,
    date,
    name,
    note: z.string().max(2000),
    entries: z
      .array(
        z.object({ exerciseId: id, sets: z.array(setSchema).min(1).max(100) }),
      )
      .min(1)
      .max(50),
  })
  .refine((w) => w.date <= dateKey(), "训练日期不能晚于今天")
  .refine(
    (w) =>
      new Set(w.entries.map((e) => e.exerciseId)).size === w.entries.length,
    "同一动作请添加训练组",
  );
const optionalMetric = (min: number, max: number) =>
  z.number().finite().min(min).max(max).nullable();
export const cardioSchema = z.object({
  id, date, activity: z.enum(CARDIO_TYPES),
  minutes: z.number().finite().positive("时长必须大于0").max(1440),
  calories: optionalMetric(0, 20000),
  calorieSource: z.enum(["器械显示", "手表 / 手环", "手动填写"]),
  distance: optionalMetric(0,1000), speed: optionalMetric(0,100),
  incline: optionalMetric(-20,100), level: z.number().int().min(0).max(100).nullable(),
  heartRate: z.number().int().min(30).max(250).nullable(), note: z.string().max(2000),
}).refine(c=>c.date<=dateKey(),"训练日期不能晚于今天");
export type CardioSession = z.infer<typeof cardioSchema>;
export const bodySchema = z
  .object({
    id,
    date,
    weight: optionalMetric(20, 400),
    fat: optionalMetric(1, 70),
    chest: optionalMetric(20, 250),
    waist: optionalMetric(20, 250),
    arm: optionalMetric(5, 100),
    shoulder: optionalMetric(20, 250),
    thigh: optionalMetric(10, 150),
  })
  .refine((b) => b.date <= dateKey(), "日期不能晚于今天")
  .refine(
    (b) =>
      [b.weight, b.fat, b.chest, b.waist, b.arm, b.shoulder, b.thigh].some(
        (v) => v !== null,
      ),
    "至少填写一项身体数据",
  );
export const programSchema = z
  .object({
    id,
    name,
    days: z
      .array(
        z.object({
          day: z.number().int().min(0).max(6),
          name,
          entries: z
            .array(
              z.object({
                exerciseId: id,
                sets: z.number().int().min(1).max(20),
                reps: z.number().int().min(1).max(100),
              }),
            )
            .min(1)
            .max(30),
        }),
      )
      .min(1)
      .max(7),
  })
  .refine(
    (p) => new Set(p.days.map((d) => d.day)).size === p.days.length,
    "每个训练日只能出现一次",
  )
  .refine(
    (p) =>
      p.days.every(
        (d) =>
          new Set(d.entries.map((e) => e.exerciseId)).size === d.entries.length,
      ),
    "同一训练日不能重复添加动作",
  );
export const goalSchema = z
  .object({
    id,
    name,
    type: z.enum(["weight", "sessions"]),
    exerciseId: id,
    target: z.number().positive().max(100000),
    sets: z.number().int().min(1).max(100),
    reps: z.number().int().min(1).max(200),
  })
  .refine(
    (g) => g.type !== "sessions" || Number.isInteger(g.target),
    "目标训练次数必须为整数",
  )
  .refine(
    (g) => g.type !== "weight" || g.target <= 1000,
    "目标重量不能超过 1000 kg",
  );
export const stateSchema = z
  .object({
    version: z.literal(1),
    catalogVersion: z.number().int().min(0).max(CATALOG_VERSION).optional(),
    exercises: z.array(exerciseSchema).min(1).max(500),
    workouts: z.array(workoutSchema).max(15000),
    cardio: z.array(cardioSchema).max(15000).default([]),
    body: z.array(bodySchema).max(15000),
    programs: z.array(programSchema).max(100),
    goals: z.array(goalSchema).max(100),
    settings: z.object({
      name: z.string().trim().min(1).max(40),
      weeklyTarget: z.number().int().min(1).max(14),
    }),
  })
  .superRefine((s, ctx) => {
    const ids = new Set(s.exercises.map((e) => e.id));
    for (const [key, items] of Object.entries({
      exercises: s.exercises,
      workouts: s.workouts,
      cardio: s.cardio,
      body: s.body,
      programs: s.programs,
      goals: s.goals,
    }))
      if (new Set(items.map((i) => i.id)).size !== items.length)
        ctx.addIssue({ code: "custom", message: `${key} 含重复标识` });
    const refs = [
      ...s.workouts.flatMap((w) => w.entries.map((e) => e.exerciseId)),
      ...s.programs.flatMap((p) =>
        p.days.flatMap((d) => d.entries.map((e) => e.exerciseId)),
      ),
      ...s.goals.filter((g) => g.type === "weight").map((g) => g.exerciseId),
    ];
    if (refs.some((ref) => !ids.has(ref)))
      ctx.addIssue({ code: "custom", message: "数据引用了不存在的动作" });
    if (new Set(s.body.map((b) => b.date)).size !== s.body.length)
      ctx.addIssue({ code: "custom", message: "同一天只能有一条身体记录" });
  });
export type Exercise = z.infer<typeof exerciseSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type Body = z.infer<typeof bodySchema>;
export type Program = z.infer<typeof programSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type State = z.infer<typeof stateSchema>;
export type TrainingSet = z.infer<typeof setSchema>;
export const builtinExercises = (): Exercise[] => EXERCISE_CATALOG.map(e => ({
  id: e.id, name: e.name, group: e.group, demoId: e.id,
}));
/** Add only missing built-ins. Existing IDs, names, training and custom data are preserved. */
export function mergeBuiltinExercises(state: State): State {
  const exercises = state.exercises.map(ex => {
    if (ex.demoId !== undefined) return ex;
    const guide = EXERCISE_CATALOG.find(g => g.name === ex.name.trim() && g.group === ex.group);
    return guide ? { ...ex, demoId: guide.id } : ex;
  });
  const ids = new Set(exercises.map(e => e.id));
  const names = new Set(exercises.map(e => `${e.group}:${e.name.trim()}`));
  for (const ex of builtinExercises()) {
    if (exercises.length >= 500) break;
    if (ids.has(ex.id) || names.has(`${ex.group}:${ex.name}`)) continue;
    exercises.push(ex);
    ids.add(ex.id);
    names.add(`${ex.group}:${ex.name}`);
  }
  return { ...state, exercises, catalogVersion: CATALOG_VERSION };
}
export const upgradeCatalog = (state: State): State =>
  state.catalogVersion === CATALOG_VERSION ? state : mergeBuiltinExercises(state);
export const initialState = (): State => ({
  version: 1,
  catalogVersion: CATALOG_VERSION,
  exercises: builtinExercises(),
  workouts: [], cardio: [], body: [], programs: [], goals: [],
  settings: { name: "训练者", weeklyTarget: 4 },
});
export const uid = () => crypto.randomUUID();
export const volume = (sets: TrainingSet[]) =>
  sets.reduce((n, s) => n + s.weight * s.reps, 0);
export const totalVolume = (w: Workout) =>
  w.entries.reduce((n, e) => n + volume(e.sets), 0);
export const rm = (s: TrainingSet) =>
  s.reps === 1 ? s.weight : s.weight * (1 + s.reps / 30);
export const number = (n: number, d = 0) =>
  n.toLocaleString("zh-CN", { maximumFractionDigits: d });
export const sortedWorkouts = (s: State) =>
  [...s.workouts].reverse().sort((a, b) => b.date.localeCompare(a.date));
export const exerciseHistory = (s: State, exerciseId: string) =>
  [...s.workouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((w) => {
      const e = w.entries.find((e) => e.exerciseId === exerciseId);
      return e
        ? [
            {
              id: w.id,
              date: w.date,
              weight: Math.max(...e.sets.map((s) => s.weight)),
              reps: Math.max(...e.sets.map((s) => s.reps)),
              volume: volume(e.sets),
              rm: Math.max(...e.sets.map(rm)),
              sets: e.sets,
            },
          ]
        : [];
    });
export const PR_TYPES = {
  weight: "最大重量",
  reps: "最多次数",
  volume: "最高容量",
  rm: "估算 1RM",
};
export type PR = {
  exerciseId: string;
  type: keyof typeof PR_TYPES;
  value: number;
  date: string;
  workoutId: string;
  initial: boolean;
};
export function prHistory(s: State): PR[] {
  const history: PR[] = [];
  for (const e of s.exercises) {
    const best = { weight: 0, reps: 0, volume: 0, rm: 0 };
    const seen = { weight: false, reps: false, volume: false, rm: false };
    for (const h of exerciseHistory(s, e.id)) {
      for (const key of Object.keys(best) as (keyof typeof best)[])
        if (h[key] > best[key]) {
          history.push({
            exerciseId: e.id,
            type: key,
            value: h[key],
            date: h.date,
            workoutId: h.id,
            initial: !seen[key],
          });
          best[key] = h[key];
          seen[key] = true;
        }
    }
  }
  return history.sort((a, b) => b.date.localeCompare(a.date));
}
export function goalProgress(s: State, g: Goal) {
  if (g.type === "sessions") return s.workouts.length;
  return Math.max(
    0,
    ...s.workouts.flatMap((w) =>
      w.entries
        .filter((e) => e.exerciseId === g.exerciseId)
        .filter(
          (e) => e.sets.filter((set) => set.reps >= g.reps).length >= g.sets,
        )
        .map(
          (e) =>
            [...e.sets]
              .filter((set) => set.reps >= g.reps)
              .sort((a, b) => b.weight - a.weight)[g.sets - 1].weight,
        ),
    ),
  );
}
export const achieved = (s: State, g: Goal) => goalProgress(s, g) >= g.target;
export function weekStart(d = new Date(dateKey() + "T12:00:00")) {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}
export function inDays(date: string, days: number) {
  if (days === 0) return true;
  const start = new Date(dateKey() + "T12:00:00");
  start.setDate(start.getDate() - days + 1);
  return date >= dateKey(start);
}
export const BODY_LABELS = {
  weight: "体重",
  fat: "体脂率",
  chest: "胸围",
  waist: "腰围",
  arm: "臂围",
  shoulder: "肩围",
  thigh: "大腿围",
};
export const bodyUnit = (key: string) =>
  key === "weight" ? "kg" : key === "fat" ? "%" : "cm";
export function csvCell(value: unknown) {
  const text = String(value ?? "");
  return (
    '"' +
    (/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""') +
    '"'
  );
}
export function trainingCSV(s: State) {
  const rows: unknown[][] = [
    [
      "日期",
      "训练名称",
      "动作",
      "肌群",
      "组",
      "重量(kg)",
      "次数",
      "RPE",
      "组容量(kg)",
      "训练备注",
    ],
  ];
  for (const w of sortedWorkouts(s))
    for (const e of w.entries) {
      const ex = s.exercises.find((x) => x.id === e.exerciseId);
      e.sets.forEach((set, i) =>
        rows.push([
          w.date,
          w.name,
          ex?.name,
          ex?.group,
          i + 1,
          set.weight,
          set.reps,
          set.rpe,
          set.weight * set.reps,
          w.note,
        ]),
      );
    }
  return "\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}
export function bodyCSV(s: State) {
  const keys = Object.keys(BODY_LABELS) as (keyof typeof BODY_LABELS)[];
  const rows: unknown[][] = [
    ["日期", ...keys.map((k) => `${BODY_LABELS[k]}(${bodyUnit(k)})`)],
    ...[...s.body]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((b) => [b.date, ...keys.map((k) => b[k])]),
  ];
  return "\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

export function cardioTotals(sessions: CardioSession[]) {
  const known = sessions.filter(c=>c.calories !== null);
  return { sessions:sessions.length, minutes:sessions.reduce((n,c)=>n+c.minutes,0),
    calories:known.length ? known.reduce((n,c)=>n+c.calories!,0) : null,
    missingCalories:sessions.length-known.length };
}
export function cardioCSV(s: State) {
  const rows: unknown[][] = [["日期","有氧项目","时长(分钟)","热量(kcal)","热量来源","距离(km)","速度(km/h)","坡度(%)","档位","平均心率(bpm)","备注"]];
  for(const c of [...s.cardio].sort((a,b)=>b.date.localeCompare(a.date))) rows.push([c.date,cardioActivity(c.activity).name,c.minutes,c.calories,c.calorieSource,c.distance,c.speed,c.incline,c.level,c.heartRate,c.note]);
  return "\ufeff" + rows.map(r=>r.map(csvCell).join(",")).join("\r\n");
}
