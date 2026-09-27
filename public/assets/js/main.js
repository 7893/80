import { startWebGL } from "./renderers/webgl.js";
import { startCanvasFallback } from "./renderers/canvas.js";

function fallback() {
  const old = document.getElementById("universe");
  const canvas = old.cloneNode(false);
  canvas.dataset.renderer = "canvas2d";
  old.replaceWith(canvas);
  startCanvasFallback();
}

try {
  if (!startWebGL(fallback)) fallback();
} catch (error) {
  console.warn("Starting Canvas fallback.", error);
  fallback();
}
