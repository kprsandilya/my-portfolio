import * as THREE from "three";

// Motion for the half-pipe run, kept free of React so it can be checked on its
// own. The run is one segment per hobby. In each segment the board climbs one
// wall, launches off the lip into an air (180° spin plus a kickflip), lands
// back in, and drops down toward the opposite wall for the next segment.

export const PIPE_RADIUS = 4;
export const PIPE_LENGTH = 30;
export const DECK_WIDTH = 3;
const RIDE_HEIGHT = 0.14; // board center above the surface, so the wheels sit on it
const CLIMB = 0.32; // share of a segment spent climbing (and the same descending)
const AIR_HEIGHT = 2.4; // how high above the coping the board flies
const X_START = PIPE_LENGTH / 2 - 3;
const X_END = -PIPE_LENGTH / 2 + 3;

export interface RideState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  airborne: boolean;
  segment: number; // which hobby's air this segment ends in
  side: 1 | -1; // which wall: +Z or -Z
  // 0 at the bottom of the pipe, rising up the wall, 1 at the top of an air.
  // The camera uses it to move in close as the board reaches the apex.
  closeness: number;
}

// Closeness while on the wall: grows with height, reaching 0.55 at the lip.
const wallCloseness = (y: number) => 0.55 * Math.pow(THREE.MathUtils.clamp(y / PIPE_RADIUS, 0, 1), 1.5);

// Climb profile: fast at the bottom, still moving at the lip (so the nose is
// pointing up when the board takes off). f(0)=0, f(1)=1, f'(1)>0.
const climb = (v: number) => 1.6 * v - 0.6 * v * v;
const climbRate = (v: number) => 1.6 - 1.2 * v;

/** Scroll progress at which segment k's air starts. */
export function airStart(k: number, segments: number) {
  return (k + CLIMB) / segments;
}

function segmentOf(t: number, segments: number) {
  const f = THREE.MathUtils.clamp(t, 0, 1) * segments;
  const k = Math.min(segments - 1, Math.floor(f));
  return { k, u: f - k, side: (k % 2 === 0 ? 1 : -1) as 1 | -1 };
}

// Board orientation from its travel direction and the surface normal.
// FlatSkateboard's length runs along +X and its deck faces +Y.
function orient(forward: THREE.Vector3, up: THREE.Vector3) {
  const f = forward.clone().addScaledVector(up, -forward.dot(up));
  if (f.lengthSq() < 1e-12) f.set(-1, 0, 0);
  f.normalize();
  const side = new THREE.Vector3().crossVectors(f, up);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, up, side));
}

// Point on the wall at angle a (0 = bottom, ±π/2 = the lip on the ±Z wall),
// with the board's velocity given the angle's rate of change.
function onSurface(x: number, dx: number, a: number, da: number) {
  const normal = new THREE.Vector3(0, Math.cos(a), -Math.sin(a)); // toward the pipe's center line
  const position = new THREE.Vector3(x, PIPE_RADIUS - PIPE_RADIUS * Math.cos(a), PIPE_RADIUS * Math.sin(a)).addScaledVector(
    normal,
    RIDE_HEIGHT
  );
  const velocity = new THREE.Vector3(dx, PIPE_RADIUS * Math.sin(a) * da, PIPE_RADIUS * Math.cos(a) * da);
  return { position, quaternion: orient(velocity, normal) };
}

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const smooth = (v: number) => v * v * (3 - 2 * v);

export function rideState(t: number, segments: number): RideState {
  const { k, u, side } = segmentOf(t, segments);
  const x = THREE.MathUtils.lerp(X_START, X_END, THREE.MathUtils.clamp(t, 0, 1));
  const dx = (X_END - X_START) / segments; // per unit of u
  const lip = (Math.PI / 2) * side;

  if (u < CLIMB) {
    const v = u / CLIMB;
    const s = onSurface(x, dx, lip * climb(v), (lip * climbRate(v)) / CLIMB);
    return { ...s, airborne: false, segment: k, side, closeness: wallCloseness(s.position.y) };
  }
  if (u > 1 - CLIMB) {
    const w = (u - (1 - CLIMB)) / CLIMB;
    const s = onSurface(x, dx, lip * climb(1 - w), (-lip * climbRate(1 - w)) / CLIMB);
    return { ...s, airborne: false, segment: k, side, closeness: wallCloseness(s.position.y) };
  }

  // In the air: rise straight up off the lip and come back down onto it.
  const air = (u - CLIMB) / (1 - 2 * CLIMB);
  const takeoff = onSurface(x, dx, lip, (lip * climbRate(1)) / CLIMB);
  const landing = onSurface(x, dx, lip, (-lip * climbRate(1)) / CLIMB);
  const position = takeoff.position.clone();
  position.y += AIR_HEIGHT * Math.sin(Math.PI * air);

  // 180° turn around the deck's normal plus a kickflip around the board's
  // length, easing into the landing orientation at the end.
  const e = smooth(air);
  const trick = takeoff.quaternion
    .clone()
    .multiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, Math.PI * e))
    .multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, 2 * Math.PI * e));
  const settle = THREE.MathUtils.clamp((air - 0.8) / 0.2, 0, 1);
  const quaternion = settle > 0 ? trick.slerp(landing.quaternion, settle) : trick;

  // Continues from the lip's 0.55 up to 1 at the top of the air.
  const closeness = wallCloseness(takeoff.position.y) + (1 - wallCloseness(takeoff.position.y)) * Math.sin(Math.PI * air);
  return { position, quaternion, airborne: true, segment: k, side, closeness };
}
