"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Trophy,
  Scale,
  CalendarDays,
  Settings,
  ChevronRight,
  Plus,
  Menu,
  X,
  Check,
  Cloud,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { State, Workout, prHistory } from "@/lib/model";
import { repository } from "@/lib/storage";
import { GymContext, Page } from "./context";
import Dashboard from "./Dashboard";
import Workouts from "./Workouts";
import Analytics from "./Analytics";
import Records from "./Records";
import BodyStats from "./BodyStats";
import Programs from "./Programs";
import SettingsPage from "./Settings";
import WorkoutEditor from "./WorkoutEditor";
import { Confirm } from "./ui";
import MobileNavigation from "./MobileNavigation";
const NAV = [
  { id: "dashboard", cn: "首页", en: "Dashboard", icon: LayoutDashboard },
  { id: "workout", cn: "训练记录", en: "Workout", icon: Dumbbell },
  { id: "analytics", cn: "力量分析", en: "Analytics", icon: TrendingUp },
  { id: "records", cn: "个人纪录", en: "Records", icon: Trophy },
  { id: "body", cn: "身体数据", en: "Body Stats", icon: Scale },
  { id: "programs", cn: "训练计划", en: "Programs", icon: CalendarDays },
  { id: "settings", cn: "设置", en: "Settings", icon: Settings },
] as const;
export default function GymApp({
  mobileOnly = false,
}: {
  mobileOnly?: boolean;
}) {
  const [data, setData] = useState<State | null>(null);
  const [revision, setRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedExercise, setSelectedExercise] = useState("exercise-0-0");
  const [menu, setMenu] = useState(false);
  const [editor, setEditor] = useState<{
    workout?: Workout;
    copy?: boolean;
  } | null>(null);
  const [toast, setToast] = useState("");
  const [celebration, setCelebration] = useState(0);
  const [confirm, setConfirm] = useState<{
    title: string;
    text: string;
    action: () => Promise<boolean>;
  } | null>(null);
  const notify = useCallback((message: string) => setToast(message), []);
  const load = useCallback(async () => {
    setLoadError("");
    try {
      const result = await repository.load();
      setData(result.data);
      setRevision(result.revision);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "无法载入数据");
    }
  }, []);
  useEffect(() => {
    load();
    const onHash = () => {
      const hash = location.hash.slice(1);
      const id = hash === "exercises" ? "workout" : hash;
      if (NAV.some((n) => n.id === id)) setPage(id as Page);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!celebration) return;
    const timeout = setTimeout(() => setCelebration(0), 5500);
    return () => clearTimeout(timeout);
  }, [celebration]);
  const navigate = (next: Page, exerciseId?: string) => {
    if (exerciseId) setSelectedExercise(exerciseId);
    setPage(next);
    location.hash = next;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  async function commit(next: State, message = "数据已保存") {
    if (lock.current) return false;
    lock.current = true;
    setSaving(true);
    try {
      const nextRevision = await repository.save(next, revision);
      if (data) {
        const old = prHistory(data);
        const newRecords = prHistory(next).filter(
          (p) =>
            old.some(
              (o) => o.exerciseId === p.exerciseId && o.type === p.type,
            ) &&
            p.value >
              Math.max(
                ...old
                  .filter(
                    (o) => o.exerciseId === p.exerciseId && o.type === p.type,
                  )
                  .map((o) => o.value),
              ),
        );
        if (newRecords.length) setCelebration(newRecords.length);
      }
      setData(next);
      setRevision(nextRevision);
      if (!next.exercises.some((e) => e.id === selectedExercise))
        setSelectedExercise(next.exercises[0].id);
      notify(message);
      return true;
    } catch (e) {
      notify(e instanceof Error ? e.message : "保存失败，请重试");
      return false;
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menu]);
  const current = NAV.find((n) => n.id === page)!;
  const today = new Date().toLocaleDateString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const openWorkout = (workout?: Workout, copy?: boolean) =>
    setEditor({ workout, copy });
  const pages = {
    dashboard: <Dashboard />,
    workout: <Workouts />,
    analytics: <Analytics />,
    records: <Records />,
    body: <BodyStats />,
    programs: <Programs />,
    settings: <SettingsPage />,
  };
  return (
    <div className={`app-shell ${mobileOnly ? "mobile-layout" : ""}`}>
      {menu && (
        <button
          className="sidebar-scrim"
          aria-label="关闭导航"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("dashboard");
          }}
          className="brand"
        >
          <span className="brand-mark">
            <Dumbbell size={24} strokeWidth={2.4} />
          </span>
          <span>
            GYM<span className="brand-light">TRACKER</span>
          </span>
        </a>
        <div className="sidebar-caption">个人训练空间</div>
        <div className="nav-section-label">WORKSPACE</div>
        <nav aria-label="主导航">
          {NAV.map(({ id, cn, en, icon: Icon }, i) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""} ${i === 6 ? "settings-nav" : ""}`}
              aria-current={page === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={19} />
              <span>
                {cn}
                <small>{en}</small>
              </span>
              {page === id && <ChevronRight size={15} className="nav-arrow" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-motivation">
            <div className="mini-logo">
              <Activity size={18} />
            </div>
            <strong>比昨天，更进一步。</strong>
            <p>
              你的每一份坚持
              <br />
              都有迹可循。
            </p>
            <button
              onClick={() =>
                data ? openWorkout() : notify("请等待数据载入后再记录训练")
              }
            >
              开始今天的训练
              <ArrowUpRight size={14} />
            </button>
          </div>
          <button className="profile" onClick={() => navigate("settings")}>
            <span className="avatar">
              {data?.settings.name.slice(0, 1) || "G"}
            </span>
            <span>
              <strong>{data?.settings.name || "我的账户"}</strong>
              <small>个人训练账户</small>
            </span>
            <Settings size={16} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="打开导航"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb-root">个人空间</span>
            <ChevronRight size={13} />
            <strong>{current.en}</strong>
          </div>
          <div className="topbar-right">
            <span className="topbar-date">
              <CalendarDays size={14} />
              {today}
            </span>
            <span className={`sync-status ${loadError ? "error" : ""}`}>
              <span className="status-dot" />
              {saving
                ? "正在保存"
                : data
                  ? "本机已保存"
                  : loadError
                    ? "读取异常"
                    : "正在读取"}
            </span>
            <button
              className="top-avatar"
              aria-label="个人设置"
              onClick={() => navigate("settings")}
            >
              {data?.settings.name.slice(0, 1) || "G"}
            </button>
          </div>
        </header>
        <main className="main-content" id="main-content">
          {data ? (
            <GymContext.Provider
              value={{
                data,
                saving,
                commit,
                notify,
                navigate,
                openWorkout,
                remove: (title, text, action) =>
                  setConfirm({ title, text, action }),
                selectedExercise,
                setSelectedExercise,
              }}
            >
              <div className="page-content" key={page}>
                {pages[page]}
              </div>
              {editor && (
                <WorkoutEditor {...editor} onClose={() => setEditor(null)} />
              )}
            </GymContext.Provider>
          ) : loadError ? (
            <div className="load-error">
              <AlertCircle size={32} />
              <h1>暂时无法载入训练数据</h1>
              <p>{loadError}</p>
              <div className="button-row">
                <button className="button primary" onClick={load}>
                  <RefreshCw size={16} />
                  重新载入
                </button>

              </div>
              <small>你的历史数据不会被重置。</small>
            </div>
          ) : (
            <div
              className="loading-screen"
              aria-label="正在载入训练数据"
              aria-busy="true"
            >
              <div className="skeleton skeleton-title" />
              <div className="stats-grid">
                {[1, 2, 3, 4].map((n) => (
                  <div className="skeleton skeleton-stat" key={n} />
                ))}
              </div>
              <div className="skeleton skeleton-chart" />
              <p>正在读取你的训练空间…</p>
            </div>
          )}
        </main>
      </div>
      {data && (
        <MobileNavigation
          page={page}
          onNavigate={navigate}
          onMenu={() => setMenu(true)}
        />
      )}
      {confirm && (
        <Confirm
          {...confirm}
          busy={saving}
          onClose={() => {
            if (!saving) setConfirm(null);
          }}
          onConfirm={async () => {
            if (await confirm.action()) setConfirm(null);
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{toast}</span>
          <button aria-label="关闭通知" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
      {celebration > 0 && (
        <>
          <div className="celebration" role="status">
            <span>
              <Trophy size={26} />
            </span>
            <div>
              <strong>新的个人纪录！</strong>
              <p>{celebration} 项突破，献给坚持的你。</p>
            </div>
            <button
              className="icon-button"
              aria-label="关闭庆祝"
              onClick={() => setCelebration(0)}
            >
              <X size={17} />
            </button>
          </div>
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 7) * 0.12}s`,
                  background: ["#c0f65b", "#f2dd94", "#73b8a6"][i % 3],
                  transform: `rotate(${i * 17}deg)`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
