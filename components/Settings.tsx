"use client";
import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Database,
  ShieldCheck,
  Check,
  User,
  HardDrive,
  FileSpreadsheet,
  Save,
} from "lucide-react";
import { State, stateSchema, dateKey, trainingCSV, bodyCSV, cardioCSV, upgradeCatalog } from "@/lib/model";
import { download } from "@/lib/storage";
import { useGym } from "./context";
import { Card, Field, SectionHead, Modal, ErrorText } from "./ui";
export default function Settings() {
  const { data, commit, saving, notify } = useGym();
  const [name, setName] = useState(data.settings.name);
  const [target, setTarget] = useState(data.settings.weeklyTarget);
  const [error, setError] = useState("");
  const [restore, setRestore] = useState<State | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const backup = () =>
    download(
      `gym-tracker-backup-${dateKey()}.json`,
      JSON.stringify(
        { app: "GYM TRACKER", exportedAt: new Date().toISOString(), data },
        null,
        2,
      ),
    );
  async function readFile(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      if (file.size > 8_000_000) throw new Error("备份文件不能超过 8MB");
      const parsed = JSON.parse(await file.text());
      if (parsed.app !== "GYM TRACKER")
        throw new Error("请选择 GYM TRACKER 导出的 JSON 备份文件");
      const checked = stateSchema.safeParse(parsed.data);
      if (!checked.success)
        throw new Error(
          `备份内容校验失败：${checked.error.issues[0]?.message}`,
        );
      setRestore(upgradeCatalog(checked.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "无法读取备份文件");
    }
    if (fileRef.current) fileRef.current.value = "";
  }
  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请填写昵称");
      return;
    }
    if (
      await commit(
        { ...data, settings: { name: name.trim(), weeklyTarget: target } },
        "偏好设置已保存",
      )
    )
      setError("");
  }
  return (
    <>
      <div className="page-intro">
        <div>
          <h1>设置</h1>
          <p>管理你的个人偏好与训练数据。</p>
        </div>
        <span className="tag">
          <ShieldCheck size={13} />
          数据保存在本机
        </span>
      </div>
      <div className="settings-layout">
        <Card>
          <SectionHead
            title="个人偏好"
            subtitle="打造你的专属训练空间"
            action={<User size={19} className="muted" />}
          />
          <form onSubmit={saveProfile}>
            <div className="settings-form">
              <Field label="你的昵称">
                <input
                  required
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="每周目标训练次数">
                <input
                  required
                  type="number"
                  min={1}
                  max={14}
                  value={target || ""}
                  onChange={(e) => setTarget(Number(e.target.value))}
                />
              </Field>
              <div className="setting-fixed">
                <span>手机版布局</span>
                <a className="text-link" href={`${import.meta.env.BASE_URL}mobile/#settings`}>
                  打开专用手机版
                </a>
              </div>
              <div className="setting-fixed">
                <span>界面语言</span>
                <strong>简体中文</strong>
              </div>
              <div className="setting-fixed">
                <span>重量单位</span>
                <strong>kg</strong>
              </div>
              <div className="setting-fixed">
                <span>外观</span>
                <strong>深色 · 荧光绿</strong>
              </div>
              <button className="button primary" disabled={saving}>
                <Save size={15} />
                {saving ? "正在保存…" : "保存设置"}
              </button>
            </div>
          </form>
        </Card>
        <div>
          <Card className="storage-info">
            <SectionHead
              title="数据安全与保存"
              action={<Database size={19} className="accent" />}
            />
            <div className="storage-status">
              <span className="storage-check">
                <Check size={22} />
              </span>
              <div>
                <strong>浏览器本地数据库</strong>
                <p>每位访客独立保存，无需登录</p>
              </div>
            </div>
            <p>
              完成训练后，数据会保存至当前浏览器的本地数据库。刷新页面或关闭浏览器后仍可查看。不同设备或浏览器的数据各自独立；请使用完整备份迁移。清理网站数据或使用无痕模式可能使记录丢失。
            </p>
            <div className="setting-fixed">
              <span>训练记录</span>
              <strong>{data.workouts.length} 条</strong>
            </div>
            <div className="setting-fixed">
              <span>有氧记录</span><strong>{data.cardio.length} 条</strong></div><div className="setting-fixed"><span>身体记录</span>
              <strong>{data.body.length} 条</strong>
            </div>
            <div className="setting-fixed">
              <span>动作库 / 训练计划 / 目标</span>
              <strong>
                {data.exercises.length} / {data.programs.length} /{" "}
                {data.goals.length}
              </strong>
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <SectionHead title="导出与备份" subtitle="你的数据，始终由你掌握" />
        <div className="data-actions-grid">
          <div>
            <span className="square-icon">
              <FileSpreadsheet size={23} />
            </span>
            <h3>导出 CSV</h3>
            <p>导出逐组训练数据或身体测量数据，可直接在 Excel 中打开。</p>
            <div className="button-row">
              <button
                className="button secondary"
                onClick={() => {
                  download(
                    `gym-training-${dateKey()}.csv`,
                    trainingCSV(data),
                    "text/csv;charset=utf-8",
                  );
                  notify("训练 CSV 已导出");
                }}
              >
                <Download size={14} />
                训练数据
              </button>
              <button className="button secondary" onClick={()=>{download(`gym-cardio-${dateKey()}.csv`,cardioCSV(data),"text/csv;charset=utf-8");notify("有氧 CSV 已导出");}}><Download size={14}/>有氧数据</button>
              <button
                className="button secondary"
                onClick={() => {
                  download(
                    `gym-body-${dateKey()}.csv`,
                    bodyCSV(data),
                    "text/csv;charset=utf-8",
                  );
                  notify("身体 CSV 已导出");
                }}
              >
                <Download size={14} />
                身体数据
              </button>
            </div>
          </div>
          <div>
            <span className="square-icon">
              <HardDrive size={23} />
            </span>
            <h3>完整数据备份</h3>
            <p>将力量、有氧、身体数据、动作库、计划、目标和偏好完整保存为 JSON。</p>
            <button
              className="button secondary"
              onClick={() => {
                backup();
                notify("完整备份已导出");
              }}
            >
              <Download size={14} />
              下载完整备份
            </button>
          </div>
          <div>
            <span className="square-icon">
              <Upload size={23} />
            </span>
            <h3>从备份恢复</h3>
            <p>上传完整 JSON 备份，经校验并确认后替换当前数据。</p>
            <input
              className="sr-only"
              aria-label="上传备份文件"
              type="file"
              accept="application/json,.json"
              ref={fileRef}
              onChange={(e) => readFile(e.target.files?.[0])}
            />
            <button
              className="button secondary"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={14} />
              选择备份文件
            </button>
          </div>
        </div>
        <ErrorText message={error} />
      </Card>
      <div className="settings-footnote">
        <ShieldCheck size={15} />
        训练草稿与历史记录保存在当前浏览器。网站公开访问，个人数据不会上传到 GitHub。建议定期下载完整备份。
      </div>
      {restore && (
        <Modal title="确认恢复备份" onClose={() => setRestore(null)}>
          <div className="modal-body">
            <p className="confirm-text">
              备份已通过格式与数据关联校验。恢复将替换当前全部数据，继续前会自动下载一份当前数据备份。
            </p>
            <div className="restore-summary">
              <span>{restore.workouts.length} 条训练记录</span>
              <span>{restore.body.length} 条身体记录</span><span>{restore.cardio.length} 条有氧记录</span>
              <span>{restore.exercises.length} 个训练动作</span>
              <span>{restore.programs.length} 个训练计划</span>
              <span>{restore.goals.length} 个训练目标</span>
            </div>
          </div>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setRestore(null)}
            >
              取消
            </button>
            <button
              className="button primary"
              disabled={saving}
              onClick={async () => {
                backup();
                if (await commit(restore, "备份已恢复，所有分析已更新")) {
                  setName(restore.settings.name);
                  setTarget(restore.settings.weeklyTarget);
                  setRestore(null);
                }
              }}
            >
              {saving ? "恢复中…" : "备份当前数据并恢复"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
