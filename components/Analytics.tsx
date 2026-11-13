"use client";
import { useState } from "react";
import {
  TrendingUp,
  Dumbbell,
  Repeat,
  Layers,
  Activity,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { number, exerciseHistory, inDays } from "@/lib/model";
import { useGym } from "./context";
import { Card, Stat, SectionHead, Empty } from "./ui";
import { TrendChart } from "./charts";
const ranges = [
  [7, "7 天"],
  [30, "30 天"],
  [90, "90 天"],
  [180, "180 天"],
  [0, "全部"],
] as const;
export default function Analytics() {
  const { data, selectedExercise, setSelectedExercise, openWorkout } = useGym();
  const [days, setDays] = useState(90);
  const [metric, setMetric] = useState<"weight" | "volume" | "rm">("weight");
  const exercise =
    data.exercises.find((e) => e.id === selectedExercise) || data.exercises[0];
  const full = exerciseHistory(data, exercise.id);
  const history = full.filter((h) => inDays(h.date, days));
  const latest = full[full.length - 1];
  const previous = full[full.length - 2];
  const max = (key: "weight" | "reps" | "volume" | "rm") =>
    full.length ? Math.max(...full.map((h) => h[key])) : null;
  const diff = latest && previous ? latest.weight - previous.weight : null;
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>力量分析</h1>
          <p>读懂训练数据，找到你的下一次突破。</p>
        </div>
        <button className="button primary" onClick={() => openWorkout()}>
          <Plus size={16} />
          记录训练
        </button>
      </div>
      <div className="analytics-filters">
        <div className="exercise-select">
          <span className="square-icon">
            <Dumbbell size={20} />
          </span>
          <div>
            <small>当前分析动作</small>
            <select
              aria-label="选择分析动作"
              value={exercise.id}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {data.exercises.map((ex) => (
                <option value={ex.id} key={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
          <span className="tag">{exercise.group}</span>
        </div>
        <div className="segmented">
          {ranges.map(([v, label]) => (
            <button
              key={v}
              className={days === v ? "active" : ""}
              onClick={() => setDays(v)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          label="历史最大重量"
          value={max("weight") === null ? "--" : number(max("weight")!, 1)}
          unit="kg"
          detail="单组使用的最高重量"
          icon={<Dumbbell size={18} />}
          highlight
        />
        <Stat
          label="历史最多次数"
          value={max("reps") ?? "--"}
          unit="次"
          detail="单组完成的最多次数"
          icon={<Repeat size={18} />}
        />
        <Stat
          label="最佳单次训练容量"
          value={max("volume") === null ? "--" : number(max("volume")!)}
          unit="kg"
          detail="同次训练该动作各组容量之和"
          icon={<Layers size={18} />}
        />
        <Stat
          label="估算 1RM 纪录"
          value={max("rm") === null ? "--" : number(max("rm")!, 1)}
          unit="kg"
          detail="基于 Epley 公式估算"
          icon={<TrendingUp size={18} />}
        />
      </div>
      <Card className="analytics-chart">
        <SectionHead
          title={`${exercise.name} · 进步曲线`}
          subtitle={`${history.length} 次训练 · ${days === 0 ? "全部时间" : `最近 ${days} 天`}`}
          action={
            <select
              aria-label="分析指标"
              value={metric}
              onChange={(e) => setMetric(e.target.value as typeof metric)}
            >
              <option value="weight">最大训练重量</option>
              <option value="rm">估算 1RM</option>
              <option value="volume">训练容量</option>
            </select>
          }
        />
        <TrendChart
          data={history.map((h) => ({ date: h.date, value: h[metric] }))}
          height={300}
          label={
            metric === "weight"
              ? "最大训练重量"
              : metric === "rm"
                ? "估算 1RM"
                : "训练容量"
          }
        />
        <p className="form-hint">
          悬停或点击曲线数据点查看详情。1RM = 重量 × (1 + 次数 ÷
          30)，单次按实际重量；它是估算值，高次数组的估算误差更大。
        </p>
      </Card>
      <div className="two-column">
        <Card>
          <SectionHead title="最近一次表现" subtitle={latest?.date} />
          {latest ? (
            <>
              <div className="performance-number">
                <strong>{number(latest.weight, 1)}</strong>
                <span>kg 最高重量</span>
                {diff !== null && (
                  <b className={diff >= 0 ? "positive" : "negative"}>
                    {diff >= 0 ? "+" : ""}
                    {number(diff, 1)} kg <small>相比上次</small>
                  </b>
                )}
              </div>
              <div className="performance-details">
                <div>
                  <span>完成组数</span>
                  <strong>{latest.sets.length} 组</strong>
                </div>
                <div>
                  <span>总容量</span>
                  <strong>{number(latest.volume)} kg</strong>
                </div>
                <div>
                  <span>估算 1RM</span>
                  <strong>{number(latest.rm, 1)} kg</strong>
                </div>
                <div>
                  <span>容量变化</span>
                  <strong>
                    {previous
                      ? `${latest.volume - previous.volume >= 0 ? "+" : ""}${number(latest.volume - previous.volume)} kg`
                      : "等待下一次训练"}
                  </strong>
                </div>
              </div>
              <div className="set-chips">
                {latest.sets.map((s, i) => (
                  <span key={i}>
                    {s.weight}
                    <small>kg ×</small>
                    {s.reps}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <Empty
              compact
              title="等待第一次训练"
              text="记录该动作后，在这里查看表现与上次对比。"
            />
          )}
        </Card>
        <Card>
          <SectionHead title="主要动作概览" subtitle="点击动作查看独立分析" />
          <div className="lift-overview">
            {["平板杠铃卧推", "杠铃推肩", "杠铃深蹲", "传统硬拉"].map(
              (name) => {
                const ex = data.exercises.find((e) => e.name === name);
                if (!ex) return null;
                const list = exerciseHistory(data, ex.id);
                const latest = list[list.length - 1];
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex.id)}
                  >
                    <span className="square-icon">
                      <Activity size={17} />
                    </span>
                    <span>
                      <strong>{name}</strong>
                      <small>{list.length} 次训练</small>
                    </span>
                    <b>{latest ? `${latest.weight} kg` : "待记录"}</b>
                    <ArrowUpRight size={15} />
                  </button>
                );
              },
            )}
          </div>
        </Card>
      </div>
      <Card>
        <SectionHead title="训练明细" subtitle="按当前时间范围筛选" />
        {history.length ? (
          <div className="history-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>最大重量</th>
                  <th>最高次数</th>
                  <th>训练容量</th>
                  <th>估算 1RM</th>
                  <th>训练组数</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((h) => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td>{number(h.weight, 1)} kg</td>
                    <td>{h.reps} 次</td>
                    <td>{number(h.volume)} kg</td>
                    <td>{number(h.rm, 1)} kg</td>
                    <td>{h.sets.length} 组</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            compact
            title="这个时间范围还没有记录"
            text="调整时间范围，或记录一次新的训练。"
          />
        )}
      </Card>
    </>
  );
}
