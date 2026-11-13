"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Copy, Check, Save } from "lucide-react";
import {
  Workout,
  dateKey,
  uid,
  workoutSchema,
  totalVolume,
  volume,
  number,
  sortedWorkouts,
} from "@/lib/model";
import { useGym } from "./context";
import { ExerciseInlineGuide } from "./ExerciseDemo";
import { Modal, Field, ErrorText } from "./ui";
export default function WorkoutEditor({
  workout,
  copy,
  onClose,
}: {
  workout?: Workout;
  copy?: boolean;
  onClose: () => void;
}) {
  const { data, commit, saving, notify } = useGym();
  const key = workout && !copy ? `gym-draft-${workout.id}` : "gym-draft-new";
  const fresh = (): Workout => ({
    id: uid(),
    date: dateKey(),
    name: "力量训练",
    note: "",
    entries: [
      {
        exerciseId: data.exercises[0].id,
        sets: [{ weight: 0, reps: 8, rpe: null }],
      },
    ],
  });
  const [form, setForm] = useState<Workout>(() => {
    if (workout)
      return {
        ...structuredClone(workout),
        ...(copy ? { id: uid(), date: dateKey() } : {}),
      };
    return fresh();
  });
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [draftStatus, setDraftStatus] = useState("草稿自动保存在本机");
  useEffect(() => {
    if (!workout || !copy) {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || "null");
        if (
          saved?.entries?.length &&
          saved.entries.every((e: any) =>
            data.exercises.some((x) => x.id === e.exerciseId),
          )
        ) {
          setForm({ ...saved, date: saved.date || dateKey() });
          setDraftStatus("已恢复上次未完成的草稿");
        }
      } catch {}
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(form));
    } catch {
      setDraftStatus("本机无法保存草稿，请及时完成训练");
    }
  }, [form, loaded]);
  const changeEntry = (
    i: number,
    updater: (entry: Workout["entries"][number]) => Workout["entries"][number],
  ) =>
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e, j) => (i === j ? updater(e) : e)),
    }));
  const changeSet = (
    i: number,
    j: number,
    key: "weight" | "reps" | "rpe",
    value: string,
  ) =>
    changeEntry(i, (e) => ({
      ...e,
      sets: e.sets.map((s, k) =>
        k === j
          ? {
              ...s,
              [key]:
                value === "" ? (key === "rpe" ? null : NaN) : Number(value),
            }
          : s,
      ),
    }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const checked = workoutSchema.safeParse(form);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      return;
    }
    const exists = data.workouts.some((w) => w.id === form.id);
    if (
      await commit(
        {
          ...data,
          workouts: exists
            ? data.workouts.map((w) => (w.id === form.id ? checked.data : w))
            : [...data.workouts, checked.data],
        },
        exists ? "训练记录已更新" : "训练完成，数据已保存",
      )
    ) {
      localStorage.removeItem(key);
      onClose();
    }
  }
  function copyLast() {
    const last = sortedWorkouts(data)[0];
    if (!last) {
      notify("还没有可复制的训练记录");
      return;
    }
    setForm({ ...structuredClone(last), id: form.id, date: form.date });
    notify("已复制最近一次训练，可直接修改每组数据");
  }
  return (
    <Modal
      title={workout && !copy ? "编辑训练记录" : "记录一次训练"}
      wide
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="modal-body workout-editor">
          <div className="form-grid">
            <Field label="训练名称">
              <input
                required
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="训练日期">
              <input
                required
                type="date"
                max={dateKey()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
          </div>
          <div className="editor-tools">
            <span>
              <Check size={13} />
              {draftStatus}
            </span>
            <button type="button" className="text-link" onClick={copyLast}>
              <Copy size={14} />
              复制上次训练
            </button>
          </div>
          {form.entries.map((entry, i) => (
            <div className="exercise-editor" key={i}>
              <div className="exercise-editor-head">
                <div className="exercise-number">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <select
                  aria-label={`第${i + 1}个训练动作`}
                  value={entry.exerciseId}
                  onChange={(e) =>
                    changeEntry(i, (x) => ({
                      ...x,
                      exerciseId: e.target.value,
                    }))
                  }
                >
                  {data.exercises
                    .filter(
                      (e) =>
                        e.id === entry.exerciseId ||
                        !form.entries.some((x) => x.exerciseId === e.id),
                    )
                    .map((e) => (
                      <option value={e.id} key={e.id}>
                        {e.name} · {e.group}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="移除动作"
                  disabled={form.entries.length === 1}
                  onClick={() =>
                    setForm({
                      ...form,
                      entries: form.entries.filter((_, j) => i !== j),
                    })
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <ExerciseInlineGuide exercise={data.exercises.find(e => e.id === entry.exerciseId)!}/>
              <div className="set-head">
                <span>组</span>
                <span>重量 kg</span>
                <span>次数</span>
                <span>RPE</span>
                <span>容量 kg</span>
                <span />
              </div>
              {entry.sets.map((set, j) => (
                <div className="set-row" key={j}>
                  <span className="set-num">{j + 1}</span>
                  <input
                    aria-label={`动作${i + 1}第${j + 1}组重量`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={1000}
                    step="0.25"
                    required
                    value={Number.isFinite(set.weight) ? set.weight : ""}
                    onChange={(e) => changeSet(i, j, "weight", e.target.value)}
                  />
                  <input
                    aria-label={`动作${i + 1}第${j + 1}组次数`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={200}
                    step={1}
                    required
                    value={Number.isFinite(set.reps) ? set.reps : ""}
                    onChange={(e) => changeSet(i, j, "reps", e.target.value)}
                  />
                  <input
                    aria-label={`动作${i + 1}第${j + 1}组RPE`}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={10}
                    step="0.5"
                    placeholder="选填"
                    value={set.rpe ?? ""}
                    onChange={(e) => changeSet(i, j, "rpe", e.target.value)}
                  />
                  <span className="set-volume">
                    {number(set.weight * set.reps || 0)}
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={entry.sets.length === 1}
                    aria-label={`删除第${j + 1}组`}
                    onClick={() =>
                      changeEntry(i, (e) => ({
                        ...e,
                        sets: e.sets.filter((_, k) => j !== k),
                      }))
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div className="exercise-editor-foot">
                <button
                  type="button"
                  className="text-link"
                  disabled={entry.sets.length >= 100}
                  onClick={() =>
                    changeEntry(i, (e) => ({
                      ...e,
                      sets: [...e.sets, { ...e.sets[e.sets.length - 1] }],
                    }))
                  }
                >
                  <Plus size={15} />
                  添加一组
                </button>
                <span>
                  动作容量 <b>{number(volume(entry.sets) || 0)}</b> kg
                </span>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-exercise"
            disabled={
              form.entries.length >= data.exercises.length ||
              form.entries.length >= 50
            }
            onClick={() => {
              const next = data.exercises.find(
                (e) => !form.entries.some((x) => x.exerciseId === e.id),
              );
              if (next)
                setForm({
                  ...form,
                  entries: [
                    ...form.entries,
                    {
                      exerciseId: next.id,
                      sets: [{ weight: 0, reps: 8, rpe: null }],
                    },
                  ],
                });
            }}
          >
            <Plus size={17} />
            添加训练动作
          </button>
          <Field label="训练备注 · 选填">
            <textarea
              rows={2}
              maxLength={2000}
              placeholder="今天的状态、动作感受，或下一次想改进的地方…"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Field>
          <p className="form-hint">
            重量按单次所用负重填写；哑铃请保持统一口径。自重动作可记录额外负重（0
            kg），容量仅统计填写的负重。
          </p>
          <ErrorText message={error} />
        </div>
        <div className="modal-actions">
          <div className="total-volume">
            总训练量 <strong>{number(totalVolume(form) || 0)}</strong> kg
          </div>
          <button type="submit" disabled={saving} className="button primary">
            <Save size={16} />
            {saving ? "正在保存…" : "完成并保存"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
