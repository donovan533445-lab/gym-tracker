"""Encode native vector gait diagrams as GIFs. Called by generate-stepping-media.mjs."""
from pathlib import Path
from PIL import Image
import base64
import io
import json
import sys

root = Path(__file__).resolve().parents[1]
scratch = Path(sys.argv[1])
timing = [80, 90, 80, 80, 90, 80] * 4
slugs = ["treadmill-incline-walk", "stair-climber"]
for slug in slugs:
    directory = scratch / slug
    images = [Image.open(directory / f"{i}.png").convert("RGB") for i in range(24)]
    # One palette for the entire cycle prevents outline flicker.
    strip = Image.new("RGB", (384 * 4, 384))
    for column, index in enumerate([0, 6, 12, 18]):
        strip.paste(images[index], (384 * column, 0))
    palette = strip.quantize(colors=128, dither=Image.Dither.NONE)
    frames = [im.quantize(palette=palette, dither=Image.Dither.NONE) for im in images]
    output = io.BytesIO()
    frames[0].save(output, format="GIF", save_all=True, append_images=frames[1:], duration=timing, loop=0, disposal=1, optimize=False)
    poster = io.BytesIO()
    frames[0].save(poster, format="PNG", optimize=True)
    poster_url = "data:image/png;base64," + base64.b64encode(poster.getvalue()).decode()
    data = {
        "version": 1,
        "gif": "data:image/gif;base64," + base64.b64encode(output.getvalue()).decode(),
        "poster": poster_url,
        "animation": {"fps": 12, "frameCount": 24, "durationMs": 2000, "sourcePoseCount": 0, "poseFrames": [0, 6, 12, 18], "transition": "articulated-gait"},
    }
    media = root / "public/exercise-media"
    (media / f"{slug}.json").write_text(json.dumps(data, separators=(",", ":")) + "\n", encoding="utf-8")
    (media / f"{slug}.poster.json").write_text(json.dumps({"version": 1, "poster": poster_url}, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{slug}: {len(frames)} independently drawn frames; {len(output.getvalue())} GIF bytes")

attribution_path = root / "public/exercise-media/CARDIO_ATTRIBUTION.json"
attribution = json.loads(attribution_path.read_text(encoding="utf-8"))
attribution["changes"] = "Ten activities retain three-pose smoothstep crossfade illustrations from the source package. Treadmill incline walking and stair climbing are replaced by original native-vector articulated gait diagrams, credited below. All use 24 frames / 2 seconds; separate PNG preview payloads avoid loading GIFs in the library."
attribution["replacements"] = [{
    "slug": slug,
    "creator": "GYM TRACKER",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceFile": "scripts/stepping-poses.mjs",
    "changes": "Original native-vector gait diagram replaces the previous near-identical key poses. Left and right feet alternate stance and swing; hip, knee and ankle are articulated with fixed segment lengths. Belt or stairs move with planted feet. 24 independently drawn frames / 2 seconds, with no opacity crossfades.",
} for slug in slugs]
attribution_path.write_text(json.dumps(attribution, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
