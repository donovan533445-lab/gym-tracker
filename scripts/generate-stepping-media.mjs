/** Authoring only. Requires Sharp and Pillow; ordinary site builds need neither.
 * npm install --no-save --package-lock=false sharp
 * node scripts/generate-stepping-media.mjs [scratch-directory]
 * GYM_SHARP_MODULE / GYM_PYTHON may select installed local authoring tools.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { frameSvg, gaitPose, STEPPING_TYPES } from './stepping-poses.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = path.resolve(process.argv[2] || path.join(root, 'work/stepping-render'));
const sharp = createRequire(import.meta.url)(process.env.GYM_SHARP_MODULE || 'sharp');
for (const slug of STEPPING_TYPES) {
  const directory = path.join(scratch, slug);
  await mkdir(directory, { recursive: true });
  const poses = [];
  for (let index = 0; index < 24; index++) {
    const svg = frameSvg(slug, index / 24);
    await writeFile(path.join(directory, `${index}.svg`), svg);
    await sharp(Buffer.from(svg), { density: 144 }).resize(384, 384).png().toFile(path.join(directory, `${index}.png`));
    poses.push(gaitPose(slug, index / 24));
  }
  await writeFile(path.join(directory, 'poses.json'), JSON.stringify(poses));
}
const result = spawnSync(process.env.GYM_PYTHON || 'python', [path.join(root, 'scripts/encode-stepping-media.py'), scratch], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
