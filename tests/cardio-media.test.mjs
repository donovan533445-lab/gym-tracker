import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CARDIO_TYPES } from '../lib/cardio-catalog.ts';

// Inspect the encoded GIF, so a metadata-only fps change cannot pass this check.
function gifDelays(bytes) {
  assert.equal(bytes.subarray(0, 6).toString(), 'GIF89a');
  let position = 13;
  if (bytes[10] & 128) position += 3 * 2 ** ((bytes[10] & 7) + 1);
  let delay = 0;
  const delays = [];
  const skipBlocks = () => {
    while (bytes[position]) {
      const length = bytes[position++];
      position += length;
      assert.ok(position < bytes.length);
    }
    position++;
  };
  while (position < bytes.length) {
    const kind = bytes[position++];
    if (kind === 0x3b) break;
    if (kind === 0x21) {
      const label = bytes[position++];
      if (label === 0xf9) delay = bytes.readUInt16LE(position + 2) * 10;
      skipBlocks();
    } else if (kind === 0x2c) {
      const flags = bytes[position + 8];
      position += 9;
      if (flags & 128) position += 3 * 2 ** ((flags & 7) + 1);
      position++; // LZW minimum code size.
      skipBlocks();
      delays.push(delay);
    } else assert.fail(`Invalid GIF block ${kind}`);
  }
  return delays;
}

test('all 12 cardio GIFs encode 24 timed frames and preserve the two-second cycle', () => {
  for (const slug of CARDIO_TYPES) {
    const media = JSON.parse(readFileSync(new URL(`../public/exercise-media/${slug}.json`, import.meta.url)));
    const gif = Buffer.from(media.gif.split(',')[1], 'base64');
    const delays = gifDelays(gif);
    assert.equal(delays.length, 24, slug);
    assert.ok(delays.every(ms => ms === 80 || ms === 90), slug);
    assert.equal(delays.reduce((a, b) => a + b, 0), 2000, slug);
    assert.ok(gif.includes(Buffer.from('NETSCAPE2.0')), slug);
    assert.equal(media.animation.fps, 12);
    assert.deepEqual(media.animation.poseFrames, media.animation.transition === 'articulated-gait' ? [0, 6, 12, 18] : [0, 6, 12]);
    const preview = readFileSync(new URL(`../public/exercise-media/${slug}.poster.json`, import.meta.url), 'utf8');
    assert.ok(preview.length < JSON.stringify(media).length / 10, slug);
    const poster = JSON.parse(preview);
    assert.equal(poster.poster, media.poster);
    assert.equal(poster.gif, undefined, 'preview payload must exclude the animation');
  }
});
