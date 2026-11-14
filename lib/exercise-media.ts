export interface ExerciseMedia {
  version: number; gif: string; poster: string;
  animation?: { fps: number; frameCount: number; durationMs: number; sourcePoseCount: number; transition?: 'crossfade' | 'articulated-gait' };
}
const cache = new Map<string, Promise<ExerciseMedia>>();
const posters = new Map<string, Promise<string>>();
const CARDIO_MEDIA_VERSION = 'cardio-stepping-v2';
/** Cardio thumbnails must not download the full animation just to show a poster. */
export function loadExercisePoster(slug: string, cardio: boolean): Promise<string> {
  if (!cardio) return loadExerciseMedia(slug).then(media => media.poster);
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.reject(new Error('动作示范标识无效'));
  const known = posters.get(slug);
  if (known) return known;
  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}exercise-media/${slug}.poster.json?v=${CARDIO_MEDIA_VERSION}`, { signal: controller.signal });
      if (!response.ok) throw new Error('封面加载失败');
      const data = await response.json();
      if (data.version !== 1 || typeof data.poster !== 'string' || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data.poster)) throw new Error('封面格式无效');
      return data.poster as string;
    } finally { clearTimeout(timer); }
  })();
  posters.set(slug, request);
  request.catch(() => { if (posters.get(slug) === request) posters.delete(slug); });
  return request;
}
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
      const response = await fetch(`${import.meta.env.BASE_URL}exercise-media/${slug}.json?v=${CARDIO_MEDIA_VERSION}`, { signal: controller.signal, ...(retry ? { cache: 'reload' as const } : {}) });
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

