import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, ExternalLink, RefreshCw, Dumbbell, Film } from 'lucide-react';
import { downloadGif } from '@/lib/storage';
import type { Exercise } from '@/lib/model';
import { guideById, type ExerciseGuide } from '@/lib/exercise-catalog';
import { loadExerciseMedia, type ExerciseMedia } from '@/lib/exercise-media';
import { Modal } from './ui';

function useMedia(guide: ExerciseGuide | undefined, active: boolean) {
  const [media, setMedia] = useState<ExerciseMedia | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setMedia(null); setError(false);
    if (!guide || !active) return;
    let current = true;
    loadExerciseMedia(guide.slug, attempt > 0).then(value => { if (current) setMedia(value); }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [guide, active, attempt]);
  return { media, error, retry: () => setAttempt(n => n + 1) };
}

export function ExercisePreview({ exercise, onOpen }: { exercise: Exercise; onOpen: () => void }) {
  const guide = guideById(exercise.demoId);
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const { media } = useMedia(guide, visible);
  useEffect(() => {
    if (!ref.current || !guide) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '120px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [guide]);
  return <button ref={ref} type="button" className={`exercise-preview ${guide ? '' : 'no-demo'}`} onClick={onOpen} aria-label={`查看${exercise.name}动作示范`}>
    {media ? <img src={media.poster} alt="" loading="lazy" width={512} height={512}/> : <Dumbbell size={38} strokeWidth={1.25}/>}
    <span className="preview-play"><Play size={14} fill="currentColor"/>{guide ? 'GIF 示范' : '关联示范'}</span>
  </button>;
}

export function ExerciseGuideContent({ exercise }: { exercise: Exercise }) {
  const guide = guideById(exercise.demoId);
  const { media, error, retry } = useMedia(guide, true);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [imageError, setImageError] = useState(false);
  useEffect(() => { setImageError(false); }, [media]);
  if (!guide) return <div className="demo-unavailable"><Film size={28}/><p>这个自定义动作尚未关联示范。</p><small>在动作库编辑中选择对应的示范动作，避免用不匹配的图示代替。</small></div>;
  return <div className="exercise-guide">
    <div className="demo-meta"><span className="tag">{exercise.group}</span><span>{guide.equipment}</span><span>{guide.target}</span></div>
    <div className="demo-visual" aria-label={`${exercise.name}分解动作示范`}>
      {error || imageError ? <div className="demo-failure" role="status"><p>示范暂时无法加载</p><button type="button" className="button secondary" onClick={() => { setImageError(false); retry(); }}><RefreshCw size={15}/>重新加载</button></div>
      : media ? <img key={playing ? 'gif' : 'poster'} src={playing ? media.gif : media.poster} alt={`${exercise.name}：三个关键姿态循环分解示范`} width={384} height={384} onError={() => setImageError(true)}/>
      : <span className="demo-loading" role="status">正在载入动作示范…</span>}
    </div>
    <div className="demo-controls"><button type="button" className="button secondary" disabled={!media || error || imageError} onClick={() => setPlaying(v => !v)}>{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? '暂停示范' : '播放示范'}</button>
      {media && <a className="text-link" href={media.gif} download={`${exercise.name}.gif`} onClick={e => { e.preventDefault(); downloadGif(`${exercise.name}.gif`, media.gif); }}><Download size={15}/>下载 GIF</a>}
    </div>
    <p className="demo-caption">分解动作示范 · 3 个关键姿态 · 循环播放</p>
    <h3>动作要点</h3><ol className="demo-steps">{guide.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
    <div className="demo-credit">图示：Bryl Lim / Everkinetic · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a><a href={guide.sourceUrl} target="_blank" rel="noreferrer">查看原图来源 <ExternalLink size={11}/></a></div>
  </div>;
}

export function ExerciseDemoModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return <Modal title={`${exercise.name} · 动作示范`} onClose={onClose}><div className="modal-body"><ExerciseGuideContent key={exercise.demoId || exercise.id} exercise={exercise}/></div></Modal>;
}

export function ExerciseInlineGuide({ exercise }: { exercise: Exercise }) {
  const [open, setOpen] = useState(false);
  if (!guideById(exercise.demoId)) return null;
  return <details className="exercise-inline-guide" onToggle={e => setOpen(e.currentTarget.open)}><summary><Film size={15}/>查看动作示范 GIF</summary>{open && <ExerciseGuideContent key={exercise.demoId} exercise={exercise}/>}</details>;
}
