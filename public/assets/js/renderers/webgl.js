import { createPostprocess } from "./postprocess.js";
import { createAttractor } from "../interaction/attractor.js";
import { createResources } from "./gl-resources.js";
import { backgroundVertex, backgroundFragment } from "../shaders/background.js";
import { geometryVertex, geometryFragment } from "../shaders/particles.js";

export function startWebGL(onFallback) {
  const canvas = document.getElementById("universe");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
  });
  if (!gl) return false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pauseButton = document.getElementById("pause");
  let active = true,
    lost = false,
    paused = reduced.matches,
    frame = 0,
    last = 0,
    time = 0,
    view = 0;
  let width = 0,
    height = 0,
    dpr = 1,
    nextMeteor = 5,
    meteorAge = -1,
    meteor = new Float32Array([0, 0, 1, 1]);
  let target = [0, 0],
    pointer = [...target],
    echoes = [];
  let resources,
    background,
    geometry,
    pointMax = 64;
  const attractor = createAttractor();
  let postprocess;
  const echoData = new Float32Array(18);
  const names = ["The quiet orbit", "The distant ember", "The blue silence"];

  function initialize() {
    resources = createResources(gl);
    const { program, buffer } = resources;
    pointMax = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
    const high =
      gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision >
      0;
    background = program(
      backgroundVertex,
      backgroundFragment.replace(
        "precision highp float;",
        high ? "precision highp float;" : "precision mediump float;",
      ),
    );
    background.buffer = buffer([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    background.attribute = gl.getAttribLocation(background.p, "a_position");
    geometry = program(geometryVertex, geometryFragment);
    const data = [];

    let seed = 7893;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 20000; i++)
      data.push(rand() * Math.PI * 2, Math.pow(rand(), 1.8), rand(), rand());
    geometry.count = 20000;
    geometry.size = 4;
    geometry.attribute = gl.getAttribLocation(geometry.p, "a_particle");

    geometry.buffer = buffer(data);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    postprocess = createPostprocess(gl, resources, 1.05);
    canvas.dataset.renderer = "webgl";
  }
  function bind(pass, size) {
    gl.useProgram(pass.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, pass.buffer);
    gl.enableVertexAttribArray(pass.attribute);
    gl.vertexAttribPointer(pass.attribute, size, gl.FLOAT, false, 0, 0);
  }
  function uniforms(pass) {
    const u = pass.uniforms;
    const mobile = width <= 700;
    if (u.u_size) gl.uniform2f(u.u_size, width, height);
    if (u.u_time) gl.uniform1f(u.u_time, time);
    if (u.u_cursor) gl.uniform2f(u.u_cursor, ...attractor.position);
    if (u.u_velocity) gl.uniform2f(u.u_velocity, ...attractor.velocity);
    if (u.u_force) gl.uniform1f(u.u_force, attractor.strength);
    if (u.u_pointer) gl.uniform2f(u.u_pointer, pointer[0], pointer[1]);
    if (u.u_center)
      gl.uniform2f(
        u.u_center,
        width * (mobile ? 0.51 : 0.71),
        height * (mobile ? 0.62 : 0.49),
      );
    if (u.u_scale)
      gl.uniform1f(
        u.u_scale,
        Math.min(width * (mobile ? 0.6 : 0.34), height * 0.48, 520),
      );
    if (u.u_angle) gl.uniform1f(u.u_angle, [-0.36, 0.24, -0.62][view]);
    if (u.u_view) gl.uniform1f(u.u_view, view);
    if (u.u_dpr) gl.uniform1f(u.u_dpr, dpr);
    if (u.u_pointMax) gl.uniform1f(u.u_pointMax, pointMax);
    if (u.u_meteor) gl.uniform4fv(u.u_meteor, meteor);
    if (u.u_meteorAge) gl.uniform1f(u.u_meteorAge, meteorAge);
    if (u.u_echoes) {
      for (let i = 0; i < 6; i++) {
        const e = echoes[i];
        echoData[i * 3] = e ? e.x : 0;
        echoData[i * 3 + 1] = e ? e.y : 0;
        echoData[i * 3 + 2] = e ? e.born : -100;
      }
      gl.uniform3fv(u.u_echoes, echoData);
    }
  }
  function draw() {
    if (!active || lost) return;
    postprocess.begin();
    gl.disable(gl.BLEND);
    bind(background, 2);
    uniforms(background);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(background.attribute);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    bind(geometry, geometry.size);
    uniforms(geometry);
    gl.drawArrays(gl.POINTS, 0, geometry.count);
    gl.disableVertexAttribArray(geometry.attribute);
    gl.disable(gl.BLEND);
    postprocess.finish();
    gl.flush();
  }
  function resize() {
    if (!active || lost) return;
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(
      devicePixelRatio || 1,
      1.75,
      Math.sqrt(2200000 / (width * height)),
      maxSize / width,
      maxSize / height,
    );
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    try {
      postprocess.resize(canvas.width, canvas.height);
    } catch (error) {
      active = false;
      cancelAnimationFrame(frame);
      postprocess?.dispose();
      resources?.dispose();
      onFallback();
      return;
    }
    draw();
  }
  function tick(now) {
    frame = 0;
    if (!active || lost || paused || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    time += dt;
    last = now;
    attractor.update(dt);

    pointer[0] += (target[0] - pointer[0]) * 0.035;
    pointer[1] += (target[1] - pointer[1]) * 0.035;
    if (time >= nextMeteor) {
      meteor.set([
        width * (0.48 + Math.random() * 0.4),
        height * (0.08 + Math.random() * 0.16),
        -Math.min(width * 0.36, 400),
        height * 0.2,
      ]);
      meteorAge = 0;
      nextMeteor = time + 16 + Math.random() * 14;
    } else if (meteorAge >= 0) meteorAge += dt;

    echoes = echoes.filter((e) => time - e.born < 4);
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (!active) return;
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    pauseButton.textContent = paused ? "Resume motion" : "Pause motion";
    pauseButton.setAttribute("aria-pressed", String(paused));
    draw();
    if (!lost && !paused && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function ripple(x, y) {
    echoes.push({ x, y, born: time });
    echoes = echoes.slice(-6);
    draw();
  }
  const maxSize = Math.min(
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    ...gl.getParameter(gl.MAX_VIEWPORT_DIMS),
  );
  try {
    initialize();
  } catch (error) {
    postprocess?.dispose();
    resources?.dispose();
    console.warn("WebGL unavailable; using Canvas fallback.", error);
    return false;
  }
  canvas.addEventListener("pointermove", (event) => {
    if (paused || reduced.matches) return;
    attractor.move(event.clientX, event.clientY);
    target = [
      (event.clientX / width - 0.5) * 7,
      (event.clientY / height - 0.5) * 7,
    ];
  });
  canvas.addEventListener("pointerleave", () => {
    attractor.release(paused);
    target = [0, 0];
  });
  canvas.addEventListener("pointerdown", (event) =>
    ripple(event.clientX, event.clientY),
  );
  document.getElementById("orbit").addEventListener("click", () => {
    if (!active) return;
    view = (view + 1) % 3;
    document.getElementById("view-name").textContent =
      String(view + 1).padStart(2, "0") + " / " + names[view];
    document.getElementById("announcement").textContent = names[view];
    draw();
  });
  pauseButton.addEventListener("click", () => {
    if (!active) return;
    paused = !paused;
    sync();
  });
  reduced.addEventListener("change", () => {
    if (!active) return;
    paused = reduced.matches;
    attractor.release(true);

    target = [0, 0];
    pointer = [0, 0];

    sync();
  });
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", resize);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    canvas.dataset.renderer = "webgl-lost";
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    try {
      initialize();
      resize();
      sync();
    } catch (error) {
      active = false;
      cancelAnimationFrame(frame);
      postprocess?.dispose();
      resources?.dispose();
      onFallback();
    }
  });
  resize();
  sync();
  return true;
}
