"""Build 12 fps key-pose crossfades without accelerating the two-second cycle.

Usage: python scripts/generate-cardio-media.py [unpacked-workout-guide-package]
Without a package, reuse the three original key poses in the committed GIFs.
Requires Pillow. Artwork and derivatives remain CC BY-SA 4.0.
"""
from pathlib import Path
from PIL import Image
import ast
import base64
import io
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public/exercise-media"
IDS = ast.literal_eval(re.search(r"CARDIO_TYPES = (\[.*?\])", (ROOT / "lib/cardio-catalog.ts").read_text(encoding="utf-8")).group(1))
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else None
MANIFEST = {e["slug"]: e for e in json.loads((SOURCE / "manifest.json").read_text())} if SOURCE else None
BACKGROUND = (23, 27, 28)
TIMING = [80, 90, 80, 80, 90, 80] * 4  # Centisecond precision: exactly 2 s / 24 frames.


def data_url(kind, content):
    return f"data:image/{kind};base64," + base64.b64encode(content).decode()


def original_poses(slug, old):
    if SOURCE:
        poses = []
        for frame in MANIFEST[slug]["frames"][:3]:
            with Image.open(SOURCE / frame["path"]) as image:
                rgba = image.convert("RGBA").resize((384, 384), Image.Resampling.LANCZOS)
                matte = Image.new("RGB", rgba.size, BACKGROUND)
                matte.paste(rgba, mask=rgba.getchannel("A"))
                poses.append(matte)
        return poses
    # Known key frames prevent compounded crossfades when this script is rerun.
    indexes = old.get("animation", {}).get("poseFrames", [0, 1, 2])
    with Image.open(io.BytesIO(base64.b64decode(old["gif"].split(",", 1)[1]))) as image:
        poses = []
        for index in indexes:
            image.seek(index)
            poses.append(image.convert("RGB").copy())
        return poses


for slug in IDS:
    path = MEDIA / f"{slug}.json"
    old = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    if old.get("animation", {}).get("transition") == "articulated-gait":
        print(f"{slug}: keep articulated gait; rebuild with generate-stepping-media.mjs")
        continue
    poses = original_poses(slug, old)
    # One shared palette prevents color flicker; no dithering on line art.
    palette = Image.new("P", (1, 1))
    palette.putpalette([round(channel + (255 - channel) * shade / 255) for shade in range(256) for channel in BACKGROUND])
    frames = []
    sequence = [0, 1, 2, 1, 0]
    for start, end in zip(sequence, sequence[1:]):
        for index in range(6):
            t = index / 6
            eased = t * t * (3 - 2 * t)
            frame = Image.blend(poses[start], poses[end], eased)
            frames.append(frame.quantize(palette=palette, dither=Image.Dither.NONE))
    output = io.BytesIO()
    frames[0].save(output, format="GIF", save_all=True, append_images=frames[1:], duration=TIMING, loop=0, disposal=1, optimize=False)
    poster = io.BytesIO()
    poses[0].save(poster, format="PNG", optimize=True)
    poster_url = data_url("png", poster.getvalue())
    data = {
        "version": 1,
        "gif": data_url("gif", output.getvalue()),
        "poster": poster_url,
        "animation": {"fps": 12, "frameCount": 24, "durationMs": 2000, "sourcePoseCount": 3, "poseFrames": [0, 6, 12], "transition": "crossfade"},
    }
    path.write_text(json.dumps(data, separators=(",", ":")) + "\n", encoding="utf-8")
    # Cards fetch only this small poster, never the full animation payload.
    (MEDIA / f"{slug}.poster.json").write_text(json.dumps({"version": 1, "poster": poster_url}, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{slug}: {len(frames)} frames, {sum(TIMING)} ms, {len(output.getvalue())} bytes")

attribution_path = MEDIA / "CARDIO_ATTRIBUTION.json"
attribution = json.loads(attribution_path.read_text(encoding="utf-8"))
if not attribution.get("replacements"):
    attribution["changes"] = "Three original key poses assembled as 384px dark-matte GIFs with smoothstep crossfade transitions, 1→2→3→2→1, 24 frames / 2 seconds (12 fps average). Transitions blend existing poses; they are not captured intermediate motion. A shared palette prevents color flicker. First pose retained as a separate dark-matte PNG preview payload. Chinese names and cues added."
if MANIFEST:
    attribution["exercises"] = [MANIFEST[slug] for slug in IDS]
attribution_path.write_text(json.dumps(attribution, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

