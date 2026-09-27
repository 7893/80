export const backgroundVertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv=a_position*.5+.5;
  gl_Position=vec4(a_position,0.,1.);
}
`;
export const backgroundFragment = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_size;
uniform float u_time;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_angle;
uniform float u_view;
uniform vec2 u_pointer;
uniform vec4 u_meteor;
uniform float u_meteorAge;
uniform vec3 u_echoes[6];
float hash(vec2 p) {
  return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}
// Analytic orbit distance keeps fine contours crisp at every viewport size.
vec3 orbitLight(vec2 local, float scale, float track, float speed, float phase, vec3 hue) {
  vec2 ellipse = vec2(local.x, local.y / .28);
  float radius = max(length(ellipse), 1.);
  float gradient = max(length(vec2(ellipse.x, ellipse.y / .28)) / radius, 1.);
  float distance = abs(radius - scale * track) / gradient;
  float angle = atan(ellipse.y, ellipse.x);
  float sweep = pow(.5 + .5 * cos(angle - u_time * speed + phase), 24.);
  float filament = exp(-distance * distance / .65);
  float bloom = exp(-distance * distance / 13.);
  return mix(hue, vec3(.82, .91, 1.), .6) *
    (filament * (.10 + sweep * .8) + bloom * sweep * .12);
}
vec3 stars(vec2 p,float cell,float seed) {
  vec2 id=floor(p/cell),q=fract(p/cell);
  float h=hash(id+seed);
  vec2 pos=vec2(.16+.68*h,.16+.68*hash(id+seed+21.));
  float d=length((q-pos)*cell);
  float pulse=.25+.75*pow(.5+.5*sin(u_time*(1.1+h*1.2)+h*40.),2.);
  float size=.45+h*.7;
  float core=exp(-d*d/(size*size));
  float halo=exp(-d*d/14.)*.12;
  float cross=exp(-abs((q.x-pos.x)*cell)*5.)*exp(-abs((q.y-pos.y)*cell)*.65)+exp(-abs((q.y-pos.y)*cell)*5.)*exp(-abs((q.x-pos.x)*cell)*.65);
  return vec3(.66,.78,1.)*(core+halo+cross*.12)*pulse*step(.53,h);
}
void main() {
  vec2 p=vec2(v_uv.x,1.-v_uv.y)*u_size;
  vec2 q=p-u_center-u_pointer;
  float dist=length(q);
  float radius=u_scale*.285;
  vec3 hue=u_view<.5?vec3(.3,.43,.95):(u_view<1.5?vec3(.83,.37,.23):vec3(.17,.6,1.));
  vec3 color = vec3(.012, .017, .034);
  float c=cos(u_angle),s=sin(u_angle);
  vec2 local=vec2(c*q.x+s*q.y,-s*q.x+c*q.y);
  // An artistic lens arc above the silhouette, rather than a physical simulation.
  float bend = length(vec2(q.x, q.y * 1.14));
  float arc = exp(-pow((bend - radius * 1.16) / (u_scale * .012), 2.));
  color += mix(hue, vec3(.8, .88, 1.), .5) * arc * smoothstep(0., radius, -q.y) * .38;
  vec2 lens = q / max(dist, 1.) * radius * .14 * exp(-abs(dist - radius) / (radius * .7));
  color += stars(p - u_pointer * .3 + lens, 43., 3.) * .75;
  color += stars(p - u_pointer * .7 + lens, 91., 81.) * .8;
  float edge=abs(dist-radius)/max(radius,.1);
  float corona=exp(-edge*35.)*.55+exp(-edge*9.)*.07;
  color+=mix(hue,vec3(.7,.8,1.),.4)*corona;
  if(dist<radius) {
    float lighting=pow(max(0.,1.-length((q+vec2(radius*.3,radius*.45))/radius)),2.);
    color=vec3(.004,.008,.02)+hue*lighting*.045;
    color+=hue*pow(dist/radius,32.)*.16;
  }
  // The far side disappears behind the sphere; the near side crosses its face.
  if (dist > radius || local.y > 0.) {
    color += orbitLight(local, u_scale, .55, .24, .0, hue);
    color += orbitLight(local, u_scale, .79, -.17, 2.1, hue) * .7;
    color += orbitLight(local, u_scale, 1.10, .12, 4.2, hue) * .55;
  }
  float age=u_meteorAge;
  if(age>=0.&&age<1.8&&dist>radius) {
    float t=age/1.8;
    vec2 head=u_meteor.xy+u_meteor.zw*t;
    vec2 tail=head-u_meteor.zw*.24;
    vec2 line=head-tail;
    float at=clamp(dot(p-tail,line)/dot(line,line),0.,1.);
    float d=length(p-tail-line*at);
    color+=vec3(.75,.85,1.)*(exp(-d*d*1.8)+exp(-d*d*.12)*.12)*at*sin(t*3.14159);
  }
  for(int i=0;i<6;i++) {
    float age=u_time-u_echoes[i].z;
    if(age>=0.&&age<2.4) {
      float d=abs(length(p-u_echoes[i].xy)-(8.+age*32.));
      color+=vec3(.55,.7,1.)*exp(-d*d*2.)*max(0.,.4-age*.17);
    }
  }
  float shade=u_size.x<700.?smoothstep(0.,u_size.y*.5,p.y):smoothstep(0.,u_size.x*.6,p.x);
  color*=.68+.32*shade;
  gl_FragColor=vec4(color,1.);
}
`;
