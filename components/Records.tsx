"use client";
import { useState } from "react";
import {
  Trophy,
  ArrowUpRight,
  Medal,
  Dumbbell,
  Repeat,
  Layers,
  TrendingUp,
} from "lucide-react";
import { prHistory, PR_TYPES, number } from "@/lib/model";
import { useGym } from "./context";
import { Card, Empty, SectionHead } from "./ui";
const icons = {
  weight: Dumbbell,
  reps: Repeat,
  volume: Layers,
  rm: TrendingUp,
};
export default function Records() {
  const { data, navigate, openWorkout } = useGym();
  const [filter, setFilter] = useState("all");
  const history = prHistory(data);
  const filtered = history.filter(
    (p) => filter === "all" || p.exerciseId === filter,
  );
  const best = Object.keys(PR_TYPES).map((key) => {
    const all = filtered.filter((p) => p.type === key);
    return all.sort((a, b) => b.value - a.value)[0];
  });
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>
            个人纪录<span className="accent">.</span>
          </h1>
          <p>你与过去的自己，每一次较量的勋章。</p>
        </div>
        <span className="records-badge">
          <Trophy size={18} />
          {history.length} 次个人纪录
        </span>
      </div>
      <div className="records-banner">
        <div className="records-banner-icon">
          <Trophy size={38} />
        </div>
        <div>
          <h2>最好的对手，是昨天的自己。</h2>
          <p>重量、次数、容量、1RM，四种方式见证你的进步。</p>
        </div>
        <span className="records-watermark">
          PERSONAL
          <br />
          BEST
        </span>
      </div>
      <div className="filter-bar">
        <select
          aria-label="筛选纪录动作"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">全部训练动作</option>
          {data.exercises.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <span className="muted">纪录会随训练自动更新</span>
      </div>
      {history.length ? (
        <>
          <div className="stats-grid">
            {Object.entries(PR_TYPES).map(([type, label], i) => {
              const record = best[i];
              const Icon = icons[type as keyof typeof icons];
              return (
                <Card className="record-stat" key={type}>
                  <span className="square-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{label}</h3>
                  <strong>
                    {record ? number(record.value, 1) : "--"}
                    <small>{type === "reps" ? "次" : "kg"}</small>
                  </strong>
                  <p>
                    {record
                      ? data.exercises.find((e) => e.id === record.exerciseId)
                          ?.name
                      : "暂无纪录"}
                  </p>
                </Card>
              );
            })}
          </div>
          <Card>
            <SectionHead
              title="突破时间线"
              subtitle={`${filtered.length} 条纪录 · 首次记录标记为初始纪录`}
            />
            {!filtered.length ? (
              <Empty
                compact
                title="该动作还没有纪录"
                text="完成一次训练，建立属于自己的起点。"
              />
            ) : (
              <div className="pr-timeline">
                {filtered.map((pr, i) => {
                  const Icon = icons[pr.type];
                  return (
                    <div
                      className="pr-timeline-item"
                      key={`${pr.workoutId}-${pr.exerciseId}-${pr.type}`}
                    >
                      <div className="timeline-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="tag">
                          {pr.initial ? "初始纪录" : "突破 PR"}
                        </span>
                        <h3>
                          {
                            data.exercises.find((e) => e.id === pr.exerciseId)
                              ?.name
                          }
                        </h3>
                        <p>
                          {PR_TYPES[pr.type]} · {pr.date}
                        </p>
                      </div>
                      <strong>
                        {number(pr.value, 1)}
                        <small>{pr.type === "reps" ? "次" : "kg"}</small>
                      </strong>
                      <button
                        className="icon-button"
                        aria-label="查看该动作分析"
                        onClick={() => navigate("analytics", pr.exerciseId)}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <Empty
            title="你的纪录，等你来创造"
            text="完成并保存训练后，系统会自动识别四类 PR，建立你的突破时间线。"
            action={
              <button className="button primary" onClick={() => openWorkout()}>
                记录第一次训练
                <ArrowUpRight size={16} />
              </button>
            }
          />
        </Card>
      )}
    </>
  );
}
