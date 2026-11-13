import { type State, stateSchema, initialState, upgradeCatalog } from "./model.ts";

export interface TrainingRepository {
  load(): Promise<{ data: State; revision: number }>;
  save(data: State, revision: number): Promise<number>;
}
type Stored = { data: State; revision: number };
/** IndexedDB transaction provides an atomic revision check across tabs.
 * Replace this adapter to connect an authenticated server database later. */
export class DataRepository implements TrainingRepository {
  private dbName: string;
  constructor(dbName = "gym-tracker-public-v1") { this.dbName = dbName; }
  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("此浏览器无法使用本地数据库，请使用普通 Safari 标签页打开。"));
        return;
      }
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("state");
      request.onerror = () => reject(new Error("无法打开本机数据库，请检查浏览器存储权限。历史数据不会重置。"));
      request.onblocked = () => reject(new Error("数据库正在升级，请关闭其他 GYM TRACKER 标签页后重试。"));
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
    });
  }
  async load(): Promise<Stored> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("state", "readwrite");
      const request = tx.objectStore("state").get("current");
      let result: Stored;
      let error: unknown;
      request.onsuccess = () => {
        try {
          const stored = request.result as Stored | undefined;
          result = stored ? { data: stateSchema.parse(stored.data), revision: stored.revision } : { data: initialState(), revision: 0 };
          if (!Number.isSafeInteger(result.revision) || result.revision < 0) throw new Error("数据版本无效");
          const upgraded = upgradeCatalog(result.data);
          if (upgraded !== result.data) {
            result = { data: stateSchema.parse(upgraded), revision: result.revision + 1 };
            tx.objectStore("state").put(result, "current");
          }
        } catch (e) { error = e; }
      };
      tx.oncomplete = () => {
        db.close();
        if (error) reject(new Error("本机数据校验失败，请保留浏览器数据并从完整备份恢复。"));
        else resolve(result);
      };
      tx.onerror = tx.onabort = () => { db.close(); reject(new Error("读取失败，请重新载入；历史记录不会被清空。")); };
    });
  }
  async save(data: State, revision: number): Promise<number> {
    const checked = stateSchema.parse(data);
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("state", "readwrite");
      const store = tx.objectStore("state");
      const request = store.get("current");
      let conflict = false;
      request.onsuccess = () => {
        const current = request.result as Stored | undefined;
        if ((current?.revision ?? 0) !== revision) {
          conflict = true;
          tx.abort();
          return;
        }
        store.put({ data: checked, revision: revision + 1 }, "current");
      };
      tx.oncomplete = () => { db.close(); resolve(revision + 1); };
      tx.onabort = tx.onerror = () => {
        db.close();
        reject(new Error(conflict
          ? "另一标签页已更新数据，请先导出或保留当前输入，刷新页面后再修改。"
          : "保存失败：请检查浏览器存储空间与权限。当前输入尚未保存，请勿关闭页面。"));
      };
    });
  }
}
export const repository = new DataRepository();
export function download(
  name: string,
  content: string,
  type = "application/json",
) {
  downloadBlob(name, new Blob([content], { type }));
}
export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function downloadGif(name: string, dataUrl: string) {
  const bytes = Uint8Array.from(atob(dataUrl.split(",")[1]), c => c.charCodeAt(0));
  downloadBlob(name, new Blob([bytes], { type: "image/gif" }));
}
