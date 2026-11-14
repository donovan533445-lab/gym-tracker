import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { frameSvg, gaitPose, STEPPING_TYPES } from '../scripts/stepping-poses.mjs';
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('both legs alternate support and swing, keep limb lengths, and close the loop', () => {
  for (const slug of STEPPING_TYPES) {
    const cycle = Array.from({ length: 24 }, (_, index) => gaitPose(slug, index / 24));
    for (const leg of ['left', 'right']) {
      const ankles = cycle.map(pose => pose[leg].ankle);
      assert.ok(Math.max(...ankles.map(p => p.x)) - Math.min(...ankles.map(p => p.x)) >= 45, slug);
      assert.ok(Math.max(...ankles.map(p => p.y)) - Math.min(...ankles.map(p => p.y)) >= 30, slug);
      assert.ok(ankles.some(p => p.stance) && ankles.some(p => !p.stance));
      for (const pose of cycle) {
        const { hip, knee, ankle } = pose[leg];
        assert.ok(Math.abs(distance(hip, knee) - 58) < 1e-6, slug);
        assert.ok(Math.abs(distance(knee, ankle) - 56) < 1e-6, slug);
      }
    }
    assert.deepEqual(cycle[0].left.ankle, cycle[12].right.ankle, slug);
    assert.deepEqual(cycle[0].right.ankle, cycle[12].left.ankle, slug);
    assert.notEqual(cycle[6].left.ankle.stance, cycle[6].right.ankle.stance, slug);
    assert.equal(frameSvg(slug, 0), frameSvg(slug, 1), 'seamless loop');
    const media = JSON.parse(readFileSync(new URL(`../public/exercise-media/${slug}.json`, import.meta.url)));
    assert.equal(media.animation.transition, 'articulated-gait');
  }
});
