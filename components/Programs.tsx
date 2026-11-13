"use client";
import { useState } from "react";
import {
  Plus,
  Play,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { Program, programSchema, uid, dateKey } from "@/lib/model";
import { useGym } from "./context";
import { Card, SectionHead, Empty, Modal, Field, ErrorText } from "./ui";
import Goals from "./Goals";
const DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
export default function Programs() {
  const { data, commit, remove, saving, openWorkout } = useGym();
  const [edit, setEdit] = useState<Program | null>(null);
  const [error, setError] = useState("");
  const today = (new Date(dateKey() + "T12:00:00").getDay() + 6) % 7;
  const start = (program: Program, day: Program["days"][number]) =>
    openWorkout(
      {
        id: uid(),
        date: dateKey(),
        name: `${program.name} · ${day.name}`,
        note: "",
        entries: day.entries.map((e) => ({
          exerciseId: e.exerciseId,
          sets: Array.from({ length: e.sets }, () => ({
            weight: 0,
            reps: e.reps,
            rpe: null,
          })),
        })),
      },
      true,
    );
  const create = () => {
    setError("");
    setEdit({
      id: uid(),
      name: "我的训练计划",
      days: [
        {
          day: today,
          name: "力量训练",
          entries: [{ exerciseId: data.exercises[0].id, sets: 3, reps: 8 }],
        },
      ],
    });
  };
  function template() {
    const find = (name: string) =>
      data.exercises.find((e) => e.name === name)?.id || data.exercises[0].id;
    setError("");
    setEdit({
      id: uid(),
      name: "每周四练",
      days: [
        {
          day: 0,
          name: "胸部 · 三头",
          entries: [
            { exerciseId: find("平板杠铃卧推"), sets: 5, reps: 5 },
            { exerciseId: find("上斜哑铃卧推"), sets: 3, reps: 10 },
            { exerciseId: find("绳索下压"), sets: 3, reps: 12 },
          ],
        },
        {
          day: 1,
          name: "背部 · 二头",
          entries: [
            { exerciseId: find("高位下拉"), sets: 4, reps: 10 },
            { exerciseId: find("杠铃划船"), sets: 3, reps: 8 },
            { exerciseId: find("杠铃弯举"), sets: 3, reps: 10 },
          ],
        },
        {
          day: 3,
          name: "肩部",
          entries: [
            { exerciseId: find("杠铃推肩"), sets: 4, reps: 6 },
            { exerciseId: find("哑铃侧平举"), sets: 3, reps: 12 },
            { exerciseId: find("反向飞鸟"), sets: 3, reps: 12 },
          ],
        },
        {
          day: 4,
          name: "腿部",
          entries: [
            { exerciseId: find("杠铃深蹲"), sets: 4, reps: 6 },
            { exerciseId: find("罗马尼亚硬拉"), sets: 3, reps: 8 },
            { exerciseId: find("腿弯举"), sets: 3, reps: 12 },
          ],
        },
      ],
    });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const checked = programSchema.safeParse(edit);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      return;
    }
    if (
      checked.data.days.some(
        (d) =>
          new Set(d.entries.map((e) => e.exerciseId)).size !== d.entries.length,
      )
    ) {
      setError("同一训练日请勿重复添加动作");
      return;
    }
    if (
      await commit(
        {
          ...data,
          programs: data.programs.some((p) => p.id === checked.data.id)
            ? data.programs.map((p) =>
                p.id === checked.data.id ? checked.data : p,
              )
            : [...data.programs, checked.data],
        },
        "训练计划已保存",
      )
    )
      setEdit(null);
  }
  function updateDay(index: number, update: Partial<Program["days"][number]>) {
    if (edit)
      setEdit({
        ...edit,
        days: edit.days.map((d, i) => (i === index ? { ...d, ...update } : d)),
      });
  }
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>训练计划</h1>
          <p>让训练有节奏，让进步有方向。</p>
        </div>
        <button className="button primary" onClick={create}>
          <Plus size={16} />
          创建计划
        </button>
      </div>
      {!data.programs.length ? (
        <Card>
          <Empty
            title="为你的每一周，安排好进步"
            text="自由设置训练日、动作、组数和目标次数，训练时一键开始。"
            action={
              <div className="button-row">
                <button className="button primary" onClick={create}>
                  <Plus size={16} />
                  创建训练计划
                </button>
                <button className="button secondary" onClick={template}>
                  使用每周四练模板
                  <ArrowUpRight size={15} />
                </button>
              </div>
            }
          />
        </Card>
      ) : (
        data.programs.map((program) => (
          <Card className="program-card" key={program.id}>
            <SectionHead
              title={program.name}
              subtitle={`每周 ${program.days.length} 个训练日 · ${7 - program.days.length} 个休息日`}
              action={
                <div className="button-row">
                  <button
                    className="text-link"
                    onClick={() => {
                      setError("");
                      setEdit(structuredClone(program));
                    }}
                  >
                    <Pencil size={14} />
                    编辑
                  </button>
                  <button
                    className="icon-button"
                    aria-label="删除训练计划"
                    onClick={() =>
                      remove(
                        "删除训练计划",
                        `确定删除「${program.name}」？已经保存的训练记录将保留。`,
                        () =>
                          commit(
                            {
                              ...data,
                              programs: data.programs.filter(
                                (p) => p.id !== program.id,
                              ),
                            },
                            "训练计划已删除",
                          ),
                      )
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              }
            />
            <div className="program-week">
              {DAYS.map((label, i) => {
                const day = program.days.find((d) => d.day === i);
                return (
                  <div
                    className={`program-day ${today === i ? "is-today" : ""} ${day ? "training" : "rest"}`}
                    key={i}
                  >
                    <div className="program-day-top">
                      <span>{label}</span>
                      {today === i && <small>今天</small>}
                    </div>
                    <h3>{day?.name || "休息恢复"}</h3>
                    {day ? (
                      <>
                        <div className="program-exercises">
                          {day.entries.map((e, j) => (
                            <div key={j}>
                              <strong>
                                {
                                  data.exercises.find(
                                    (x) => x.id === e.exerciseId,
                                  )?.name
                                }
                              </strong>
                              <small>
                                {e.sets} 组 × {e.reps} 次
                              </small>
                            </div>
                          ))}
                        </div>
                        <button
                          className="button secondary"
                          onClick={() => start(program, day)}
                        >
                          <Play size={13} />
                          开始训练
                        </button>
                      </>
                    ) : (
                      <span className="rest-note">恢复也是进步的一部分</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))
      )}
      <Goals />
      {edit && (
        <Modal title="编辑每周训练计划" wide onClose={() => setEdit(null)}>
          <form onSubmit={save}>
            <div className="modal-body">
              <Field label="计划名称">
                <input
                  required
                  maxLength={80}
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </Field>
              <div className="day-toggles">
                {DAYS.map((day, i) => (
                  <button
                    type="button"
                    key={i}
                    className={
                      edit.days.some((d) => d.day === i) ? "active" : ""
                    }
                    onClick={() =>
                      setEdit({
                        ...edit,
                        days: edit.days.some((d) => d.day === i)
                          ? edit.days.filter((d) => d.day !== i)
                          : [
                              ...edit.days,
                              {
                                day: i,
                                name: "力量训练",
                                entries: [
                                  {
                                    exerciseId: data.exercises[0].id,
                                    sets: 3,
                                    reps: 8,
                                  },
                                ],
                              },
                            ].sort((a, b) => a.day - b.day),
                      })
                    }
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="form-hint">选中训练日；未选中的日期为休息日。</p>
              {edit.days.map((day, i) => (
                <div className="plan-day-editor" key={day.day}>
                  <div className="plan-day-heading">
                    <strong>{DAYS[day.day]}</strong>
                    <input
                      aria-label={`${DAYS[day.day]}训练名称`}
                      required
                      maxLength={80}
                      value={day.name}
                      onChange={(e) => updateDay(i, { name: e.target.value })}
                    />
                  </div>
                  <div className="plan-entry-labels">
                    <span>训练动作</span>
                    <span>组数</span>
                    <span>次数</span>
                    <span />
                  </div>
                  {day.entries.map((entry, j) => (
                    <div className="plan-entry" key={j}>
                      <select
                        aria-label={`${DAYS[day.day]}动作${j + 1}`}
                        value={entry.exerciseId}
                        onChange={(e) =>
                          updateDay(i, {
                            entries: day.entries.map((x, k) =>
                              j === k
                                ? { ...x, exerciseId: e.target.value }
                                : x,
                            ),
                          })
                        }
                      >
                        {data.exercises
                          .filter(
                            (e) =>
                              e.id === entry.exerciseId ||
                              !day.entries.some((x) => x.exerciseId === e.id),
                          )
                          .map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          ))}
                      </select>
                      <input
                        aria-label="目标组数"
                        required
                        type="number"
                        min={1}
                        max={20}
                        value={entry.sets || ""}
                        onChange={(e) =>
                          updateDay(i, {
                            entries: day.entries.map((x, k) =>
                              j === k
                                ? { ...x, sets: Number(e.target.value) }
                                : x,
                            ),
                          })
                        }
                      />
                      <input
                        aria-label="目标次数"
                        required
                        type="number"
                        min={1}
                        max={100}
                        value={entry.reps || ""}
                        onChange={(e) =>
                          updateDay(i, {
                            entries: day.entries.map((x, k) =>
                              j === k
                                ? { ...x, reps: Number(e.target.value) }
                                : x,
                            ),
                          })
                        }
                      />
                      <button
                        type="button"
                        className="icon-button"
                        disabled={day.entries.length === 1}
                        aria-label="删除计划动作"
                        onClick={() =>
                          updateDay(i, {
                            entries: day.entries.filter((_, k) => k !== j),
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-link"
                    disabled={day.entries.length >= data.exercises.length}
                    onClick={() => {
                      const next = data.exercises.find(
                        (e) => !day.entries.some((x) => x.exerciseId === e.id),
                      );
                      if (next)
                        updateDay(i, {
                          entries: [
                            ...day.entries,
                            { exerciseId: next.id, sets: 3, reps: 8 },
                          ],
                        });
                    }}
                  >
                    <Plus size={14} />
                    添加动作
                  </button>
                </div>
              ))}
              <ErrorText message={error} />
            </div>
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setEdit(null)}
              >
                取消
              </button>
              <button className="button primary" disabled={saving}>
                保存计划
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
