export function createResources(gl) {
  const programs = [],
    buffers = [];
  function program(vertex, fragment) {
    const shaders = [];
    const p = gl.createProgram();
    try {
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
      ]) {
        const shader = gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(p, shader);
      }
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(p) || "Shader link failed");
    } catch (error) {
      gl.deleteProgram(p);
      throw error;
    } finally {
      for (const shader of shaders) gl.deleteShader(shader);
    }
    programs.push(p);
    const uniforms = {};
    const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(p, i).name;
      uniforms[name.replace("[0]", "")] = gl.getUniformLocation(p, name);
    }
    return { p, uniforms };
  }
  function buffer(data) {
    const b = gl.createBuffer();
    buffers.push(b);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return b;
  }
  return {
    program,
    buffer,
    dispose() {
      for (const item of buffers) gl.deleteBuffer(item);
      for (const item of programs) gl.deleteProgram(item);
    },
  };
}
