export const vertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() { v_uv = a_position * .5 + .5; gl_Position = vec4(a_position, 0., 1.); }
`;
export const extract = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
void main() {
  vec3 c = texture2D(u_image, v_uv).rgb;
  float light = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c * smoothstep(.16, .65, light), 1.);
}
`;
export const blur = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_step;
void main() {
  vec3 c = texture2D(u_image, v_uv).rgb * .227027;
  c += texture2D(u_image, v_uv + u_step * 1.384615).rgb * .316216;
  c += texture2D(u_image, v_uv - u_step * 1.384615).rgb * .316216;
  c += texture2D(u_image, v_uv + u_step * 3.230769).rgb * .070270;
  c += texture2D(u_image, v_uv - u_step * 3.230769).rgb * .070270;
  gl_FragColor = vec4(c, 1.);
}
`;
export const composite = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform sampler2D u_glow;
uniform float u_strength;
void main() {
  vec3 c = texture2D(u_image, v_uv).rgb;
  vec3 glow = texture2D(u_glow, v_uv).rgb;
  c += glow * u_strength;
  float vignette = 1. - .17 * smoothstep(.25, .82, length(v_uv - .5));
  c *= vignette;
  // Stable dither softens gradients without introducing animated grain.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 437.);
  c += (grain - .5) / 255.;
  gl_FragColor = vec4(c, 1.);
}
`;
