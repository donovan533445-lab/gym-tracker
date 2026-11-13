#!/usr/bin/env python3
"""Assemble licensed vector-pose PNG frames into real looping GIFs.
Usage: python scripts/generate-exercise-media.py /path/to/unpacked/workout-guide/package
Requires ffmpeg and Pillow (PNG decoding only). No network requests or AI-generated movement interpolation.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import base64, json, subprocess, sys, tempfile
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]).resolve()
manifest={e['slug']:e for e in json.loads((SOURCE/'manifest.json').read_text())}
rows=[line.split('|') for line in (ROOT/'content/exercises.tsv').read_text().splitlines() if line]
legacy={
 '平板杠铃卧推':'exercise-0-0','上斜杠铃卧推':'exercise-0-1','哑铃卧推':'exercise-0-2','上斜哑铃卧推':'exercise-0-3','双杠臂屈伸':'exercise-0-4','绳索夹胸':'exercise-0-5',
 '杠铃推肩':'exercise-1-0','哑铃推肩':'exercise-1-1','阿诺德推举':'exercise-1-2','哑铃侧平举':'exercise-1-3','绳索侧平举':'exercise-1-4','反向飞鸟':'exercise-1-5',
 '引体向上':'exercise-2-0','高位下拉':'exercise-2-1','杠铃划船':'exercise-2-2','坐姿划船':'exercise-2-3','单臂哑铃划船':'exercise-2-4',
 '杠铃深蹲':'exercise-3-0','腿举':'exercise-3-1','罗马尼亚硬拉':'exercise-3-2','腿屈伸':'exercise-3-3','腿弯举':'exercise-3-4','提踵':'exercise-3-5','传统硬拉':'exercise-3-6',
 '杠铃弯举':'exercise-4-0','哑铃弯举':'exercise-4-1','锤式弯举':'exercise-4-2','绳索下压':'exercise-4-3','仰卧臂屈伸':'exercise-4-4',
}
equipment={'Barbell':'杠铃','Dumbbell':'哑铃','Machine':'器械','Cable':'绳索','Bodyweight':'自重','Plate':'杠铃片'}
muscle={'Chest':'胸肌','Shoulders':'三角肌','Rear Delts':'三角肌后束','Upper Back':'上背 / 斜方肌','Posterior Chain':'臀部 / 腿后侧','Hamstrings':'腘绳肌','Back':'背部','Lats':'背阔肌','Biceps':'肱二头肌','Quads':'股四头肌','Glutes':'臀肌','Calves':'小腿','Triceps':'肱三头肌','Forearms':'前臂','Lower Back':'竖脊肌','Core':'腹部 / 核心','Adductors':'大腿内收肌'}
out=ROOT/'public/exercise-media';out.mkdir(parents=True,exist_ok=True)

def build(row):
 group,name,slug,*steps=row;e=manifest[slug]
 path=out/(slug+'.json')
 if not path.exists():
  with tempfile.TemporaryDirectory() as tmp:
   tmp=Path(tmp)
   raw=b''.join(Image.open(SOURCE/e['frames'][n-1]['path']).convert('RGBA').tobytes() for n in [1,2,3,2])
   gif=tmp/'demo.gif'
   subprocess.run(['ffmpeg','-loglevel','error','-f','rawvideo','-pixel_format','rgba','-video_size','512x512','-framerate','2','-i','pipe:0','-filter_complex','[0:v]scale=384:384:flags=lanczos,split[fg][bg];[bg]lutrgb=r=23:g=27:b=28:a=255[base];[base][fg]overlay=shortest=1:format=rgb,split[a][b];[a]palettegen=max_colors=256:reserve_transparent=0[p];[b][p]paletteuse=dither=none','-pix_fmt','pal8','-loop','0','-y',str(gif)],input=raw,check=True)
   encoded={'version':1,'gif':'data:image/gif;base64,'+base64.b64encode(gif.read_bytes()).decode(),'poster':'data:image/png;base64,'+base64.b64encode((SOURCE/e['frames'][0]['path']).read_bytes()).decode()}
   path.write_text(json.dumps(encoded,separators=(',',':'))+'\n')
 return {'id':legacy.get(name,'exercise-'+slug),'name':name,'group':group,'slug':slug,'englishName':e['name'],'equipment':equipment[e['equipment']],'target':muscle[e['primaryMuscle']],'steps':steps,'sourceUrl':'https://bryllim.github.io/workout-guide/exercises/'+slug+'/'}

with ThreadPoolExecutor(max_workers=4) as pool: catalog=list(pool.map(build,rows))
assert len(catalog)==100 and len({x['id'] for x in catalog})==100
(ROOT/'lib/exercise-catalog.ts').write_text('''// Catalog v2. Original IDs are intentionally stable for existing training history.
export interface ExerciseGuide {
 id: string; name: string; group: "胸部" | "肩部" | "背部" | "腿部" | "手臂" | "其他";
 slug: string; englishName: string; equipment: string; target: string;
 steps: string[]; sourceUrl: string;
}
export const CATALOG_VERSION = 2;
export const EXERCISE_CATALOG: ExerciseGuide[] = '''+json.dumps(catalog,ensure_ascii=False,indent=2)+''';
export const guideById = (id?: string) => EXERCISE_CATALOG.find(e => e.id === id);
''')
(ROOT/'public/exercise-media/ATTRIBUTION.json').write_text(json.dumps({'sourcePackage':'@bryllim/workout-guide@1.0.0','source':'https://github.com/bryllim/workout-guide','creators':['Bryl Lim','Everkinetic'],'license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','changes':'Selected 100 exercises; assembled frames 1→2→3→2 as 384px looping GIFs at 2fps. Dark matte background added. Original first-pose PNG retained as poster. Chinese names and concise cues added by GYM TRACKER.','exercises':[manifest[row[2]] for row in rows]},ensure_ascii=False,indent=2)+'\n')
license=(SOURCE/'LICENSE-ASSETS').read_text()
(ROOT/'public/exercise-media/LICENSE.txt').write_text(license)
(ROOT/'public/exercise-media/README.txt').write_text('GYM TRACKER exercise GIFs and posters\nArtwork: Bryl Lim / Everkinetic · CC BY-SA 4.0\nSource: https://github.com/bryllim/workout-guide (npm 1.0.0)\nChanges: 100 selections, 384px GIF assembly of poses 1→2→3→2, 2fps, dark matte background.\nEach JSON wraps actual GIF and PNG bytes as data URLs. No third-party runtime host needed.\nAttribution details: ATTRIBUTION.json. License: LICENSE.txt.\nGIFs are step-by-step illustrations, not filmed or continuous biomechanical animations.\n')
print('Created',len(catalog),'GIF packages;',sum(p.stat().st_size for p in out.glob('*.json')),'bytes')
