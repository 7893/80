import { vertex, extract, blur, composite } from "../shaders/postprocess.js";

// RGBA8 targets work without optional floating-point texture extensions.
export function createPostprocess(gl, resources, strength) {
  const quad = resources.buffer([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  const passes = [extract, blur, composite].map((fragment) => {
    const pass = resources.program(vertex, fragment);
    pass.attribute = gl.getAttribLocation(pass.p, "a_position");
    return pass;
  });
  let targets = [],
    width = 0,
    height = 0,
    smallWidth = 0,
    smallHeight = 0;
  function dispose() {
    for (const target of targets) {
      gl.deleteFramebuffer(target.framebuffer);
      gl.deleteTexture(target.texture);
    }
    targets = [];
  }
  function target(w, h) {
    const texture = gl.createTexture(),
      framebuffer = gl.createFramebuffer();
    const result = { texture, framebuffer, width: w, height: h };
    targets.push(result);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      dispose();
      throw new Error("Postprocessing target is unavailable");
    }
    return result;
  }
  function resize(w, h) {
    if (width === w && height === h && targets.length) return;
    dispose();
    width = w;
    height = h;
    smallWidth = Math.max(1, Math.round(w / 3));
    smallHeight = Math.max(1, Math.round(h / 3));
    target(w, h);
    target(smallWidth, smallHeight);
    target(smallWidth, smallHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  function begin() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, targets[0].framebuffer);
    gl.viewport(0, 0, width, height);
  }
  function pass(program, input, output, dx = 0, dy = 0) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, output?.framebuffer ?? null);
    gl.viewport(0, 0, output?.width ?? width, output?.height ?? height);
    gl.useProgram(program.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(program.attribute);
    gl.vertexAttribPointer(program.attribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, input.texture);
    gl.uniform1i(program.uniforms.u_image, 0);
    if (program.uniforms.u_step) gl.uniform2f(program.uniforms.u_step, dx, dy);
    if (program.uniforms.u_glow) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, targets[1].texture);
      gl.uniform1i(program.uniforms.u_glow, 1);
      gl.uniform1f(program.uniforms.u_strength, strength);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(program.attribute);
  }
  function finish() {
    gl.disable(gl.BLEND);
    pass(passes[0], targets[0], targets[1]);
    pass(passes[1], targets[1], targets[2], 1 / smallWidth, 0);
    pass(passes[1], targets[2], targets[1], 0, 1 / smallHeight);
    pass(passes[2], targets[0], null);
    gl.activeTexture(gl.TEXTURE0);
  }
  return { resize, begin, finish, dispose };
}
