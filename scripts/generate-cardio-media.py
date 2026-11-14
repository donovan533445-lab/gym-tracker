"""Generate the 12 cardio pose GIFs from @bryllim/workout-guide@1.0.0.
Usage: python scripts/generate-cardio-media.py /absolute/path/to/unpacked/package
Requires Pillow for decoding and ffmpeg for GIF assembly. Artwork remains CC BY-SA 4.0.
"""
from pathlib import Path
from PIL import Image
import json,base64,subprocess,tempfile,sys,re,ast
root=Path(__file__).resolve().parents[1]; source=Path(sys.argv[1])
ids=ast.literal_eval(re.search(r'CARDIO_TYPES = (\[.*?\])', (root/'lib/cardio-catalog.ts').read_text()).group(1))
manifest={e['slug']:e for e in json.loads((source/'manifest.json').read_text())}
filter='[0:v]scale=384:384:flags=lanczos,split[fg][bg];[bg]lutrgb=r=23:g=27:b=28:a=255[base];[base][fg]overlay=shortest=1:format=rgb,split[a][b];[a]palettegen=max_colors=256:reserve_transparent=0[p];[b][p]paletteuse=dither=none'
for slug in ids:
 e=manifest[slug]
 raw=b''.join(Image.open(source/e['frames'][n-1]['path']).convert('RGBA').tobytes() for n in [1,2,3,2])
 with tempfile.TemporaryDirectory() as tmp:
  gif=Path(tmp)/'demo.gif'
  subprocess.run(['ffmpeg','-loglevel','error','-f','rawvideo','-pixel_format','rgba','-video_size','512x512','-framerate','2','-i','pipe:0','-filter_complex',filter,'-pix_fmt','pal8','-loop','0','-y',str(gif)],input=raw,check=True)
  data={'version':1,'gif':'data:image/gif;base64,'+base64.b64encode(gif.read_bytes()).decode(),'poster':'data:image/png;base64,'+base64.b64encode((source/e['frames'][0]['path']).read_bytes()).decode()}
  (root/'public/exercise-media'/f'{slug}.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
(root/'public/exercise-media/CARDIO_ATTRIBUTION.json').write_text(json.dumps({'sourcePackage':'@bryllim/workout-guide@1.0.0','creators':['Bryl Lim','Everkinetic'],'license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','changes':'Frames assembled as 384px dark-matte GIFs, 1→2→3→2 at 2fps; first pose retained as PNG poster. Chinese names and cues added. Incline-walk illustration shows an incline treadmill.','exercises':[manifest[x] for x in ids]},ensure_ascii=False,indent=2)+'\n')
print('Generated',len(ids),'cardio GIFs')
