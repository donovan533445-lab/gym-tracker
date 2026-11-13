"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Copy,
  Pencil,
  Trash2,
  CalendarDays,
  Dumbbell,
  ArrowUpRight,
} from "lucide-react";
import {
  sortedWorkouts,
  totalVolume,
  number,
  Exercise,
  GROUPS,
  exerciseSchema,
  uid,
} from "@/lib/model";
import { useGym } from "./context";
import { Card, Empty, Modal, Field, ErrorText, SectionHead } from "./ui";
export default function Workouts() {
  const { data, openWorkout, remove, commit, navigate } = useGym();
  const [tab, setTab] = useState("history");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const workouts = sortedWorkouts(data).filter(
    (w) =>
      (!month || w.date.startsWith(month)) &&
      (!search ||
        [
          w.name,
          w.note,
          ...w.entries.map(
            (e) => data.exercises.find((x) => x.id === e.exerciseId)?.name,
          ),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>训练记录</h1>
          <p>认真记录每一组，见证每一次进步。</p>
        </div>
        <button className="button primary" onClick={() => openWorkout()}>
          <Plus size={17} />
          记录训练
        </button>
      </div>
      <div className="page-tabs">
        <button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          训练历史 <span>{data.workouts.length}</span>
        </button>
        <button
          className={tab === "exercises" ? "active" : ""}
          onClick={() => setTab("exercises")}
        >
          动作库 <span>{data.exercises.length}</span>
        </button>
      </div>
      {tab === "exercises" ? (
        <ExerciseLibrary />
      ) : (
        <>
          <div className="filter-bar">
            <label className="search-input">
              <Search size={17} />
              <input
                aria-label="搜索训练记录"
                placeholder="搜索训练名称、动作或备注"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label className="month-filter">
              <SlidersHorizontal size={16} />
              <input
                aria-label="筛选月份"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
            {(search || month) && (
              <button
                className="text-link"
                onClick={() => {
                  setSearch("");
                  setMonth("");
                }}
              >
                重置筛选
              </button>
            )}
          </div>
          {!workouts.length ? (
            <Card>
              <Empty
                title={
                  data.workouts.length
                    ? "没有匹配的训练"
                    : "第一条训练，值得被记录"
                }
                text={
                  data.workouts.length
                    ? "尝试调整搜索或月份筛选。"
                    : "从一个动作、一组重量开始，建立属于你的训练档案。"
                }
                action={
                  !data.workouts.length && (
                    <button
                      className="button primary"
                      onClick={() => openWorkout()}
                    >
                      <Plus size={16} />
                      记录第一次训练
                    </button>
                  )
                }
              />
            </Card>
          ) : (
            <div className="workout-list">
              {workouts.map((w) => (
                <Card key={w.id} className="workout-card">
                  <div className="workout-card-head">
                    <div className="workout-heading">
                      <span className="square-icon">
                        <Dumbbell size={22} />
                      </span>
                      <div>
                        <h2>{w.name}</h2>
                        <p>
                          <CalendarDays size={13} />
                          {w.date}
                          <span>·</span>
                          {w.entries.length} 个动作<span>·</span>
                          {w.entries.reduce((n, e) => n + e.sets.length, 0)} 组
                        </p>
                      </div>
                    </div>
                    <div className="workout-volume">
                      <strong>{number(totalVolume(w))}</strong>
                      <small>kg 总训练量</small>
                    </div>
                  </div>
                  <div className="workout-entries">
                    {w.entries.map((e) => (
                      <div key={e.exerciseId}>
                        <button
                          className="exercise-name"
                          onClick={() => navigate("analytics", e.exerciseId)}
                        >
                          {
                            data.exercises.find((x) => x.id === e.exerciseId)
                              ?.name
                          }
                          <ArrowUpRight size={13} />
                        </button>
                        <div className="set-chips">
                          {e.sets.map((s, i) => (
                            <span key={i}>
                              {s.weight}
                              <small>kg ×</small>
                              {s.reps}
                              {s.rpe !== null && <small>RPE {s.rpe}</small>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {w.note && <p className="workout-note">{w.note}</p>}
                  <div className="workout-card-actions">
                    <button
                      className="text-link"
                      onClick={() => openWorkout(w, true)}
                    >
                      <Copy size={14} />
                      复制训练
                    </button>
                    <button
                      className="text-link"
                      onClick={() => openWorkout(w)}
                    >
                      <Pencil size={14} />
                      编辑记录
                    </button>
                    <button
                      className="text-link muted-danger"
                      onClick={() =>
                        remove(
                          "删除训练记录",
                          `确定删除「${w.name}」（${w.date}）？相关统计与个人纪录将重新计算。`,
                          () =>
                            commit(
                              {
                                ...data,
                                workouts: data.workouts.filter(
                                  (x) => x.id !== w.id,
                                ),
                              },
                              "训练记录已删除",
                            ),
                        )
                      }
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
function ExerciseLibrary() {
  const { data, commit, remove, saving, navigate } = useGym();
  const [group, setGroup] = useState("全部");
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<Exercise | null>(null);
  const [error, setError] = useState("");
  const open = (exercise?: Exercise) => {
    setError("");
    setEdit(exercise || { id: uid(), name: "", group: "胸部" });
  };
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const checked = exerciseSchema.safeParse(edit);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      return;
    }
    if (
      data.exercises.some(
        (ex) => ex.name === edit.name.trim() && ex.id !== edit.id,
      )
    ) {
      setError("已经有同名动作，请使用不同名称");
      return;
    }
    if (
      await commit(
        {
          ...data,
          exercises: data.exercises.some((ex) => ex.id === edit.id)
            ? data.exercises.map((ex) =>
                ex.id === edit.id ? checked.data : ex,
              )
            : [...data.exercises, checked.data],
        },
        "动作已保存",
      )
    )
      setEdit(null);
  }
  function deleteExercise(ex: Exercise) {
    if (
      data.workouts.some((w) =>
        w.entries.some((e) => e.exerciseId === ex.id),
      ) ||
      data.programs.some((p) =>
        p.days.some((d) => d.entries.some((e) => e.exerciseId === ex.id)),
      ) ||
      data.goals.some((g) => g.type === "weight" && g.exerciseId === ex.id)
    ) {
      setError("该动作已用于训练、计划或目标。请先移除相关引用，再删除动作。");
      return;
    }
    if (data.exercises.length === 1) {
      setError("请至少保留一个动作");
      return;
    }
    remove("删除训练动作", `确定从动作库删除「${ex.name}」？`, () =>
      commit(
        { ...data, exercises: data.exercises.filter((e) => e.id !== ex.id) },
        "动作已删除",
      ),
    );
  }
  return (
    <>
      <div className="filter-bar">
        <label className="search-input">
          <Search size={16} />
          <input
            aria-label="搜索动作库"
            placeholder="搜索训练动作"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="筛选肌群"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {["全部", ...GROUPS].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button className="button primary" onClick={() => open()}>
          <Plus size={16} />
          添加动作
        </button>
      </div>
      <ErrorText message={error} />
      <div className="exercise-library">
        {data.exercises
          .filter(
            (e) =>
              (group === "全部" || e.group === group) &&
              e.name.includes(search),
          )
          .map((ex) => (
            <Card key={ex.id}>
              <div className="exercise-library-icon">
                <Dumbbell size={24} />
              </div>
              <span className="tag">{ex.group}</span>
              <h3>{ex.name}</h3>
              <div className="exercise-library-actions">
                <button
                  className="text-link"
                  onClick={() => navigate("analytics", ex.id)}
                >
                  查看分析
                  <ArrowUpRight size={14} />
                </button>
                <button
                  aria-label={`编辑${ex.name}`}
                  className="icon-button"
                  onClick={() => open(ex)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  aria-label={`删除${ex.name}`}
                  className="icon-button"
                  onClick={() => deleteExercise(ex)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
      </div>
      {!data.exercises.some(
        (e) =>
          (group === "全部" || e.group === group) && e.name.includes(search),
      ) && (
        <Empty
          title="没有匹配的动作"
          text="调整肌群或搜索词，也可以添加自己的动作。"
        />
      )}
      {edit && (
        <Modal
          title={
            data.exercises.some((e) => e.id === edit.id)
              ? "编辑训练动作"
              : "添加训练动作"
          }
          onClose={() => setEdit(null)}
        >
          <form onSubmit={save}>
            <div className="modal-body">
              <Field label="动作名称">
                <input
                  required
                  maxLength={80}
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </Field>
              <Field label="目标肌群">
                <select
                  value={edit.group}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      group: e.target.value as Exercise["group"],
                    })
                  }
                >
                  {GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </Field>
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
                保存动作
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
