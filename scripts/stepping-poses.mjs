// Native vector diagrams: joint positions move continuously; frames are never crossfaded.
export const STEPPING_TYPES = ['treadmill-incline-walk', 'stair-climber'];
const BG = '#171b1c', INK = '#edf3ef', FAR = '#a4cf77';
const TAU = Math.PI * 2;
const phaseOf = phase => ((phase % 1) + 1) % 1;
const ease = t => t * t * (3 - 2 * t);
const n = value => Number(value.toFixed(2));
const point = p => `${n(p.x)},${n(p.y)}`;
const add = (a, b, scale = 1) => ({ x: a.x + b.x * scale, y: a.y + b.y * scale });
const norm = (a, b) => {
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: (b.y - a.y) / length, y: -(b.x - a.x) / length };
};

export function kneeFor(hip, ankle, thigh = 58, shin = 56) {
  const dx = ankle.x - hip.x, dy = ankle.y - hip.y;
  const distance = Math.hypot(dx, dy);
  if (distance >= thigh + shin || distance <= Math.abs(thigh - shin)) throw new Error('Unreachable foot position');
  const along = (thigh * thigh - shin * shin + distance * distance) / (2 * distance);
  const height = Math.sqrt(thigh * thigh - along * along);
  return { x: hip.x + along * dx / distance + height * dy / distance, y: hip.y + along * dy / distance - height * dx / distance };
}

export function footAt(slug, phase) {
  const p = phaseOf(phase), stance = 0.625;
  const stair = slug === 'stair-climber';
  let x, y;
  if (p < stance) {
    x = stair ? 262 - 80 * p : 234 - 112 * p;
    y = stair ? 246 + 60 * p : 324 - 0.18 * (x - 70) - 8;
  } else {
    const swing = (p - stance) / (1 - stance), travel = ease(swing);
    x = stair ? 212 + 50 * travel : 164 + 70 * travel;
    y = stair
      ? 246 + 37.5 * (1 - travel) - 32 * Math.sin(Math.PI * swing)
      : 324 - 0.18 * (x - 70) - 8 - 28 * Math.sin(Math.PI * swing);
  }
  return { x, y, stance: p < stance, angle: stair ? 0 : -Math.atan(0.18) };
}

export function gaitPose(slug, phase) {
  if (!STEPPING_TYPES.includes(slug)) throw new Error('Unsupported stepping diagram');
  const p = phaseOf(phase), stair = slug === 'stair-climber';
  const center = { x: stair ? 211 : 184, y: (stair ? 172 : 189) + 1.2 * Math.cos(2 * TAU * p) };
  const leg = (offset, shift) => {
    const hip = { x: center.x + offset, y: center.y };
    const ankle = footAt(slug, p + shift);
    return { hip, knee: kneeFor(hip, ankle), ankle };
  };
  return { phase: p, center, left: leg(4, 0), right: leg(-4, 0.5) };
}

function smoothPolygon(points) {
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  let path = `M${point(mid(points.at(-1), points[0]))}`;
  for (let i = 0; i < points.length; i++) path += ` Q${point(points[i])} ${point(mid(points[i], points[(i + 1) % points.length]))}`;
  return path + 'Z';
}

function legSvg(leg, color, fill) {
  const { hip, knee, ankle } = leg;
  const thighNormal = norm(hip, knee), shinNormal = norm(knee, ankle);
  const calf = { x: knee.x + (ankle.x - knee.x) * 0.36, y: knee.y + (ankle.y - knee.y) * 0.36 };
  const contour = smoothPolygon([
    add(hip, thighNormal, 13), add(knee, thighNormal, 8), add(calf, shinNormal, 10), add(ankle, shinNormal, 4),
    add(ankle, shinNormal, -4), add(calf, shinNormal, -7), add(knee, thighNormal, -8), add(hip, thighNormal, -13),
  ]);
  const hem = { x: hip.x + (knee.x - hip.x) * 0.4, y: hip.y + (knee.y - hip.y) * 0.4 };
  return `<g fill="${fill}" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="${contour}"/>
    <path d="M${point(add(hem, thighNormal, -11))} L${point(add(hem, thighNormal, 11))}" stroke-width="1.6"/>
    <path d="M${point(add(knee, shinNormal, 1.5))} Q${point(add(calf, shinNormal, 3))} ${point(add(ankle, shinNormal, 1))}" fill="none" stroke-width="1" opacity=".65"/>
    <g transform="translate(${n(ankle.x)} ${n(ankle.y)}) rotate(${n(ankle.angle * 180 / Math.PI)})">
      <path d="M-6,-5 L5,-5 Q9,0 20,1 Q25,2 25,7 L-9,7 Q-11,2 -6,-5Z"/>
      <path d="M-8,4 H23 M8,-1 L4,3 M13,0 L9,3" fill="none" stroke-width="1.3"/>
    </g>
  </g>`;
}

function torsoSvg(center, stair) {
  const hand = stair ? { x: 70, y: -15 } : { x: 92, y: -35 };
  const forearm = smoothPolygon([{ x: 19, y: -79 }, { x: 38, y: -61 }, { x: 48, y: -42 }, add(hand, { x: 0, y: -5 }), add(hand, { x: 2, y: 5 }), { x: 42, y: -31 }, { x: 26, y: -46 }, { x: 8, y: -67 }]);
  return `<g transform="translate(${n(center.x)} ${n(center.y)})" fill="${BG}" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-8,-74 Q-22,-55 -5,-39 L${n(hand.x - 12)},${n(hand.y + 3)}" fill="none" stroke="#81988c" stroke-width="9"/>
    <path d="M-8,-74 Q-22,-55 -5,-39 L${n(hand.x - 12)},${n(hand.y + 3)}" fill="none" stroke="${BG}" stroke-width="4"/>
    <path d="M-15,-4 Q-18,-21 -14,-37 Q-24,-67 -10,-79 Q3,-91 21,-79 Q33,-68 24,-48 L14,-11 Q17,1 10,8 L-11,8Z" stroke-width="2.7"/>
    <path d="M4,-82 L6,-94 L24,-94 L26,-80" stroke-width="2.2"/>
    <path d="M6,-95 Q-4,-105 0,-124 Q4,-139 21,-135 Q37,-133 34,-116 L40,-108 L33,-105 L31,-96 Q22,-89 6,-95Z" stroke-width="2.5"/>
    <path d="M27,-119 h2 M29,-100 Q21,-101 19,-108 M-8,-61 Q9,-70 22,-60 M-7,-44 Q6,-36 18,-41 M-8,-23 L10,-20 M-12,-9 Q1,-5 14,-11" fill="none" stroke-width="1.3" opacity=".7"/>
    <path d="${forearm}" stroke-width="2.5"/>
    <path d="M17,-73 Q28,-68 31,-56 M43,-40 L${n(hand.x - 9)},${n(hand.y)}" fill="none" stroke-width="1.1" opacity=".65"/>
  </g>`;
}

function treadmillSvg(phase) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const x = 45 + i * 28 - ((phase * 4) % 1) * 28;
    return `<path d="M${n(x)},${n(324 - 0.18 * (x - 70))} l15,-2.7"/>`;
  }).join('');
  return `<defs><clipPath id="belt"><path d="M65,324 L304,281 L316,293 L74,337Z"/></clipPath></defs>
    <g stroke-linejoin="round" stroke-linecap="round">
      <path d="M59,325 L302,281 L320,294 L74,341 L59,335Z" fill="#202829" stroke="#a0afa9" stroke-width="2.4"/>
      <path d="M74,341 L74,352 L91,352 L96,337 M292,303 L298,333 L330,333 L321,293" fill="${BG}" stroke="#a0afa9" stroke-width="2.4"/>
      <g clip-path="url(#belt)" stroke="#829b85" stroke-width="2">${ticks}</g>
      <path d="M305,285 L277,145 L255,145 M314,284 L287,140 Q285,133 276,133 L251,136" fill="none" stroke="#a0afa9" stroke-width="3"/>
      <path d="M238,151 L256,119 L298,114 L282,145Z" fill="#202829" stroke="#c1cbc5" stroke-width="2.5"/>
      <path d="M249,149 L287,141 M261,127 L284,123" fill="none" stroke="#7b9180" stroke-width="2"/>
      <path d="M217,156 L285,145" fill="none" stroke="#c1cbc5" stroke-width="5"/>
    </g>`;
}

function stairSvg(phase) {
  const travel = ((phase * 2) % 1) * 40;
  const stairs = Array.from({ length: 10 }, (_, i) => {
    const x = 48 + i * 40 - travel, y = 404 - i * 30 + travel * 0.75;
    return `<path d="M${n(x)},${n(y)} h40 v-30" fill="none"/><path d="M${n(x)},${n(y + 6)} h38" stroke="#455a4e" stroke-width="1.2"/>`;
  }).join('');
  return `<defs><clipPath id="stairs"><path d="M117,345 L278,223 L312,245 L158,366Z"/></clipPath></defs>
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d="M112,351 L279,221 L315,242 L159,370 L112,364Z" fill="#212a27" stroke="#8faaa0" stroke-width="2.5"/>
      <g clip-path="url(#stairs)" stroke="#c1cec4" stroke-width="2.7">${stairs}</g>
      <path d="M160,363 L300,251 Q317,239 323,265 L323,353 Q305,367 291,367Z" fill="#1c2423" stroke="#9aafa5" stroke-width="2.5"/>
      <path d="M176,358 L304,258 M104,368 H330" fill="none" stroke="#566d5e" stroke-width="2.2"/>
      <path d="M316,271 L294,152 Q293,143 284,144 L252,154 M306,272 L286,159" fill="none" stroke="#a0afa9" stroke-width="3"/>
      <path d="M263,150 L270,124 L301,122 L295,147Z" fill="#232c27" stroke="#b9c8bb" stroke-width="2.5"/>
      <path d="M244,160 L296,151" stroke="#b9c8bb" stroke-width="4"/>
    </g>`;
}

export function frameSvg(slug, phase) {
  const pose = gaitPose(slug, phase), stair = slug === 'stair-climber';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384" viewBox="0 0 384 384">
    <rect width="384" height="384" fill="${BG}"/>
    <g font-family="Arial,Microsoft YaHei,sans-serif" font-size="11" fill="#a8b7ac">
      <path d="M24,26 h17" stroke="${INK}" stroke-width="3"/><text x="48" y="30">左腿</text>
      <path d="M100,26 h17" stroke="${FAR}" stroke-width="3" stroke-dasharray="4 2"/><text x="124" y="30">右腿</text>
    </g>
    ${stair ? stairSvg(pose.phase) : treadmillSvg(pose.phase)}
    ${legSvg(pose.right, FAR, '#182219')}
    ${legSvg(pose.left, INK, BG)}
    ${torsoSvg(pose.center, stair)}
  </svg>`;
}
