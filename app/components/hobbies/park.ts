import * as THREE from "three";

// Layout and route for the skatepark version of the hobbies run, kept free of
// React so the route can be checked on its own. Loosely inspired by a
// concrete street park: a sunken bowl, a funbox, a flat rail, a quarter pipe,
// a grind ledge, a kicker, and a ledge by the start to finish on.
//
// The route is one loop. It drops into the bowl, carves around it, then hits
// one trick per hobby around the park and ends resting on the ledge next to
// where it started.

// ---------- Layout (world units; the ground is y = 0) ----------
export const SLAB = { minX: -26, maxX: 26, minZ: -13, maxZ: 13, thickness: 3.6 };
export const BOWL = { x: -16, z: 0, flatRadius: 3, depth: 3, rimRadius: 6 };
export const FUNBOX = { x: -3, z: 7.5, halfLength: 4, topHalfLength: 1.5, height: 0.8, width: 3 };
export const RAIL = { fromX: 4, toX: 11, z: 7.5, height: 0.9 };
export const QUARTER = { x: 18, radius: 3.5, width: 12, deck: 3 }; // base at x, curving up toward +X
export const LEDGE = { fromX: 6, toX: 13, z: -8.4, height: 0.6, depth: 1.2 }; // grinded along its +Z edge
export const KICKER = { fromX: 3, toX: 0.5, z: -7.5, height: 0.9, width: 2.5 }; // rises toward -X
export const REST_LEDGE = { fromX: -6.5, toX: -10.5, z: -3.6, height: 0.6, width: 1.2 }; // runs along X
export const START = new THREE.Vector3(-8.5, 0, 0);

const RIDE_HEIGHT = 0.14; // board center above whatever it's rolling on
const UP = new THREE.Vector3(0, 1, 0);

// Height of the bowl's surface at distance r from its center.
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
  if (r <= f || r >= rim) return UP.clone();
  const th = Math.asin((r - f) / (rim - f));
  const radial = new THREE.Vector3(Math.cos(phi), 0, Math.sin(phi));
  return radial.multiplyScalar(-Math.sin(th)).add(new THREE.Vector3(0, Math.cos(th), 0)).normalize();
}

// ---------- Route ----------
interface Key {
  p: THREE.Vector3;
  up: THREE.Vector3;
}
const keys: Key[] = [];
const add = (x: number, y: number, z: number, up: THREE.Vector3 = UP) =>
  keys.push({ p: new THREE.Vector3(x, y, z), up: up.clone().normalize() });
const onGround = (x: number, z: number) => add(x, RIDE_HEIGHT, z);

// Trick windows, as key index ranges; filled in as the route is built.
const trickKeys: [number, number][] = [];
const mark = () => keys.length;

// 1. Drop in: from the deck at the bowl's east rim, down the wall, and carve
//    clockwise around the bowl for most of a lap.
onGround(START.x, START.z);
onGround(-9.6, 0);
// On the coping, nose just starting to tip down into the bowl (toward -X).
add(BOWL.x + BOWL.rimRadius + 0.05, RIDE_HEIGHT, BOWL.z, new THREE.Vector3(-0.25, 1, 0));
const onBowl = (r: number, phi: number) => {
  const n = bowlNormal(r, phi);
  const p = new THREE.Vector3(BOWL.x + r * Math.cos(phi), bowlY(r), BOWL.z + r * Math.sin(phi)).addScaledVector(n, RIDE_HEIGHT);
  add(p.x, p.y, p.z, n);
};
// Down the wall, starting to curve clockwise as it reaches the bottom.
onBowl(5.75, 0);
onBowl(5.35, -0.06);
onBowl(4.8, -0.16);
onBowl(4.35, -0.3);
// Carve clockwise around the bowl, rising on the wall and back to the rim.
const LAP = (300 * Math.PI) / 180;
const CARVE_FROM = 0.48;
const steps = 28;
for (let i = 0; i <= steps; i++) {
  const f = i / steps;
  const phi = -THREE.MathUtils.lerp(CARVE_FROM, LAP, f); // clockwise from +X
  const r = f < 0.8 ? 4.2 + 0.9 * Math.sin((f / 0.8) * Math.PI) : THREE.MathUtils.lerp(4.2, BOWL.rimRadius - 0.05, (f - 0.8) / 0.2);
  onBowl(r, phi);
}

// Trick 1: air out of the bowl at its north-east rim, landing on the deck.
let s = mark() - 1;
const exitPhi = -LAP; // same direction as +60 degrees
const out = new THREE.Vector3(Math.cos(exitPhi), 0, Math.sin(exitPhi));
const rim = new THREE.Vector3(BOWL.x, 0, BOWL.z).addScaledVector(out, BOWL.rimRadius);
add(rim.x + out.x * 0.4 + 0.6, 1.0, rim.z + out.z * 0.4 - 0.2, new THREE.Vector3(-out.x, 0.6, -out.z));
add(rim.x + out.x * 1.3 + 1.4, 1.7, rim.z + out.z * 1.3 - 0.1);
add(rim.x + out.x * 2.1 + 2.3, 0.9, 7.1);
onGround(-8.3, 7.4);
trickKeys.push([s, mark() - 1]);

// Trick 2: ollie over the funbox.
onGround(-7.1, 7.5);
s = mark();
add(FUNBOX.x - FUNBOX.halfLength + 0.8, 0.4, FUNBOX.z);
add(FUNBOX.x - 1.2, 1.9, FUNBOX.z);
add(FUNBOX.x + 0.6, 2.1, FUNBOX.z);
add(FUNBOX.x + FUNBOX.halfLength - 1.2, 0.6, FUNBOX.z);
trickKeys.push([s, mark()]);
onGround(FUNBOX.x + FUNBOX.halfLength + 0.6, FUNBOX.z);

// Trick 3: 50-50 grind down the flat rail.
onGround(RAIL.fromX - 1.4, RAIL.z);
s = mark();
add(RAIL.fromX - 0.3, RAIL.height + 0.6, RAIL.z);
add(RAIL.fromX + 0.6, RAIL.height + RIDE_HEIGHT, RAIL.z);
add((RAIL.fromX + RAIL.toX) / 2, RAIL.height + RIDE_HEIGHT, RAIL.z);
add(RAIL.toX - 0.4, RAIL.height + RIDE_HEIGHT, RAIL.z);
add(RAIL.toX + 0.7, RAIL.height + 0.5, RAIL.z);
trickKeys.push([s, mark()]);
onGround(RAIL.toX + 1.8, RAIL.z - 0.2);

// Turn toward the quarter pipe.
onGround(14.5, 5.8);
onGround(16.2, 3.4);

// Trick 4: quarter-pipe air, turning 180 at the top and coming back down.
const qp = (a: number, z: number) => {
  const n = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
  const p = new THREE.Vector3(QUARTER.x + QUARTER.radius * Math.sin(a), QUARTER.radius * (1 - Math.cos(a)), z).addScaledVector(
    n,
    RIDE_HEIGHT
  );
  add(p.x, p.y, p.z, n);
};
onGround(QUARTER.x - 0.6, 2.6);
s = mark();
qp(0.5, 2.4);
qp(1.0, 2.1);
qp(1.38, 1.7);
add(QUARTER.x + QUARTER.radius - 0.05, QUARTER.radius + 1.0, 1.0, new THREE.Vector3(-1, 0, 0));
add(QUARTER.x + QUARTER.radius - 0.15, QUARTER.radius + 1.6, 0, new THREE.Vector3(-1, 0, 0));
add(QUARTER.x + QUARTER.radius - 0.05, QUARTER.radius + 1.0, -1.0, new THREE.Vector3(-1, 0, 0));
qp(1.38, -1.7);
qp(1.0, -2.1);
qp(0.5, -2.4);
trickKeys.push([s, mark() - 1]);
onGround(QUARTER.x - 0.8, -2.6);

// Turn toward the ledge.
onGround(15.8, -5.0);
onGround(13.8, -7.0);

// Trick 5: grind along the ledge's edge.
const edgeZ = LEDGE.z + LEDGE.depth / 2 - 0.1;
s = mark();
add(LEDGE.toX + 0.4, LEDGE.height + 0.5, edgeZ + 0.2);
add(LEDGE.toX - 0.6, LEDGE.height + RIDE_HEIGHT, edgeZ);
add((LEDGE.fromX + LEDGE.toX) / 2, LEDGE.height + RIDE_HEIGHT, edgeZ);
add(LEDGE.fromX + 0.5, LEDGE.height + RIDE_HEIGHT, edgeZ);
add(LEDGE.fromX - 0.6, LEDGE.height + 0.4, edgeZ + 0.3);
trickKeys.push([s, mark()]);
onGround(LEDGE.fromX - 1.6, KICKER.z);

// Trick 6: up the kicker and a big ollie off it.
s = mark();
add(KICKER.fromX - 0.6, 0.3, KICKER.z);
add(KICKER.toX + 0.3, KICKER.height + 0.1, KICKER.z);
add(KICKER.toX - 1.6, 2.3, KICKER.z);
add(KICKER.toX - 3.2, 1.0, KICKER.z + 0.3);
trickKeys.push([s, mark()]);
onGround(KICKER.toX - 4.4, KICKER.z + 0.4);

// Back toward the start: carve over to the resting ledge, pop onto it, and
// slide to a stop beside the drop-in.
onGround(KICKER.toX - 5.6, -5.6);
const POP = mark();
add(REST_LEDGE.fromX + 0.1, REST_LEDGE.height + 0.45, REST_LEDGE.z - 0.2);
add(REST_LEDGE.fromX - 0.7, REST_LEDGE.height + RIDE_HEIGHT, REST_LEDGE.z);
add(REST_LEDGE.fromX - 1.8, REST_LEDGE.height + RIDE_HEIGHT, REST_LEDGE.z);
add(REST_LEDGE.fromX - 2.6, REST_LEDGE.height + RIDE_HEIGHT, REST_LEDGE.z);

const curve = new THREE.CatmullRomCurve3(
  keys.map((k) => k.p),
  false,
  "centripetal"
);
const DIV = 40; // arc-length samples per key interval
// Use one sampling resolution everywhere so three.js caches the length table
// instead of rebuilding it on every call.
curve.arcLengthDivisions = (keys.length - 1) * DIV;
const lengths = curve.getLengths();
const total = lengths[lengths.length - 1];
const keyU = (i: number) => lengths[i * DIV] / total;

// Ride progress mapping: the run up to the pop onto the resting ledge, a
// short slide that eases to a stop, then the board stays put while the camera
// pans up.
const RUN_END = 0.86; // ride progress where the board pops onto the ledge
const SLIDE_END = 0.92; // ... and where it has stopped
const popU = keyU(POP);

function progressToU(p: number) {
  if (p <= RUN_END) return (p / RUN_END) * popU;
  if (p <= SLIDE_END) {
    const x = (p - RUN_END) / (SLIDE_END - RUN_END);
    return popU + (1 - popU) * (1 - (1 - x) * (1 - x));
  }
  return 1;
}
const uToProgress = (u: number) => (u / popU) * RUN_END;

export const TRICKS = trickKeys.map(([a, b]) => ({ start: uToProgress(keyU(a)), end: uToProgress(keyU(b)) }));
export const REST_START = SLIDE_END;

export interface ParkState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: THREE.Vector3; // travel direction, flattened onto the ground
  closeness: number; // 0 normally, rising to 1 at the middle of a trick
  rest: number; // 0 until the board has stopped on the ledge, then 0 to 1
}

function upAt(u: number) {
  const t = curve.getUtoTmapping(u, u * total);
  const f = t * (keys.length - 1);
  const i = Math.min(keys.length - 2, Math.floor(f));
  return keys[i].up.clone().lerp(keys[i + 1].up, f - i).normalize();
}

export function parkState(p: number): ParkState {
  const progress = THREE.MathUtils.clamp(p, 0, 1);
  const u = Math.min(1, progressToU(progress));
  const position = curve.getPointAt(u);
  const forward = curve.getTangentAt(Math.min(u, 0.9999)).normalize();
  const up = upAt(u);
  const f = forward.clone().addScaledVector(up, -forward.dot(up));
  if (f.lengthSq() < 1e-10) f.copy(forward);
  f.normalize();
  const side = new THREE.Vector3().crossVectors(f, up);
  // FlatSkateboard's length runs along +X and its deck faces +Y.
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, side.clone().cross(f), side));

  const heading = new THREE.Vector3(forward.x, 0, forward.z);
  if (heading.lengthSq() < 1e-6) heading.set(-1, 0, 0);
  heading.normalize();

  let closeness = 0;
  for (const t of TRICKS) {
    if (progress >= t.start && progress <= t.end) closeness = Math.sin(((progress - t.start) / (t.end - t.start)) * Math.PI);
  }
  const rest = progress <= REST_START ? 0 : (progress - REST_START) / (1 - REST_START);
  return { position, quaternion, heading, closeness, rest };
}

/** Closed-loop check helper: how far the resting spot is from the start. */
export const LOOP_GAP = keys[keys.length - 1].p.distanceTo(START);
