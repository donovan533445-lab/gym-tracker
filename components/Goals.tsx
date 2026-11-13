"use client";
import { useState } from "react";
import { Plus, Target, Check, Trash2, ArrowUpRight } from "lucide-react";
import {
  Goal,
  uid,
  goalSchema,
  goalProgress,
  achieved,
  number,
} from "@/lib/model";
import { useGym } from "./context";
import { Card, Modal, Field, ErrorText, SectionHead } from "./ui";
export default function Goals({ compact = false }: { compact?: boolean }) {
  const { data, commit, remove, saving } = useGym();
  const [edit, setEdit] = useState<Goal | null>(null);
  const [error, setError] = useState("");
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const checked = goalSchema.safeParse(edit);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      return;
    }
    if (
      await commit(
        {
          ...data,
          goals: data.goals.some((g) => g.id === checked.data.id)
            ? data.goals.map((g) =>
                g.id === checked.data.id ? checked.data : g,
              )
            : [...data.goals, checked.data],
        },
        "训练目标已保存",
      )
    )
      setEdit(null);
  }
  const open = () => {
    setError("");
    setEdit({
      id: uid(),
      name: "",
      type: "weight",
      exerciseId: data.exercises[0].id,
      target: 60,
      sets: 5,
      reps: 5,
    });
  };
  return (
    <Card className="goals-card">
      <SectionHead
        title="训练目标"
        subtitle={
          compact
            ? "每一个小目标，都通向更强的自己"
            : `${data.goals.filter((g) => achieved(data, g)).length} 个已完成 · ${data.goals.length} 个目标`
        }
        action={
          <button className="text-link" onClick={open}>
            <Plus size={15} />
            新建目标
          </button>
        }
      />
      {!data.goals.length ? (
        <div className="goal-empty">
          <span className="square-icon">
            <Target size={23} />
          </span>
          <div>
            <h3>为下一次突破，设定一个目标</h3>
            <p>重量、组数或训练次数，让进步有方向。</p>
          </div>
          <button className="icon-button" aria-label="设定目标" onClick={open}>
            <ArrowUpRight size={19} />
          </button>
        </div>
      ) : (
        <div className="goal-list">
          {data.goals.map((g) => {
            const progress = goalProgress(data, g);
            const done = achieved(data, g);
            return (
              <div className={`goal-item ${done ? "done" : ""}`} key={g.id}>
                <div className="goal-icon">
                  {done ? <Check size={18} /> : <Target size={18} />}
                </div>
                <div className="goal-content">
                  <button
                    className="goal-name"
                    onClick={() => {
                      setError("");
                      setEdit({ ...g });
                    }}
                  >
                    {g.name}
                  </button>
                  <p>
                    {g.type === "weight"
                      ? `${data.exercises.find((e) => e.id === g.exerciseId)?.name} · ${g.sets} 组 × ${g.reps} 次`
                      : "累计完成训练"}
                  </p>
                  <div className="progress-track">
                    <div
                      style={{
                        width: `${Math.min(100, (progress / g.target) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="goal-value">
                  <strong>
                    {done ? "已达成" : `${number(progress, 1)} / ${g.target}`}
                  </strong>
                  <small>{g.type === "weight" ? "kg" : "次训练"}</small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`删除目标${g.name}`}
                  onClick={() =>
                    remove(
                      "删除训练目标",
                      `确定删除「${g.name}」？训练记录将保留。`,
                      () =>
                        commit(
                          {
                            ...data,
                            goals: data.goals.filter((x) => x.id !== g.id),
                          },
                          "目标已删除",
                        ),
                    )
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {edit && (
        <Modal title="设定训练目标" onClose={() => setEdit(null)}>
          <form onSubmit={save}>
            <div className="modal-body">
              <Field label="目标名称">
                <input
                  required
                  maxLength={80}
                  placeholder="例如：完成 60kg 卧推 5×5"
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </Field>
              <Field label="目标类型">
                <select
                  value={edit.type}
                  onChange={(e) =>
                    setEdit({ ...edit, type: e.target.value as Goal["type"] })
                  }
                >
                  <option value="weight">动作重量目标</option>
                  <option value="sessions">累计训练次数</option>
                </select>
              </Field>
              {edit.type === "weight" && (
                <Field label="训练动作">
                  <select
                    value={edit.exerciseId}
                    onChange={(e) =>
                      setEdit({ ...edit, exerciseId: e.target.value })
                    }
                  >
                    {data.exercises.map((e) => (
                      <option value={e.id} key={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <Field
                label={edit.type === "weight" ? "目标重量 kg" : "目标训练次数"}
              >
                <input
                  required
                  type="number"
                  min={1}
                  max={edit.type === "weight" ? 1000 : 100000}
                  step={edit.type === "weight" ? 0.25 : 1}
                  value={edit.target || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, target: Number(e.target.value) })
                  }
                />
              </Field>
              {edit.type === "weight" && (
                <div className="form-grid">
                  <Field label="同一次训练至少组数">
                    <input
                      required
                      type="number"
                      min={1}
                      max={100}
                      value={edit.sets || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, sets: Number(e.target.value) })
                      }
                    />
                  </Field>
                  <Field label="每组至少次数">
                    <input
                      required
                      type="number"
                      min={1}
                      max={200}
                      value={edit.reps || ""}
                      onChange={(e) =>
                        setEdit({ ...edit, reps: Number(e.target.value) })
                      }
                    />
                  </Field>
                </div>
              )}
              <p className="form-hint">根据已保存的训练自动判断是否达成。</p>
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
                保存目标
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}
