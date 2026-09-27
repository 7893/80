import { createScene } from "./canvas-scene.js";
export function startCanvasFallback() {
  "use strict";
  const canvas = document.getElementById("universe"),
    ctx = canvas.getContext("2d");
  let scene;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pauseButton = document.getElementById("pause");
  let width = 0,
    height = 0,
    dpr = 1,
    time = 0,
    last = 0,
    raf = 0,
    paused = reduced.matches,
    view = 0;
  let stars = [],
    dust = [],
    orbit = { x: 0, y: 0, size: 0, angle: 0 },
    meteor = null,
    nextMeteor = 5,
    echoes = [],
    occlusion = { x: 0, y: 0, radius: 0 },
    pointer = { x: 0, y: 0 },
    drift = { x: 0, y: 0 };
  const names = ["The quiet orbit", "The distant ember", "The blue silence"];

  function build() {
    meteor = null;
    ({ scene, stars, dust, orbit, occlusion } = createScene(
      width,
      height,
      dpr,
      view,
    ));
  }
  function drawDust() {
    ctx.save();
    ctx.translate(orbit.x, orbit.y);
    ctx.rotate(orbit.angle);
    for (const grain of dust) {
      const angle = grain.angle + time * grain.speed;
      const x = Math.cos(angle) * grain.radius;
      const y = Math.sin(angle) * grain.radius * 0.28;
      if (y < 0 && Math.hypot(x, y) < orbit.size * 0.31) continue;
      const color = view === 1 ? "255,216,166" : "198,222,255";
      ctx.strokeStyle = `rgba(${color},${grain.brightness * 0.35})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        grain.radius,
        grain.radius * 0.28,
        0,
        angle - 0.035,
        angle,
      );
      ctx.stroke();
      ctx.fillStyle = `rgba(${color},${grain.brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, grain.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawMeteor() {
    if (!meteor) return;
    const age = time - meteor.born,
      progress = age / 1.8;
    if (progress < 0 || progress > 1) return;
    const x = meteor.x + progress * meteor.dx;
    const y = meteor.y + progress * meteor.dy;
    const fade = Math.sin(progress * Math.PI);
    const tailX = x - meteor.dx * 0.24;
    const tailY = y - meteor.dy * 0.24;
    const trail = ctx.createLinearGradient(tailX, tailY, x, y);
    trail.addColorStop(0, "rgba(170,196,255,0)");
    trail.addColorStop(1, `rgba(225,232,255,${fade * 0.85})`);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(occlusion.x, occlusion.y, orbit.size * 0.3, 0, Math.PI * 2);
    ctx.clip("evenodd");
    ctx.strokeStyle = trail;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = `rgba(244,246,255,${fade})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function draw() {
    ctx.fillStyle = "#050710";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(drift.x - 5, drift.y - 5);
    ctx.scale((width + 10) / width, (height + 10) / height);
    ctx.drawImage(scene, 0, 0, width, height);
    for (let i = 0; i < stars.length; i += 3) {
      const s = stars[i];
      if (Math.hypot(s.x - occlusion.x, s.y - occlusion.y) < occlusion.radius)
        continue;
      const pulse = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
      const a = 0.08 + Math.pow(pulse, 2) * 0.88;
      const radius = s.r + pulse * 0.65;
      ctx.fillStyle = `rgba(224,233,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1) {
        ctx.fillStyle = `rgba(156,185,255,${a * 0.12})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(210,224,255,${a * 0.45})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - radius * 3, s.y);
        ctx.lineTo(s.x + radius * 3, s.y);
        ctx.moveTo(s.x, s.y - radius * 3);
        ctx.lineTo(s.x, s.y + radius * 3);
        ctx.stroke();
      }
    }
    drawDust();
    drawMeteor();
    ctx.restore();
    for (const e of echoes) {
      const age = time - e.born;
      ctx.strokeStyle = `rgba(208,221,255,${Math.max(0, 0.42 - age * 0.18)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 8 + age * 32, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  function tick(now) {
    raf = 0;
    if (paused || document.hidden) return;
    time += last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (time >= nextMeteor) {
      meteor = {
        born: time,
        x: width * (0.48 + Math.random() * 0.4),
        y: height * (0.08 + Math.random() * 0.16),
        dx: -Math.min(width * 0.36, 400),
        dy: height * 0.2,
      };
      nextMeteor = time + 16 + Math.random() * 14;
    }
    if (meteor && time - meteor.born > 1.8) meteor = null;
    drift.x += (pointer.x - drift.x) * 0.025;
    drift.y += (pointer.y - drift.y) * 0.025;
    echoes = echoes.filter((e) => time - e.born < 2.4);
    draw();
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(raf);
    last = 0;
    pauseButton.textContent = paused ? "Resume motion" : "Pause motion";
    pauseButton.setAttribute("aria-pressed", String(paused));
    draw();
    if (!paused && !document.hidden) raf = requestAnimationFrame(tick);
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    draw();
  }
  canvas.addEventListener("pointermove", (e) => {
    if (paused || reduced.matches) return;
    pointer = {
      x: (e.clientX / width - 0.5) * 7,
      y: (e.clientY / height - 0.5) * 7,
    };
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = { x: 0, y: 0 };
  });
  canvas.addEventListener("pointerdown", (e) => {
    echoes.push({ x: e.clientX, y: e.clientY, born: time });
    echoes = echoes.slice(-5);
    draw();
  });
  document.getElementById("orbit").addEventListener("click", () => {
    view = (view + 1) % 3;
    build();
    draw();
    document.getElementById("view-name").textContent =
      String(view + 1).padStart(2, "0") + " / " + names[view];
    document.getElementById("announcement").textContent = names[view];
  });
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    sync();
  });
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    pointer = { x: 0, y: 0 };
    drift = { x: 0, y: 0 };
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  let resizeFrame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resize);
  });
  resize();
  sync();
}
