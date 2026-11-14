/* Grade XI Unit 3 — projectable, accessible no-network motion simulations.
 * DOM content is created as text/SVG nodes; no student data is persisted.
 */
(function () {
  "use strict";
  const physics = window.PSNTranslatoryMotion;
  const $ = id => document.getElementById(id);
  if (!physics) return;
  const NS = "http://www.w3.org/2000/svg";
  const colors = { curve: "#117b94", grid: "#e4edf5", axis: "#647b94", marker: "#c07b2b", ink: "#223d5a" };
  let playing = false;
  let frameId = 0;
  let lastFrame = null;
  let projectileParams = null;

  function svgNode(type, attributes = {}, value) {
    const element = document.createElementNS(NS, type);
    for (const [name, entry] of Object.entries(attributes)) element.setAttribute(name, String(entry));
    if (value !== undefined) element.textContent = String(value);
    return element;
  }
  function line(svg, x1, y1, x2, y2, color, width = 1, dash) {
    const attrs = { x1, y1, x2, y2, stroke: color, "stroke-width": width };
    if (dash) attrs["stroke-dasharray"] = dash;
    svg.appendChild(svgNode("line", attrs));
  }
  function label(svg, x, y, string, anchor = "start", size = 12, color = colors.ink) {
    svg.appendChild(svgNode("text", {
      x, y, "text-anchor": anchor, "font-size": size,
      fill: color, "font-weight": "650"
    }, string));
  }
  function fmt(x, digits = 2) { return physics.format(x, digits); }
  function shownUnits(value, unit, digits = 2) { return fmt(value, digits) + " " + unit; }
  function initialDate() { return performance.now(); }
  function range(values) {
    const mn = Math.min(0, ...values), mx = Math.max(0, ...values);
    const pad = Math.max((mx - mn) * .10, 1);
    return [mn - pad, mx + pad];
  }
  function plotSeries(svg, points, field, selectedTime, labelText, unit) {
    svg.replaceChildren();
    const W = 370, H = 240, left = 47, right = 16, top = 29, bottom = 37;
    const duration = points[points.length - 1].t;
    const xPos = t => left + (W - left - right) * t / duration;
    const [yMin, yMax] = range(points.map(p => p[field]));
    const yPos = value => top + (H - top - bottom) * (yMax - value) / (yMax - yMin);
    const description = labelText + " versus time, constant-acceleration trajectory, selected time " + fmt(selectedTime) + " seconds.";
    svg.setAttribute("aria-label", description);
    svg.appendChild(svgNode("title", {}, description));
    for (let i = 0; i <= 4; i++) {
      const y = top + (H - top - bottom) * i / 4;
      line(svg, left, y, W - right, y, colors.grid);
      label(svg, left - 7, y + 4, fmt(yMax - (yMax - yMin) * i / 4, 1), "end", 10);
    }
    for (let i = 0; i <= 5; i++) {
      const x = left + (W - left - right) * i / 5;
      line(svg, x, top, x, H - bottom, colors.grid);
      label(svg, x, H - bottom + 18, fmt(duration * i / 5, 1), "middle", 10);
    }
    line(svg, left, yPos(0), W - right, yPos(0), colors.axis, 1.7);
    line(svg, left, top, left, H - bottom, colors.axis, 1.7);
    const shape = points.map(p => fmt(xPos(p.t), 3) + "," + fmt(yPos(p[field]), 3)).join(" ");
    svg.appendChild(svgNode("polyline", { points: shape, fill: "none", stroke: colors.curve, "stroke-width": 3 }));
    const now = physics.motion(Number($("uRange").value), Number($("aRange").value), selectedTime);
    const px = xPos(selectedTime), py = yPos(now[field]);
    line(svg, px, top, px, H - bottom, colors.marker, 1.3, "4 4");
    svg.appendChild(svgNode("circle", { cx: px, cy: py, r: 5, fill: colors.marker, stroke: "#fff", "stroke-width": 2 }));
    label(svg, left + 7, 17, labelText + " (" + unit + ")", "start", 12);
    label(svg, W - right, H - 5, "time (s)", "end", 12);
  }
  function motionUpdate(resetTime) {
    const u = Number($("uRange").value), a = Number($("aRange").value), duration = Number($("tRange").value);
    $("uLabel").textContent = shownUnits(u, "m/s", 0);
    $("aLabel").textContent = shownUnits(a, "m/s²", 0);
    $("tLabel").textContent = shownUnits(duration, "s", 0);
    const slider = $("motionTime");
    slider.max = String(duration);
    if (resetTime) slider.value = String(duration);
    if (Number(slider.value) > duration) slider.value = String(duration);
    const t = Number(slider.value);
    const state = physics.motion(u, a, t);
    $("motionTimeLabel").textContent = shownUnits(t, "s");
    $("motionV").textContent = shownUnits(state.v, "m/s");
    $("motionS").textContent = shownUnits(state.s, "m");
    $("motionD").textContent = shownUnits(state.distance, "m");
    $("motionA").textContent = shownUnits(state.a, "m/s²");
    $("motionInsight").textContent = state.turnTime !== null ?
      "Direction reversal at t = " + fmt(state.turnTime) + " s. Distance (" + fmt(state.distance) +
      " m) is greater than |displacement| (" + fmt(Math.abs(state.s)) + " m)." :
      "At t = " + fmt(t) + " s: v = u + at = " + fmt(u) + " + (" + fmt(a) + ")(" + fmt(t) +
      ") = " + fmt(state.v) + " m/s. The velocity–time area is signed displacement.";
    const pts = physics.sampleMotion(u, a, duration);
    plotSeries($("velocityGraph"), pts, "v", t, "Velocity", "m/s");
    plotSeries($("positionGraph"), pts, "s", t, "Displacement", "m");
  }
  function stopPlay() {
    playing = false;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = null;
    $("projectilePlay").textContent = "Play trajectory";
  }
  function setProjectileTime(time) {
    $("projectileTime").value = String(time);
    drawProjectile();
  }
  function projectileUpdate(resetTime) {
    stopPlay();
    const speed = Number($("speedRange").value), angle = Number($("angleRange").value);
    projectileParams = physics.projectile(speed, angle);
    $("speedLabel").textContent = shownUnits(speed, "m/s", 0);
    $("angleLabel").textContent = String(angle) + "°";
    const slider = $("projectileTime");
    slider.max = String(projectileParams.flightTime);
    if (resetTime) slider.value = "0";
    if (Number(slider.value) > projectileParams.flightTime) slider.value = String(projectileParams.flightTime);
    $("projectileT").textContent = shownUnits(projectileParams.flightTime, "s");
    $("projectileH").textContent = shownUnits(projectileParams.maxHeight, "m");
    $("projectileR").textContent = shownUnits(projectileParams.range, "m");
    drawProjectile();
  }
  function drawProjectile() {
    if (!projectileParams) return;
    const slider = $("projectileTime"), time = Number(slider.value);
    const state = physics.projectileAt(projectileParams, time);
    $("projectileTimeLabel").textContent = shownUnits(time, "s");
    $("projectileXY").textContent = "(" + fmt(state.x) + ", " + fmt(state.y) + ") m";
    $("projectileVX").textContent = shownUnits(state.vx, "m/s");
    $("projectileVY").textContent = shownUnits(state.vy, "m/s");
    const p = projectileParams, plot = $("projectilePlot");
    const W = 520, H = 345, left = 55, right = 18, top = 30, bottom = 46;
    const innerW = W - left - right, innerH = H - top - bottom;
    const xPos = x => left + innerW * x / Math.max(p.range, 1e-9);
    const yPos = y => H - bottom - innerH * y / Math.max(p.maxHeight, 1e-9);
    plot.replaceChildren();
    const description = "Ideal projectile path, no air drag, equal start and end levels. Speed " +
      fmt(p.speed) + " metres per second at " + fmt(p.angle) + " degrees. Selected time " + fmt(time) + " seconds.";
    plot.setAttribute("aria-label", description);
    plot.appendChild(svgNode("title", {}, description));
    for (let i = 0; i <= 4; i++) {
      const x = left + innerW * i / 4, y = top + innerH * i / 4;
      line(plot, x, top, x, H - bottom, colors.grid);
      line(plot, left, y, W - right, y, colors.grid);
      label(plot, x, H - bottom + 19, fmt(p.range * i / 4, 1), "middle", 11);
      label(plot, left - 6, H - bottom - innerH * i / 4 + 4,
        fmt(p.maxHeight * i / 4, 1), "end", 11);
    }
    line(plot, left, top, left, H - bottom, colors.axis, 2);
    line(plot, left, H - bottom, W - right, H - bottom, colors.axis, 2);
    label(plot, W - right, H - 8, "x (m)", "end", 13);
    label(plot, left, 19, "y (m)", "start", 13);
    const pts = physics.sampleProjectile(p);
    plot.appendChild(svgNode("polyline", {
      points: pts.map(pt => fmt(xPos(pt.x), 3) + "," + fmt(yPos(pt.y), 3)).join(" "),
      fill: "none", stroke: colors.curve, "stroke-width": 3.7
    }));
    const active = pts.filter(pt => pt.t <= state.t + 1e-9);
    if (active.length > 1) plot.appendChild(svgNode("polyline", {
      points: active.map(pt => fmt(xPos(pt.x), 3) + "," + fmt(yPos(pt.y), 3)).join(" "),
      fill: "none", stroke: colors.marker, "stroke-width": 4
    }));
    const ballX = xPos(state.x), ballY = yPos(state.y);
    line(plot, ballX, ballY, ballX, H - bottom, colors.marker, 1.5, "5 5");
    plot.appendChild(svgNode("circle", { cx: ballX, cy: ballY, r: 7,
      fill: colors.marker, stroke: "#fff", "stroke-width": 2.5 }));
    const peakY = yPos(p.maxHeight);
    line(plot, xPos(p.range / 2), peakY, xPos(p.range / 2), H - bottom, "#a6a8bc", 1.2, "4 5");
    label(plot, xPos(p.range / 2), Math.max(24, peakY - 9), "H = " + fmt(p.maxHeight) + " m", "middle", 11);
    const pointDescription = state.vy > 0.05 ? "Ascending" : state.vy < -0.05 ? "Descending" : "Near highest point";
    $("projectileInsight").textContent = pointDescription + ": vₓ stays " + fmt(state.vx) +
      " m/s, while vᵧ = " + fmt(state.vy) + " m/s. Complementary angles (θ and 90°−θ) have equal ranges at the same u and g.";
  }
  function playFrame(now) {
    if (!playing || !projectileParams) return;
    if (lastFrame === null) lastFrame = now;
    const delta = Math.min((now - lastFrame) / 1000, .15);
    lastFrame = now;
    const total = projectileParams.flightTime, selected = Number($("projectileTime").value);
    const target = Math.min(total, selected + delta * total / 5);
    setProjectileTime(target);
    if (target >= total - 1e-7) stopPlay();
    else frameId = window.requestAnimationFrame(playFrame);
  }
  for (const id of ["uRange", "aRange", "tRange"]) {
    $(id).addEventListener("input", () => motionUpdate(id === "tRange"));
  }
  $("motionTime").addEventListener("input", () => motionUpdate(false));
  document.querySelectorAll("[data-motion]").forEach(button => button.addEventListener("click", () => {
    const example = physics.examples.motion.find(e => e.id === button.dataset.motion);
    if (!example) return;
    $("uRange").value = String(example.u);
    $("aRange").value = String(example.a);
    $("tRange").value = String(example.t);
    motionUpdate(true);
  }));
  for (const id of ["speedRange", "angleRange"]) $(id).addEventListener("input", () => projectileUpdate(true));
  $("projectileTime").addEventListener("input", () => { stopPlay(); drawProjectile(); });
  $("projectileReset").addEventListener("click", () => { stopPlay(); setProjectileTime(0); });
  $("projectilePlay").addEventListener("click", () => {
    if (playing) { stopPlay(); return; }
    if (Number($("projectileTime").value) >= projectileParams.flightTime - .01) setProjectileTime(0);
    playing = true;
    lastFrame = null;
    $("projectilePlay").textContent = "Pause trajectory";
    frameId = window.requestAnimationFrame(playFrame);
  });
  document.querySelectorAll("[data-projectile]").forEach(button => button.addEventListener("click", () => {
    const example = physics.examples.projectile.find(e => e.id === button.dataset.projectile);
    if (!example) return;
    $("speedRange").value = String(example.speed);
    $("angleRange").value = String(example.angle);
    projectileUpdate(true);
  }));
  motionUpdate(true);
  projectileUpdate(true);
})();
