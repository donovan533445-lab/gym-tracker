"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Scale, Activity, Ruler } from "lucide-react";
import {
  Body,
  BODY_LABELS,
  bodyUnit,
  dateKey,
  uid,
  bodySchema,
  inDays,
  number,
} from "@/lib/model";
import { useGym } from "./context";
import { Card, Stat, SectionHead, Empty, Modal, Field, ErrorText } from "./ui";
import { TrendChart } from "./charts";
export default function BodyStats() {
  const { data, commit, remove, saving } = useGym();
  const [metric, setMetric] = useState<keyof typeof BODY_LABELS>("weight");
  const [days, setDays] = useState(90);
  const [edit, setEdit] = useState<Body | null>(null);
  const [error, setError] = useState("");
  const body = [...data.body].sort((a, b) => b.date.localeCompare(a.date));
  const latest = (key: keyof typeof BODY_LABELS) =>
    body.find((b) => b[key] !== null)?.[key];
  const chart = [...body]
    .reverse()
    .filter((b) => b[metric] !== null && inDays(b.date, days))
    .map((b) => ({ date: b.date, value: b[metric]! }));
  const open = () => {
    setError("");
    setEdit(
      body.find((b) => b.date === dateKey()) || {
        id: uid(),
        date: dateKey(),
        weight: null,
        fat: null,
        chest: null,
        waist: null,
        arm: null,
        shoulder: null,
        thigh: null,
      },
    );
  };
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const checked = bodySchema.safeParse(edit);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      return;
    }
    if (
      data.body.some(
        (b) => b.date === checked.data.date && b.id !== checked.data.id,
      )
    ) {
      setError("这个日期已有身体数据，请编辑原记录");
      return;
    }
    if (
      await commit(
        {
          ...data,
          body: data.body.some((b) => b.id === checked.data.id)
            ? data.body.map((b) =>
                b.id === checked.data.id ? checked.data : b,
              )
            : [...data.body, checked.data],
        },
        "身体数据已保存",
      )
    )
      setEdit(null);
  }
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>身体数据</h1>
          <p>力量之外，也看见身体的改变。</p>
        </div>
        <button className="button primary" onClick={open}>
          <Plus size={16} />
          记录身体数据
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          label="最新体重"
          value={latest("weight") ?? "--"}
          unit="kg"
          detail="已记录的最近一次体重"
          icon={<Scale size={18} />}
          highlight
        />
        <Stat
          label="最新体脂率"
          value={latest("fat") ?? "--"}
          unit="%"
          detail="保持相同测量方式"
          icon={<Activity size={18} />}
        />
        <Stat
          label="最新胸围"
          value={latest("chest") ?? "--"}
          unit="cm"
          detail="自然呼吸，统一测量位置"
          icon={<Ruler size={18} />}
        />
        <Stat
          label="最新腰围"
          value={latest("waist") ?? "--"}
          unit="cm"
          detail={`累计 ${body.length} 次身体记录`}
          icon={<Ruler size={18} />}
        />
      </div>
      <Card>
        <SectionHead
          title="身体变化趋势"
          subtitle="每一次测量，都是了解自己的过程"
          action={
            <div className="segmented">
              {[
                [30, "30 天"],
                [90, "90 天"],
                [180, "180 天"],
                [0, "全部"],
              ].map(([v, label]) => (
                <button
                  className={days === v ? "active" : ""}
                  onClick={() => setDays(Number(v))}
                  key={v}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />
        <div className="metric-tabs">
          {Object.entries(BODY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={key === metric ? "active" : ""}
              onClick={() => setMetric(key as typeof metric)}
            >
              {label}
              <small>{bodyUnit(key)}</small>
            </button>
          ))}
        </div>
        <TrendChart
          data={chart}
          unit={bodyUnit(metric)}
          label={BODY_LABELS[metric]}
          emptyText="添加身体数据后，在这里查看你的长期变化"
          height={285}
        />
      </Card>
      <Card>
        <SectionHead
          title="测量记录"
          subtitle="同一天的数据保存在同一条记录中"
        />
        {body.length ? (
          <div className="history-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  {Object.entries(BODY_LABELS).map(([key, label]) => (
                    <th key={key}>
                      {label}
                      <small> {bodyUnit(key)}</small>
                    </th>
                  ))}
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {body.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    {Object.keys(BODY_LABELS).map((key) => (
                      <td key={key}>
                        {b[key as keyof typeof BODY_LABELS] ?? "--"}
                      </td>
                    ))}
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button"
                          aria-label={`编辑${b.date}身体数据`}
                          onClick={() => {
                            setError("");
                            setEdit({ ...b });
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`删除${b.date}身体数据`}
                          onClick={() =>
                            remove(
                              "删除身体记录",
                              `确定删除 ${b.date} 的身体测量数据？`,
                              () =>
                                commit(
                                  {
                                    ...data,
                                    body: data.body.filter(
                                      (x) => x.id !== b.id,
                                    ),
                                  },
                                  "身体记录已删除",
                                ),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="给身体变化，留下一份记录"
            text="记录体重、体脂或围度，至少填写一项即可。"
            action={
              <button className="button secondary" onClick={open}>
                <Plus size={15} />
                添加第一次测量
              </button>
            }
          />
        )}
      </Card>
      {edit && (
        <Modal
          title={
            data.body.some((b) => b.id === edit.id)
              ? "编辑身体数据"
              : "记录身体数据"
          }
          onClose={() => setEdit(null)}
        >
          <form onSubmit={save}>
            <div className="modal-body">
              <Field label="测量日期">
                <input
                  required
                  type="date"
                  max={dateKey()}
                  value={edit.date}
                  onChange={(e) => setEdit({ ...edit, date: e.target.value })}
                />
              </Field>
              <div className="form-grid">
                {Object.entries(BODY_LABELS).map(([key, label]) => (
                  <Field key={key} label={`${label} (${bodyUnit(key)})`}>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min={
                        key === "weight"
                          ? 20
                          : key === "fat"
                            ? 1
                            : key === "arm"
                              ? 5
                              : key === "thigh"
                                ? 10
                                : 20
                      }
                      max={
                        key === "weight"
                          ? 400
                          : key === "fat"
                            ? 70
                            : key === "arm"
                              ? 100
                              : key === "thigh"
                                ? 150
                                : 250
                      }
                      placeholder="选填"
                      value={edit[key as keyof typeof BODY_LABELS] ?? ""}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          [key]:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                ))}
              </div>
              <p className="form-hint">
                至少填写一项。建议在相同时间、相同条件下测量，便于长期比较。
              </p>
              <ErrorText message={error} />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setEdit(null)}
              >
                取消
              </button>
              <button className="button primary" disabled={saving}>
                保存数据
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
