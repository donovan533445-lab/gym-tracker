export interface ExerciseMedia { version: number; gif: string; poster: string }
const cache = new Map<string, Promise<ExerciseMedia>>();
/** Keep the media on this site: no third-party requests, API keys or hotlink dependency. */
export function loadExerciseMedia(slug: string, retry = false): Promise<ExerciseMedia> {
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.reject(new Error('动作示范标识无效'));
  if (retry) cache.delete(slug);
  const known = cache.get(slug);
  if (known) return known;
  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}exercise-media/${slug}.json`, { signal: controller.signal });
      if (!response.ok) throw new Error('示范加载失败');
      const data = await response.json() as ExerciseMedia;
      if (data.version !== 1 || !/^data:image\/gif;base64,[A-Za-z0-9+/=]+$/.test(data.gif) || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data.poster)) throw new Error('示范格式无效');
      return data;
    } finally { clearTimeout(timer); }
  })();
  cache.set(slug, request);
  request.catch(() => { if (cache.get(slug) === request) cache.delete(slug); });
  return request;
}
