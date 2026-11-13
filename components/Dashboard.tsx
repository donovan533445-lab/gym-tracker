"use client";
import { useMemo, useState } from "react";
import {
  Activity,
  Flame,
  Dumbbell,
  Scale,
  Plus,
  ArrowUpRight,
  Trophy,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  dateKey,
  weekStart,
  totalVolume,
  volume,
  number,
  exerciseHistory,
  sortedWorkouts,
  prHistory,
  achieved,
  PR_TYPES,
} from "@/lib/model";
import { useGym } from "./context";
import { Card, Stat, SectionHead, TextLink, Empty } from "./ui";
import { TrendChart, VolumeChart, MuscleChart } from "./charts";
import Goals from "./Goals";
export default function Dashboard() {
  const { data, openWorkout, navigate } = useGym();
  const [range, setRange] = useState(30);
  const [exercise, setExercise] = useState(data.exercises[0].id);
  const start = weekStart();
  const weekly = data.workouts.filter((w) => w.date >= dateKey(start));
  const latest = sortedWorkouts(data)[0];
  const body = [...data.body]
    .sort((a, b) => b.date.localeCompare(a.date))
    .find((b) => b.weight !== null);
  const prs = prHistory(data);
  const completed = data.goals.filter((g) => achieved(data, g)).length;
  const history = exerciseHistory(data, exercise).filter((h) => {
    const d = new Date(dateKey() + "T12:00:00");
    d.setDate(d.getDate() - range + 1);
    return h.date >= dateKey(d);
  });
  const change =
    history.length > 1
      ? history[history.length - 1].weight - history[0].weight
      : null;
  const weeks = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const d = weekStart();
        d.setDate(d.getDate() - (7 - i) * 7);
        const next = new Date(d);
        next.setDate(d.getDate() + 7);
        return {
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          value: data.workouts
            .filter((w) => w.date >= dateKey(d) && w.date < dateKey(next))
            .reduce((n, w) => n + totalVolume(w), 0),
        };
      }),
    [data.workouts],
  );
  const muscles = data.exercises.reduce<Record<string, number>>((acc, e) => {
    const value = weekly.reduce(
      (n, w) =>
        n +
        w.entries
          .filter((x) => x.exerciseId === e.id)
          .reduce((m, x) => m + volume(x.sets), 0),
      0,
    );
    if (value) acc[e.group] = (acc[e.group] || 0) + value;
    return acc;
  }, {});
  return (
    <>
      <div className="page-intro">
        <div>
          <div className="eyebrow">YOUR PERSONAL TRAINING SPACE</div>
          <h1>
            每一次训练，都算数<span className="accent">.</span>
          </h1>
          <p>
            {data.settings.name}，
            {data.workouts.length
              ? "保持专注，让数据见证你的成长。"
              : "从今天开始，记录属于你的进步。"}
          </p>
        </div>
        <button className="button primary" onClick={() => openWorkout()}>
          <Plus size={18} />
          记录训练
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          label="本周训练"
          value={weekly.length}
          unit="次"
          detail={
            <>
              <span className="status-dot" />
              每周目标 {data.settings.weeklyTarget} 次
            </>
          }
          icon={<Activity size={18} />}
          highlight
        />
        <Stat
          label="本周总训练量"
          value={number(weekly.reduce((n, w) => n + totalVolume(w), 0))}
          unit="kg"
          detail="每一组重量 × 完成次数"
          icon={<Dumbbell size={18} />}
        />
        <Stat
          label="当前体重"
          value={body?.weight ?? "--"}
          unit="kg"
          detail={
            body ? (
              `最近记录于 ${body.date}`
            ) : (
              <button className="inline-link" onClick={() => navigate("body")}>
                添加第一条身体数据 <ArrowUpRight size={12} />
              </button>
            )
          }
          icon={<Scale size={18} />}
        />
        <Stat
          label="累计训练"
          value={number(data.workouts.length)}
          unit="次"
          detail={
            <>
              {completed} 个目标已达成{" "}
              <span className="detail-separator">/</span> {prs.length} 次纪录
            </>
          }
          icon={<Flame size={18} />}
        />
      </div>
      <div className="dashboard-main-grid">
        <Card className="strength-card">
          <SectionHead
            title="力量进步趋势"
            subtitle="每一次微小的提升，都值得被看见"
            action={
              <div className="segmented" aria-label="趋势时间范围">
                {[
                  [30, "30 天"],
                  [90, "90 天"],
                  [365, "全年"],
                ].map(([v, label]) => (
                  <button
                    key={v}
                    className={range === v ? "active" : ""}
                    onClick={() => setRange(Number(v))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="chart-toolbar">
            <select
              aria-label="力量趋势动作"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            >
              {data.exercises.map((e) => (
                <option value={e.id} key={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="chart-legend">
              <i />
              最大训练重量 <span>kg</span>
            </div>
          </div>
          <div className="chart-metric">
            <strong>
              {history.length
                ? number(history[history.length - 1].weight, 1)
                : "--"}
            </strong>
            <span>kg</span>
            {change !== null && (
              <small className={change >= 0 ? "positive" : "negative"}>
                {change > 0 ? "+" : ""}
                {number(change, 1)} kg <span>区间变化</span>
              </small>
            )}
          </div>
          <TrendChart
            data={history.map((h) => ({ date: h.date, value: h.weight }))}
            height={215}
          />
          <div className="chart-footer">
            <TrendingUp size={14} />
            {history.length
              ? "训练后更新趋势，让成长清晰可见"
              : "真实训练数据 · 等待你的第一次记录"}
            <button onClick={() => navigate("analytics", exercise)}>
              深入分析
              <ArrowUpRight size={13} />
            </button>
          </div>
        </Card>
        <Card className="week-card">
          <SectionHead
            title="本周训练节奏"
            action={<CalendarDays size={18} className="muted" />}
          />
          <div className="week-progress">
            <strong>
              {weekly.length}
              <span>/ {data.settings.weeklyTarget}</span>
            </strong>
            <span>次训练已完成</span>
          </div>
          <div className="week-days">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(start);
              d.setDate(d.getDate() + i);
              const key = dateKey(d);
              const trained = weekly.some((w) => w.date === key);
              return (
                <div className={key === dateKey() ? "today" : ""} key={i}>
                  <span>{["一", "二", "三", "四", "五", "六", "日"][i]}</span>
                  <div
                    className={trained ? "trained" : ""}
                    title={trained ? `${key} 已训练` : key}
                  >
                    {trained ? <Check size={16} /> : d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="week-note">
            <span className="status-dot" />{" "}
            {weekly.length >= data.settings.weeklyTarget
              ? "本周目标已完成，做得漂亮。"
              : "进步来自持续，不必急于一时。"}
          </div>
          <div className="pr-preview">
            <div className="pr-preview-heading">
              <span className="square-icon">
                <Trophy size={20} />
              </span>
              <h3>最近的个人突破</h3>
            </div>
            {prs.length ? (
              <>
                <strong>
                  {number(prs[0].value, 1)}{" "}
                  <small>{prs[0].type === "reps" ? "次" : "kg"}</small>
                </strong>
                <p>
                  {data.exercises.find((e) => e.id === prs[0].exerciseId)?.name}{" "}
                  · {PR_TYPES[prs[0].type]}
                </p>
                <span>{prs[0].date}</span>
              </>
            ) : (
              <>
                <strong className="pr-empty-label">
                  你的下一个 PR
                  <br />
                  正在路上
                </strong>
                <p>认真完成每一组，突破自然会来。</p>
              </>
            )}
            <TextLink onClick={() => navigate("records")}>
              查看个人纪录
            </TextLink>
          </div>
        </Card>
      </div>
      <div className="dashboard-secondary-grid">
        <Card>
          <SectionHead
            title="每周训练容量"
            subtitle="最近 8 周 · kg"
            action={<span className="tag">容量趋势</span>}
          />
          <VolumeChart data={weeks} />
        </Card>
        <Card>
          <SectionHead title="肌群训练分布" subtitle="本周各肌群训练容量占比" />
          <MuscleChart
            data={Object.entries(muscles).map(([name, value]) => ({
              name,
              value,
            }))}
          />
        </Card>
      </div>
      <div className="dashboard-bottom-grid">
        <Card className="recent-card">
          <SectionHead
            title="最近一次训练"
            action={
              <TextLink onClick={() => navigate("workout")}>全部记录</TextLink>
            }
          />
          {latest ? (
            <>
              <button
                className="recent-workout"
                onClick={() => openWorkout(latest)}
              >
                <span className="square-icon">
                  <Dumbbell size={22} />
                </span>
                <span>
                  <strong>{latest.name}</strong>
                  <small>
                    {latest.date} · {latest.entries.length} 个动作
                  </small>
                </span>
                <span className="recent-volume">
                  <strong>{number(totalVolume(latest))}</strong>
                  <small>kg</small>
                </span>
                <ChevronRight size={17} />
              </button>
              <div className="recent-tags">
                {latest.entries.map((e) => (
                  <span key={e.exerciseId}>
                    {data.exercises.find((x) => x.id === e.exerciseId)?.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <Empty
              compact
              title="还没有训练记录"
              text="把今天的努力，变成明天的底气。"
              action={
                <button className="text-link" onClick={() => openWorkout()}>
                  开始记录
                  <ArrowUpRight size={14} />
                </button>
              }
            />
          )}
        </Card>
        <Goals compact />
      </div>
      <div className="dashboard-footer">
        <span>BUILT FOR YOUR PERSONAL BEST.</span>
        <span>保持专注，持续进步。</span>
      </div>
    </>
  );
}
