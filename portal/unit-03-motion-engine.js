/* Physics with Sir Najam — Grade XI Unit 3 interactive motion maths.
 * Based on NBF Physics XI Unit 3 pp. 33–43 (textbook page numbers).
 * Formative derivations P-11-B-03; summative calculations P-11-B-04, B-05.
 * The projectile model assumes no air resistance and equal launch/landing levels.
 */
(function (root, make) {
  "use strict";
  const lib = make();
  if (typeof module === "object" && module.exports) module.exports = lib;
  if (root) root.PSNTranslatoryMotion = lib;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  const GRAVITY = 9.8;
  const examples = Object.freeze({
    motion: Object.freeze([
      Object.freeze({ id: "textbook-3.1", label: "Textbook example 3.1 · p. 35", u: 10, a: 2, t: 5 }),
      Object.freeze({ id: "textbook-3.2", label: "Textbook example 3.2 · p. 36", u: 4, a: 1, t: 10 }),
      Object.freeze({ id: "deceleration", label: "Additional · slowing down", u: 20, a: -2, t: 5 }),
      Object.freeze({ id: "reversal", label: "Additional · direction reversal", u: 4, a: -2, t: 4 })
    ]),
    projectile: Object.freeze([
      Object.freeze({ id: "range-45", label: "Additional · 45° launch", speed: 20, angle: 45 }),
      Object.freeze({ id: "complement-30", label: "Additional · 30° launch", speed: 20, angle: 30 }),
      Object.freeze({ id: "complement-60", label: "Additional · 60° launch", speed: 20, angle: 60 }),
      Object.freeze({ id: "textbook-3.5", label: "Textbook example 3.5 · p. 43", speed: 200, angle: 30 })
    ])
  });
  function bounded(value, min, max, name) {
    if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(name + " must be a finite number between " + min + " and " + max);
    return value;
  }
  function nearZero(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }
  function format(value, digits = 2) {
    const v = Number(value.toFixed(digits));
    return String(Object.is(v, -0) ? 0 : v);
  }
  function motion(u, a, t) {
    bounded(u, -100, 100, "Initial velocity u");
    bounded(a, -20, 20, "Acceleration a");
    bounded(t, 0, 30, "Time t");
    const v = u + a * t;
    const s = u * t + .5 * a * t * t;
    const turnTime = a !== 0 && -u / a > 0 && -u / a < t ? -u / a : null;
    let distance = Math.abs(s);
    if (turnTime !== null) {
      const sTurn = u * turnTime + .5 * a * turnTime * turnTime;
      distance = Math.abs(sTurn) + Math.abs(s - sTurn);
    }
    return Object.freeze({
      u, a, t, v: nearZero(v), s: nearZero(s),
      velocitySquared: v * v, rhsThirdEquation: u * u + 2 * a * s,
      turnTime, distance,
      graph: "Position and velocity are signed; distance is non-negative."
    });
  }
  function sampleMotion(u, a, duration, steps = 60) {
    bounded(duration, 0.1, 30, "Graph duration");
    if (!Number.isInteger(steps) || steps < 2 || steps > 200) throw new RangeError("Invalid sample count");
    return Array.from({ length: steps + 1 }, (_, i) => {
      const state = motion(u, a, duration * i / steps);
      return { t: state.t, v: state.v, s: state.s };
    });
  }
  function projectile(speed, angle, g = GRAVITY) {
    bounded(speed, 1, 250, "Launch speed");
    bounded(angle, 5, 85, "Launch angle");
    bounded(g, 0.1, 30, "Gravity");
    const rad = angle * Math.PI / 180;
    const ux = speed * Math.cos(rad);
    const uy = speed * Math.sin(rad);
    const flightTime = 2 * uy / g;
    const maxHeight = uy * uy / (2 * g);
    const range = ux * flightTime;
    return Object.freeze({
      speed, angle, g, ux, uy, flightTime, maxHeight, range,
      apexTime: uy / g,
      assumptions: "Neglect air resistance; launch and landing at the same vertical level."
    });
  }
  function projectileAt(params, t) {
    if (!params || !Number.isFinite(params.flightTime)) throw new TypeError("Invalid projectile parameters");
    bounded(t, 0, params.flightTime + 1e-8, "Projectile time");
    const time = Math.min(t, params.flightTime);
    const x = params.ux * time;
    const y = params.uy * time - .5 * params.g * time * time;
    const vy = params.uy - params.g * time;
    return Object.freeze({ t: time, x: nearZero(x), y: nearZero(y), vx: params.ux, vy: nearZero(vy) });
  }
  function sampleProjectile(params, steps = 75) {
    if (!Number.isInteger(steps) || steps < 2 || steps > 200) throw new RangeError("Invalid sample count");
    return Array.from({ length: steps + 1 }, (_, i) => projectileAt(params, params.flightTime * i / steps));
  }
  return Object.freeze({
    GRAVITY, examples, format, motion, sampleMotion, projectile, projectileAt, sampleProjectile
  });
});
