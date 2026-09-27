export const geometryVertex = `
attribute vec4 a_particle;
uniform vec2 u_size;
uniform vec2 u_center;
uniform vec2 u_pointer;
uniform vec2 u_cursor;
uniform float u_force;
uniform vec3 u_echoes[6];
uniform float u_scale;
uniform float u_time;
uniform float u_angle;
uniform float u_dpr;
uniform float u_pointMax;
varying float v_alpha;
void main() {
  float radius=u_scale*(.54+a_particle.y*.56);
  float angle=a_particle.x+u_time*(.035+.03*(1.-a_particle.y));
  vec2 q=vec2(cos(angle)*radius,sin(angle)*radius*.28);
  float rear = step(q.y, 0.);
  float c=cos(u_angle),s=sin(u_angle);
  vec2 p=vec2(c*q.x-s*q.y,s*q.x+c*q.y)+u_center+u_pointer;
  vec2 delta = u_cursor - p;
  float pull = exp(-dot(delta, delta) / 22000.) * u_force;
  p += delta * pull * .19;
  for (int i = 0; i < 6; i++) {
    float age = u_time - u_echoes[i].z;
    if (age >= 0. && age < 4.) {
      vec2 diff = p - u_echoes[i].xy;
      float distance = length(diff);
      float wave = sin(distance * .03 - age * 4.) * exp(-pow((distance - age * 100.) / 90., 2.)) * exp(-age);
      p += diff / max(distance, 1.) * wave * 9.;
    }
  }
  float hidden = rear * (1. - step(u_scale * .29, length(p - u_center - u_pointer)));
  gl_Position=vec4(p.x/u_size.x*2.-1.,1.-p.y/u_size.y*2.,0.,1.);
  gl_PointSize=min(u_pointMax,(1.4+a_particle.z*2.7)*u_dpr);
  v_alpha=(.035+.19*(1.-a_particle.y))*(.45+.55*a_particle.w)*(1.-hidden)*clamp(u_scale/430.,.45,1.);
  // Coherent bright lanes and an orbiting crest replace diffuse foreground dust.
  float lane = .5 + .5 * cos(a_particle.y * 30.);
  float crest = pow(.5 + .5 * cos(angle - u_time * .21), 12.);
  v_alpha *= (.6 + lane * .5 + crest * .65) * (1. + pull * 1.5);
}
`;
export const geometryFragment = `
precision mediump float;
varying float v_alpha;
uniform float u_view;
void main() {
  float d=length(gl_PointCoord-.5)*2.;
  float light=exp(-d*d*5.)+exp(-d*d*1.5)*.15;
  vec3 color=u_view<.5?vec3(.66,.77,1.):(u_view<1.5?vec3(1.,.69,.38):vec3(.38,.76,1.));
  gl_FragColor=vec4(color*light*v_alpha,1.);
}
`;
