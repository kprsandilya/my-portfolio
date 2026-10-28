import * as THREE from "three";

// Layout and route for the skatepark version of the hobbies run, kept free of
// React so the route can be checked on its own. Loosely inspired by a
// concrete street park: a sunken bowl, a funbox, a flat rail, a quarter pipe,
// a grind ledge, a kicker, and a ledge by the start to finish against.
//
// The route is one loop. It drops into the bowl, carves around it, airs out,
// then lands one trick per hobby around the park and rolls to a stop against
// the ledge right next to where it dropped in.
//
// The board is placed from its wheels: on the street it sits on whatever is
// under its four wheels, so it tilts with ramps instead of floating level.
// Ollies pop off the tail, and grinds put the truck or deck on the obstacle.

// ---------- Layout (world units; the ground is y = 0) ----------
export const SLAB = { minX: -26, maxX: 26, minZ: -13, maxZ: 13, thickness: 3.6 };
export const BOWL = { x: -16, z: 0, flatRadius: 3, depth: 3, rimRadius: 6 };
export const FUNBOX = { x: -3, z: 5.5, halfLength: 4, topHalfLength: 1.5, height: 0.8, width: 3 };
export const RAIL = { fromX: 3.8, toX: 9.8, z: 4.6, height: 0.9, radius: 0.06 };
export const QUARTER = { x: 19, radius: 3.5, width: 12, deck: 3 }; // base at x, curving up toward +X
export const LEDGE = { fromX: 8.5, toX: 14, z: -3, height: 0.6, depth: 1.2 }; // grinded along its +Z top edge
export const KICKER = { fromX: 4.2, toX: 1.7, z: -1.5, height: 0.9, width: 2.5 }; // rises toward -X
export const REST_LEDGE = { fromX: -7.4, toX: -9.8, z: -1.6, height: 0.6, width: 1 }; // the board ends against its east end
// Scenery the route doesn't use, so the park doesn't look empty.
export const MANUAL_PAD = { fromX: 1, toX: 8, z: -7.5, height: 0.35, depth: 2 };
export const BANK = { fromX: -9, toX: -1, nearZ: -9.4, farZ: -12.3, height: 1.4 }; // rises toward -Z
export const BACK_WALL = { fromX: -22, toX: 22, z: -12.6, height: 1.8, thickness: 0.4 };
export const START = new THREE.Vector3(-8.5, 0, 0);

// Skateboard measurements at length 2 (from the model), relative to its center
// with +X toward the nose and +Y up through the deck.
export const BOARD = {
  length: 2,
  ride: 0.142, // center height above the ground when on all four wheels
  backAxle: -0.54,
  frontAxle: 0.51,
  wheelSide: 0.2,
  hanger: -0.098, // bottom of the trucks
  deck: 0.035, // underside of the deck at its middle
};
const RIDE = BOARD.ride;
// Extra clearance on curved walls so the wheels don't sink into the curve.
const CURVED = 0.05;
const STEP = 0.05; // sampling distance along the route

const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const lerp = THREE.MathUtils.lerp;

// ---------- Surfaces ----------

/** Height of the bowl's surface at distance r from its center. */
export function bowlY(r: number) {
  const { flatRadius: f, depth: d, rimRadius: rim } = BOWL;
  if (r <= f) return -d;
  if (r >= rim) return 0;
  const th = Math.asin((r - f) / (rim - f));
  return -d * Math.cos(th);
}

// Surface normal of the bowl (pointing into the bowl's open space).
function bowlNormal(r: number, phi: number) {
  const { flatRadius: f, rimRadius: rim } = BOWL;
  if (r <= f || r >= rim) return Y.clone();
  const th = Math.asin((r - f) / (rim - f));
  const radial = new THREE.Vector3(Math.cos(phi), 0, Math.sin(phi));
  return radial.multiplyScalar(-Math.sin(th)).add(new THREE.Vector3(0, Math.cos(th), 0)).normalize();
}

export function funboxTop(x: number, z: number) {
  const { x: cx, z: cz, halfLength: h, topHalfLength: t, height, width } = FUNBOX;
  const dx = Math.abs(x - cx);
  if (Math.abs(z - cz) > width / 2 || dx >= h) return -Infinity;
  return dx <= t ? height : (height * (h - dx)) / (h - t);
}

export function kickerTop(x: number, z: number) {
  const { fromX, toX, z: cz, height, width } = KICKER;
  if (Math.abs(z - cz) > width / 2 || x < Math.min(fromX, toX) || x > Math.max(fromX, toX)) return -Infinity;
  return (height * (fromX - x)) / (fromX - toX);
}

export function quarterTop(x: number, z: number) {
  const { x: qx, radius: R, width, deck } = QUARTER;
  if (Math.abs(z) > width / 2 || x < qx || x > qx + R + deck) return -Infinity;
  if (x >= qx + R) return R;
  return R - Math.sqrt(R * R - (x - qx) * (x - qx));
}

/** Height of what the wheels roll on at (x, z), away from the bowl. */
export function groundHeight(x: number, z: number) {
  return Math.max(0, funboxTop(x, z), kickerTop(x, z), quarterTop(x, z));
}

// ---------- Poses ----------

interface Pose {
  p: THREE.Vector3;
  q: THREE.Quaternion;
}

// Board orientation from where its nose points and which way its deck faces.
// FlatSkateboard's length runs along +X and its deck faces +Y.
function basis(forward: THREE.Vector3, up: THREE.Vector3) {
  const f = forward.clone().addScaledVector(up, -forward.dot(up)).normalize();
  const side = new THREE.Vector3().crossVectors(f, up).normalize();
  const u = new THREE.Vector3().crossVectors(side, f);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, u, side));
}

// Board rolling on the street at (x, z): sits on the heights under its four
// wheels, so it pitches up ramps and over edges like a real board.
function onGround(x: number, z: number, heading: THREE.Vector3): Pose {
  const side = new THREE.Vector3(-heading.z, 0, heading.x);
  const { frontAxle: fa, backAxle: ba, wheelSide: w } = BOARD;
  const h = (a: number, b: number) => groundHeight(x + heading.x * a + side.x * b, z + heading.z * a + side.z * b);
  const hf = (h(fa, w) + h(fa, -w)) / 2;
  const hb = (h(ba, w) + h(ba, -w)) / 2;
  const hr = (h(fa, w) + h(ba, w)) / 2;
  const hl = (h(fa, -w) + h(ba, -w)) / 2;
  const F = heading.clone().multiplyScalar(fa - ba).setY(hf - hb).normalize();
  const S = side.clone().multiplyScalar(2 * w).setY(hr - hl).normalize();
  const up = new THREE.Vector3().crossVectors(S, F).normalize();
  const t = -ba / (fa - ba);
  const p = new THREE.Vector3(x, hb + (hf - hb) * t, z).addScaledVector(up, RIDE);
  return { p, q: basis(F, up) };
}

// Rolling along a smooth line through (x, z) points.
function street(points: [number, number][]): Pose[] {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    "centripetal"
  );
  curve.arcLengthDivisions = 400;
  const n = Math.max(8, Math.ceil(curve.getLength() / STEP));
  const out: Pose[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const c = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    out.push(onGround(c.x, c.z, new THREE.Vector3(tan.x, 0, tan.z).normalize()));
  }
  return out;
}

// A smooth path through 3D keys, each with the direction the deck faces.
// Used for the drop-in and the carve around the bowl.
function keyed(keys: { p: THREE.Vector3; up: THREE.Vector3 }[], skip = 0): Pose[] {
  const curve = new THREE.CatmullRomCurve3(
    keys.map((k) => k.p),
    false,
    "centripetal"
  );
  curve.arcLengthDivisions = keys.length * 40;
  const len = curve.getLength();
  const n = Math.ceil(len / STEP);
  const out: Pose[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const t = curve.getUtoTmapping(u, u * len);
    const f = t * (keys.length - 1);
    if (f < skip) continue;
    const k = Math.min(keys.length - 2, Math.floor(f));
    const up = keys[k].up.clone().lerp(keys[k + 1].up, f - k).normalize();
    out.push({ p: curve.getPointAt(u), q: basis(curve.getTangentAt(u), up) });
  }
  return out;
}

// Ollie pitch: the tail snaps down and the nose comes up fast, then the board
// levels out by the top of the jump.
const popCurve = (s: number) => (s < 0.1 ? smooth(s / 0.1) : 1 - smooth(clamp01((s - 0.1) / 0.4)));

interface AirOptions {
  height: number; // how far the arc rises above the straight line from A to B
  pop?: number; // ollie pop angle in radians (pivoting on the back wheels)
  turn?: [number, number]; // when the board turns from A's orientation to B's
  path?: (s: number) => THREE.Vector3; // custom flight path instead of an arc
}

// From pose A through the air to pose B.
function air(A: Pose, B: Pose, o: AirOptions): Pose[] {
  const n = Math.max(20, Math.ceil((A.p.distanceTo(B.p) + 2 * o.height) / STEP));
  const [r0, r1] = o.turn ?? [0.1, 0.9];
  // With a pop, the board stays down for a moment while the tail snaps.
  const delay = o.pop ? 0.08 : 0;
  const pivot = new THREE.Vector3(BOARD.backAxle, -RIDE, 0);
  const out: Pose[] = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    let p: THREE.Vector3;
    if (o.path) {
      p = o.path(s);
    } else {
      const lift = s <= delay ? 0 : (s - delay) / (1 - delay);
      p = A.p.clone().lerp(B.p, s);
      p.y = lerp(A.p.y, B.p.y, lift) + 4 * o.height * lift * (1 - lift);
    }
    const q = A.q.clone().slerp(B.q, smooth(clamp01((s - r0) / (r1 - r0))));
    if (o.pop) {
      const rot = new THREE.Quaternion().setFromAxisAngle(Z, popCurve(s) * o.pop);
      p.add(pivot.clone().sub(pivot.clone().applyQuaternion(rot)).applyQuaternion(q));
      q.multiply(rot);
    }
    out.push({ p, q });
  }
  return out;
}

// Sample a pose function along s = 0..1, about `length` units long.
function along(length: number, at: (s: number) => Pose): Pose[] {
  const n = Math.max(8, Math.ceil(length / STEP));
  return Array.from({ length: n + 1 }, (_, i) => at(i / n));
}

// On the quarter pipe's curve at angle a (0 = bottom, ~pi/2 = the lip).
function onQuarter(a: number, z: number, velocity: THREE.Vector3): Pose {
  const R = QUARTER.radius;
  const n = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
  const p = new THREE.Vector3(QUARTER.x + R * Math.sin(a), R * (1 - Math.cos(a)), z).addScaledVector(n, RIDE + CURVED);
  return { p, q: basis(velocity, n) };
}

// Below this angle the board is placed from its wheels like on the street.
const Q_LOW = 0.45;
const Q_LOW_X = QUARTER.x + QUARTER.radius * Math.sin(Q_LOW);

function quarterRun(a0: number, a1: number, z0: number, z1: number): Pose[] {
  const R = QUARTER.radius;
  return along(R * Math.abs(a1 - a0) + Math.abs(z1 - z0), (s) => {
    const a = lerp(a0, a1, s);
    const v = new THREE.Vector3(R * Math.cos(a) * (a1 - a0), R * Math.sin(a) * (a1 - a0), z1 - z0);
    return onQuarter(a, lerp(z0, z1, s), v);
  });
}

// Boardslide: the board turned across the rail with the middle of the deck on it.
function boardslide(x: number): Pose {
  return {
    p: new THREE.Vector3(x, RAIL.height + RAIL.radius - BOARD.deck, RAIL.z),
    q: basis(new THREE.Vector3(0, 0, -1), Y),
  };
}

// Crooked grind: the front truck on the ledge's edge, the nose angled in over
// the ledge and pressed down, the tail sticking out over the ground.
const CROOKED = { yaw: 0.31, pitch: 0.17, roll: 0.26 };
function crooked(truckX: number): Pose {
  const nose = new THREE.Vector3(-Math.cos(CROOKED.yaw), 0, -Math.sin(CROOKED.yaw));
  const q = basis(nose, Y)
    .multiply(new THREE.Quaternion().setFromAxisAngle(Z, -CROOKED.pitch))
    .multiply(new THREE.Quaternion().setFromAxisAngle(X, -CROOKED.roll));
  const edge = new THREE.Vector3(truckX, LEDGE.height, LEDGE.z + LEDGE.depth / 2);
  return { p: edge.sub(new THREE.Vector3(BOARD.frontAxle, BOARD.hanger, 0).applyQuaternion(q)), q };
}

// ---------- Route ----------

const segments: { poses: Pose[]; trick?: number }[] = [];
const push = (poses: Pose[], trick?: number) => segments.push({ poses, trick });
const first = (poses: Pose[]) => poses[0];
const last = (poses: Pose[]) => poses[poses.length - 1];
const lastPose = () => last(segments[segments.length - 1].poses);

// Drop in at the bowl's east rim. The board is placed from its wheels along
// the deck, wall and floor profile, so the back wheels are still on the deck
// while the front wheels head down the wall, and it rides up over the coping
// instead of cutting through it.
const DROP_DECK = START.x - (BOWL.x + BOWL.rimRadius); // deck before the coping
const WALL = BOWL.rimRadius - BOWL.flatRadius; // radius of the bowl's wall
const DROP_BOTTOM = DROP_DECK + (WALL * Math.PI) / 2; // where the wall meets the floor
const COPING = 0.08; // coping tube radius
// (distance west of the start, height) at distance `d` along the profile.
function dropProfile(d: number) {
  if (d <= DROP_DECK) return new THREE.Vector2(d, 0);
  if (d >= DROP_BOTTOM) return new THREE.Vector2(START.x - BOWL.x - BOWL.flatRadius + (d - DROP_BOTTOM), -BOWL.depth);
  const a = (d - DROP_DECK) / WALL;
  return new THREE.Vector2(START.x - BOWL.x - (BOWL.flatRadius + WALL * Math.cos(a)), -WALL * Math.sin(a));
}
// Height of the board's underside at x along its length (wheels, trucks, deck,
// kicktails), smoothed so the board doesn't jump as it rolls over the coping.
function underside(x: number) {
  const axle = Math.min(Math.abs(x - BOARD.backAxle), Math.abs(x - BOARD.frontAxle));
  const wheels = 1 - smooth(clamp01((axle - 0.06) / 0.16));
  return lerp(BOARD.deck, -RIDE, wheels) + 0.055 * smooth(clamp01((Math.abs(x) - 0.75) / 0.2));
}
function dropPose(d: number): Pose {
  const b = dropProfile(d + BOARD.backAxle);
  const f = dropProfile(d + BOARD.frontAxle);
  const dir = f.clone().sub(b).normalize();
  const up = new THREE.Vector2(-dir.y, dir.x);
  const c = b.clone().lerp(f, -BOARD.backAxle / (BOARD.frontAxle - BOARD.backAxle)).addScaledVector(up, RIDE);
  // Ride up over the coping where the board passes over it.
  const rel = new THREE.Vector2(DROP_DECK, 0).sub(c);
  const along = rel.dot(dir);
  if (Math.abs(along) < BOARD.length / 2) {
    const lift = rel.dot(up) + COPING - underside(along);
    if (lift > 0) c.addScaledVector(up, lift);
  }
  return {
    p: new THREE.Vector3(START.x - c.x, c.y, START.z),
    q: basis(new THREE.Vector3(-dir.x, dir.y, 0), new THREE.Vector3(-up.x, up.y, 0)),
  };
}
const DROP_END = DROP_BOTTOM + 0.8; // rolling on the floor
push(along(DROP_END, (s) => dropPose(s * DROP_END)));

// Roll across the floor, carve up the west wall and around to the north wall,
// and ride up it heading +X to air out.
{
  const keys: { p: THREE.Vector3; up: THREE.Vector3 }[] = [];
  const addPose = (pose: Pose) => keys.push({ p: pose.p.clone(), up: Y.clone().applyQuaternion(pose.q) });
  const onBowl = (r: number, phi: number) => {
    const n = bowlNormal(r, phi);
    const extra = CURVED * smooth(clamp01((r - BOWL.flatRadius) / 0.4));
    const p = new THREE.Vector3(BOWL.x + r * Math.cos(phi), bowlY(r), BOWL.z + r * Math.sin(phi)).addScaledVector(n, RIDE + extra);
    keys.push({ p, up: n });
  };
  const deg = Math.PI / 180;
  // Lead-in key so the path continues in the drop-in's direction.
  addPose(dropPose(DROP_END - 0.3));
  addPose(dropPose(DROP_END));
  onBowl(0.9, 3 * deg);
  onBowl(1.6, 168 * deg);
  onBowl(3.5, 172 * deg);
  onBowl(4.15, 160 * deg);
  onBowl(4.45, 145 * deg);
  onBowl(4.65, 128 * deg);
  onBowl(4.95, 112 * deg);
  onBowl(5.45, 100 * deg);
  onBowl(BOWL.rimRadius - 0.05, 90 * deg);
  push(keyed(keys, 1));
}

// Trick 1: air out of the bowl over the north coping, landing on the deck.
{
  const toFunbox = street([
    [-13, 7.1],
    [-10.5, 6.7],
    [-8.2, 5.7],
    [-7, 5.5],
    [-5.6, 5.5],
    [-3.75, 5.5],
  ]);
  const A = lastPose();
  const B = first(toFunbox);
  // Keep rising along the wall first, then carry over the coping.
  const path = (s: number) =>
    new THREE.Vector3(
      lerp(A.p.x, B.p.x, s),
      lerp(A.p.y, B.p.y, s) + 4 * 1.6 * s * (1 - s),
      lerp(A.p.z, B.p.z, smooth(clamp01((s - 0.3) / 0.6)))
    );
  push(air(A, B, { height: 1.6, path, turn: [0.15, 0.85] }), 0);
  push(toFunbox);
}

// Trick 2: ollie across the top of the funbox, landing on its far bank.
{
  const down = street([
    [-0.4, 5.5],
    [1.2, 5.5],
    [2, 5.42],
    [2.6, 5.25],
  ]);
  push(air(lastPose(), first(down), { height: 0.9, pop: 0.4 }), 1);
  push(down);
}

// Trick 3: ollie onto the rail into a boardslide, then pop off.
{
  const slideFrom = 4.6;
  const slideTo = 9.1;
  const onRail = air(lastPose(), boardslide(slideFrom), { height: 0.75, pop: 0.4, turn: [0.15, 0.85] });
  const slide = along(slideTo - slideFrom, (s) => boardslide(lerp(slideFrom, slideTo, s)));
  const toQuarter = street([
    [11.4, 4.3],
    [13.8, 3.55],
    [16.2, 2.95],
    [18.95, 2.65],
    [Q_LOW_X, 2.45],
  ]);
  const off = air(last(slide), first(toQuarter), { height: 0.6, turn: [0.15, 0.85] });
  push(onRail, 2);
  push(slide, 2);
  push(off, 2);
  push(toQuarter);
}

// Trick 4: frontside air on the quarter pipe: up the curve, straight up past
// the coping, a 180 turn at the top, and back down toward the ledge.
{
  const TOP = 1.5;
  const up = quarterRun(Q_LOW, TOP, 2.45, 1.35);
  const down = quarterRun(TOP, Q_LOW, -0.05, -1.15);
  const A = last(up);
  const B = first(down);
  const H = 1.3;
  const n = 60;
  const flight: Pose[] = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const p = A.p.clone().lerp(B.p, s);
    p.y += H * Math.sin(Math.PI * s);
    const turn = A.q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(Y, Math.PI * smooth(s)));
    const settle = clamp01((s - 0.8) / 0.2);
    flight.push({ p, q: settle > 0 ? turn.slerp(B.q, settle) : turn });
  }
  push(up, 3);
  push(flight, 3);
  push(down, 3);
}

// Trick 5: ollie up onto the ledge into a crooked grind, then pop off.
{
  const approach = street([
    [Q_LOW_X, -1.15],
    [19, -1.42],
    [17.4, -1.55],
    [15.9, -1.55],
  ]);
  push(approach);
  const grindFrom = 13.3;
  const grindTo = 9.1;
  const onLedge = air(last(approach), crooked(grindFrom), { height: 0.75, pop: 0.4, turn: [0.15, 0.85] });
  const grind = along(grindFrom - grindTo, (s) => crooked(lerp(grindFrom, grindTo, s)));
  const toKicker = street([
    [7.4, -1.5],
    [5.8, -1.5],
    [4.4, -1.5],
  ]);
  const off = air(last(grind), first(toKicker), { height: 0.4, turn: [0.1, 0.8] });
  push(onLedge, 4);
  push(grind, 4);
  push(off, 4);
  push(toKicker);
}

// Trick 6: up the kicker and an air off its lip.
{
  const ramp = street([
    [4.4, -1.5],
    [3.3, -1.5],
    [BOARD.frontAxle + KICKER.toX + 0.06, -1.5],
  ]);
  const rollOut = street([
    [-1.7, -1.45],
    [-3.6, -1.55],
    [-5, -1.6],
    [REST_LEDGE.fromX + BOARD.length / 2 + 0.04, REST_LEDGE.z],
  ]);
  push(ramp, 5);
  push(air(last(ramp), first(rollOut), { height: 0.9, turn: [0.05, 0.75] }), 5);
  push(rollOut);
}

// ---------- Flatten into one table along the route ----------

const poses: Pose[] = [];
const segStart: number[] = [];
for (const seg of segments) {
  const skip = poses.length > 0 && seg.poses[0].p.distanceTo(poses[poses.length - 1].p) < 1e-6 ? 1 : 0;
  segStart.push(poses.length - skip);
  for (let i = skip; i < seg.poses.length; i++) poses.push(seg.poses[i]);
}
const segEnd = segments.map((_, k) => (k + 1 < segments.length ? segStart[k + 1] : poses.length - 1));

// Distance along the route, counting turning on the spot as some distance too
// so an in-place rotation still takes a little scrolling.
const cum = [0];
for (let i = 1; i < poses.length; i++) {
  cum.push(cum[i - 1] + poses[i].p.distanceTo(poses[i - 1].p) + 0.25 * poses[i].q.angleTo(poses[i - 1].q));
}
const TOTAL = cum[cum.length - 1];

// Travel direction on the ground, averaged over a stretch of the route so the
// camera gets a steady heading that doesn't depend on how fast you scroll,
// even mid-trick (the board itself may point sideways).
const headings: THREE.Vector3[] = [];
{
  let lo = 0;
  let hi = 0;
  let prev = new THREE.Vector3(-1, 0, 0);
  for (let i = 0; i < poses.length; i++) {
    while (cum[i] - cum[lo] > 2.5) lo++;
    while (hi < poses.length - 1 && cum[hi] - cum[i] < 2.5) hi++;
    const d = poses[hi].p.clone().sub(poses[lo].p).setY(0);
    if (d.length() > 0.3) prev = d.normalize();
    headings.push(prev.clone());
  }
}

// ---------- Progress mapping ----------

export const RUN_END = 0.86; // ride progress where the board lands off the kicker and rolls out
export const REST_START = 0.93; // ... and where it has rolled to a stop against the ledge
const uRoll = cum[segStart[segStart.length - 1]] / TOTAL;

function progressToU(p: number) {
  if (p <= RUN_END) return (p / RUN_END) * uRoll;
  if (p <= REST_START) {
    const x = (p - RUN_END) / (REST_START - RUN_END);
    return uRoll + (1 - uRoll) * (1 - (1 - x) * (1 - x));
  }
  return 1;
}
const indexToProgress = (i: number) => (cum[i] / TOTAL / uRoll) * RUN_END;

export const TRICKS = Array.from({ length: 6 }, (_, k) => {
  const ids = segments.map((s, i) => (s.trick === k ? i : -1)).filter((i) => i >= 0);
  return { start: indexToProgress(segStart[ids[0]]), end: indexToProgress(segEnd[ids[ids.length - 1]]) };
});

// Where the camera parks beside the quarter pipe and the ledge: it eases in as
// the board heads for the quarter pipe and back out once the ledge is done, so
// it never swings around behind the ramp when the board turns.
function progressWhere(from: number, test: (p: THREE.Vector3) => boolean) {
  for (let i = from; i < poses.length; i++) if (test(poses[i].p)) return indexToProgress(i);
  return 1;
}
const quarterSeg = segments.findIndex((s) => s.trick === 3);
const afterQuarter = segStart[quarterSeg + 3];
export const STATION = {
  position: new THREE.Vector3(11, 3, 2.2),
  in: [progressWhere(segStart[quarterSeg - 1], (p) => p.x >= 14), progressWhere(segStart[quarterSeg - 1], (p) => p.x >= 17.5)],
  out: [progressWhere(afterQuarter, (p) => p.x <= 10), progressWhere(afterQuarter, (p) => p.x <= 6.5)],
};

export interface ParkState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: THREE.Vector3; // travel direction, flattened onto the ground
  closeness: number; // 0 normally, rising to 1 at the middle of a trick
  rest: number; // 0 until the board has stopped against the ledge, then 0 to 1
}

export function parkState(p: number): ParkState {
  const progress = clamp01(p);
  const target = progressToU(progress) * TOTAL;
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid;
    else hi = mid;
  }
  const span = cum[hi] - cum[lo];
  const t = span > 1e-9 ? clamp01((target - cum[lo]) / span) : 0;
  const position = poses[lo].p.clone().lerp(poses[hi].p, t);
  const quaternion = poses[lo].q.clone().slerp(poses[hi].q, t);
  const heading = headings[lo].clone().lerp(headings[hi], t);
  if (heading.lengthSq() < 1e-6) heading.copy(headings[lo]);
  heading.normalize();

  let closeness = 0;
  for (const tr of TRICKS) {
    if (progress >= tr.start && progress <= tr.end) closeness = Math.sin(((progress - tr.start) / (tr.end - tr.start)) * Math.PI);
  }
  const rest = progress <= REST_START ? 0 : (progress - REST_START) / (1 - REST_START);
  return { position, quaternion, heading, closeness, rest };
}

/** Closed-loop check helper: how far the resting spot is from the start. */
export const LOOP_GAP = poses[poses.length - 1].p.clone().setY(0).distanceTo(START);
