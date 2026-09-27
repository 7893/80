export function createScene(width, height, dpr, view) {
  const scene = document.createElement("canvas"),
    art = scene.getContext("2d");
  let stars, dust, orbit, occlusion;
  function generator(seed) {
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function glow(x, y, r, stops) {
    const g = art.createRadialGradient(x, y, 0, x, y, r);
    for (const [p, c] of stops) g.addColorStop(p, c);
    art.fillStyle = g;
    art.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function build() {
    const rand = generator(7893 + view * 104729);
    scene.width = Math.round(width * dpr);
    scene.height = Math.round(height * dpr);
    art.setTransform(dpr, 0, 0, dpr, 0, 0);
    art.fillStyle = "#050710";
    art.fillRect(0, 0, width, height);
    const mobile = width <= 700,
      cx = width * (mobile ? 0.51 : 0.71),
      cy = height * (mobile ? 0.62 : 0.49),
      size = Math.min(width * (mobile ? 0.6 : 0.34), height * 0.48, 520);
    occlusion = { x: cx, y: cy, radius: size * 0.31 + 10 };
    orbit = { x: cx, y: cy, size, angle: [-0.36, 0.24, -0.62][view] };
    dust = Array.from({ length: mobile ? 48 : 80 }, () => ({
      angle: rand() * Math.PI * 2,
      radius: size * (0.55 + rand() * 0.44),
      speed: 0.055 + rand() * 0.045,
      brightness: 0.35 + rand() * 0.55,
      size: 0.6 + rand() * 0.8,
    }));

    const warm = view === 1;
    stars = [];
    for (let i = 0; i < Math.min(850, (width * height) / 1500); i++) {
      const s = {
        x: rand() * width,
        y: rand() * height,
        r: rand() < 0.1 ? 1.1 + rand() * 0.6 : rand() * 0.7 + 0.15,
        speed: 1.2 + rand() * 1.1,
        a: rand() * 0.65 + 0.15,
        phase: rand() * 6.28,
      };
      stars.push(s);
      art.fillStyle = `rgba(205,216,249,${s.a})`;
      art.beginPath();
      art.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      art.fill();
    }
    art.save();
    art.translate(cx, cy);
    art.rotate([-0.36, 0.24, -0.62][view]);
    // A tilted annulus made of thousands of individual grains of light.
    art.globalCompositeOperation = "screen";
    for (let i = 0; i < 17000; i++) {
      const angle = rand() * Math.PI * 2,
        band = Math.pow(rand(), 1.9),
        radius = size * (0.54 + band * 0.57),
        flatten = 0.28;
      const x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius * flatten + (rand() - 0.5) * size * 0.025;
      const inner = 1 - band,
        alpha = (0.035 + inner * 0.24) * (rand() * 0.6 + 0.4);
      const color = warm
        ? `255,${Math.round(153 + inner * 72)},${Math.round(115 + inner * 81)}`
        : view === 2
          ? `155,${Math.round(180 + inner * 53)},255`
          : `${Math.round(165 + inner * 85)},${Math.round(179 + inner * 56)},255`;
      art.fillStyle = `rgba(${color},${alpha})`;
      art.fillRect(x, y, rand() * 1.8 + 0.35, rand() * 0.9 + 0.35);
    }
    art.globalCompositeOperation = "source-over";
    const r = size * 0.285;
    // A soft corona and a shaded central sphere obscure the far side of the disk.
    glow(0, 0, r * 1.27, [
      [0, "#02040b"],
      [0.76, "#02040b"],
      [0.81, warm ? "#d5916277" : "#809ffb88"],
      [0.91, "#3855a322"],
      [1, "#101a3400"],
    ]);
    const sphere = art.createRadialGradient(-r * 0.35, -r * 0.6, 0, 0, 0, r);
    sphere.addColorStop(0, "#11182b");
    sphere.addColorStop(0.48, "#060a15");
    sphere.addColorStop(1, "#02030a");
    art.fillStyle = sphere;
    art.beginPath();
    art.arc(0, 0, r, 0, Math.PI * 2);
    art.fill();
    art.globalCompositeOperation = "screen";
    for (let i = 0; i < 8000; i++) {
      const angle = rand() * Math.PI,
        band = Math.pow(rand(), 2),
        radius = size * (0.54 + band * 0.57),
        x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius * 0.28;
      art.fillStyle = warm
        ? `rgba(255,207,154,${0.06 + (1 - band) * 0.25})`
        : `rgba(192,210,255,${0.05 + (1 - band) * 0.25})`;
      art.fillRect(x, y, rand() * 1.8 + 0.3, 0.65);
    }
    art.restore();
    glow(cx - size * 0.92, cy + size * 0.35, size * 0.1, [
      [0, "#dddfff77"],
      [0.07, "#c8d6ff55"],
      [0.3, "#809fff0c"],
      [1, "#809fff00"],
    ]);
    // Keep the reading area calm while preserving the starfield underneath.
    const shade = art.createLinearGradient(
      0,
      0,
      mobile ? 0 : width * 0.62,
      mobile ? height * 0.48 : 0,
    );
    shade.addColorStop(0, "#050710aa");
    shade.addColorStop(1, "#05071000");
    art.fillStyle = shade;
    art.fillRect(0, 0, width, height);
  }
  build();
  return { scene, stars, dust, orbit, occlusion };
}
