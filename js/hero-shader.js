/* Hero background — a synthwave horizon in plain WebGL1:
   star field, a striped setting sun, silhouetted mountains with a neon rim,
   and an anti-aliased perspective grid that rolls toward the camera.
   The cursor pans the camera; scrolling sets the sun and throttles the grid
   up to warp speed. Falls back to the CSS gradient if WebGL is missing. */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return;
  const hasDeriv = !!gl.getExtension('OES_standard_derivatives');

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = (hasDeriv ? '#extension GL_OES_standard_derivatives : enable\n#define DERIV 1\n' : '') + `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll; uniform float uTravel;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(float x){ float i = floor(x), f = fract(x); return mix(hash(vec2(i, 3.1)), hash(vec2(i + 1., 3.1)), f * f * (3. - 2. * f)); }

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float asp = uRes.x / uRes.y;
  float px = 1. / uRes.y;
  vec2 p = vec2((uv.x - .5) * asp, uv.y);
  float camX = (uMouse.x - .5);
  float hz = .40 - uScroll * .05;                 // horizon (fraction from bottom)

  // ---------- sky ----------
  float sy = clamp((uv.y - hz) / (1. - hz), 0., 1.);
  vec3 skyTop = vec3(.043, .027, .094);
  vec3 skyMid = vec3(.20, .05, .34);
  vec3 skyLow = vec3(1., .25, .50);
  vec3 col = mix(skyLow, skyMid, smoothstep(0., .32, sy));
  col = mix(col, skyTop, smoothstep(.28, .95, sy));
  col = mix(col, skyTop, uScroll * .75 * smoothstep(.0, .4, sy));

  // stars (twinkling, only high in the sky)
  vec2 cell = floor(frag / 2.5);
  float h = hash(cell);
  float star = step(.9965, h) * (.55 + .45 * sin(uTime * (2. + h * 6.) + h * 80.));
  col += vec3(.85, .9, 1.) * star * smoothstep(.25, .7, sy);

  // ---------- sun ----------
  float sunR = .22;
  vec2 sunC = vec2(-camX * .10, hz + .17 - uScroll * .36);
  vec2 d = p - sunC; float sd = length(d);
  float sv = (p.y - (sunC.y - sunR)) / (2. * sunR);    // 0 bottom → 1 top of the disc
  float k = clamp((.62 - sv) / .62, 0., 1.);            // grows toward the bottom
  float f = fract(p.y * 24. + uTime * .25);
  float stripe = smoothstep(k * .8 - .03, k * .8 + .03, f) + step(k, 0.);
  stripe = clamp(stripe, 0., 1.);
  vec3 sunCol = mix(vec3(1., .13, .52), vec3(1., .86, .28), smoothstep(.05, .95, sv));
  float disc = smoothstep(sunR + px * 1.5, sunR - px * 1.5, sd);
  float above = step(hz, uv.y);
  float glow = exp(-max(sd - sunR, 0.) * 7.) * .5 * (1. - uScroll * .6);
  col += vec3(1., .28, .55) * glow * above;
  col = mix(col, sunCol, disc * stripe * above);

  // ---------- mountains (sides only, parallax with the cursor) ----------
  float mxw = p.x + camX * .2;
  float side = smoothstep(.16, .62, abs(p.x - sunC.x * .5));
  float mh = hz + (.012 + .11 * vnoise(mxw * 3.3 + 7.) + .05 * vnoise(mxw * 8.1) + .015 * vnoise(mxw * 23.)) * side;
  if (uv.y > hz && uv.y < mh) {
    vec3 rock = vec3(.075, .03, .15);
    float rim = smoothstep(px * 3., 0., mh - uv.y);
    float ridge = smoothstep(.0, .5, fract((uv.y - hz) * 60. + mxw * 4.)) * .04;
    col = rock + ridge + vec3(1., .2, .72) * rim * .9;
  }

  // ---------- floor grid ----------
  if (uv.y < hz) {
    float dy = hz - uv.y;
    float z = .16 / dy;
    vec2 g = vec2(p.x * z * 13. + camX * 4., z * 6. + uTravel * 3.);
    vec3 floorC = vec3(.035, .01, .075);
    floorC = mix(floorC, vec3(.55, .08, .38), exp(-dy * 22.));
    #ifdef DERIV
      vec2 gr = abs(fract(g - .5) - .5) / max(fwidth(g), vec2(1e-4));
      float ln = min(gr.x, gr.y);
      float line = 1. - smoothstep(.6, 1.9, ln);
      float halo = exp(-ln * .22) * .35;
    #else
      vec2 gr = abs(fract(g - .5) - .5);
      float ln = min(gr.x, gr.y) / (z * .02 + .01);
      float line = 1. - smoothstep(.6, 1.9, ln);
      float halo = exp(-ln * .22) * .35;
    #endif
    float fade = smoothstep(.0, .06, dy);
    vec3 lineC = mix(vec3(1., .18, .7), vec3(.35, .95, 1.), smoothstep(.12, .4, dy) * .55);
    col = floorC + lineC * (line + halo) * fade;
    // sun reflection streak
    col += vec3(1., .4, .6) * exp(-abs(p.x - sunC.x) * 5.) * exp(-dy * 9.) * .22 * (1. - uScroll);
  }

  // horizon glow line
  col += vec3(1., .38, .72) * exp(-abs(uv.y - hz) * 160.) * .9;

  // vignette + deband dither
  col *= 1. - .45 * smoothstep(.55, 1.35, length((uv - .5) * vec2(asp, 1.)));
  col += (hash(frag + fract(uTime)) - .5) / 128.;
  gl_FragColor = vec4(col, 1.);
}`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uScroll = U('uScroll'), uTravel = U('uTravel');

  const slow = (navigator.hardwareConcurrency || 8) <= 4 || matchMedia('(pointer: coarse)').matches;
  const SCALE = slow ? 0.45 : 0.6;
  function resize() {
    const w = Math.max(2, Math.round(canvas.clientWidth * SCALE));
    const h = Math.max(2, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  addEventListener('resize', resize); resize();

  const target = { x: .5, y: .5 }, cur = { x: .5, y: .5 };
  addEventListener('pointermove', e => { target.x = e.clientX / innerWidth; target.y = 1 - e.clientY / innerHeight; }, { passive: true });

  let visible = false, start = performance.now(), last = 0, travel = 0, prev = 0;
  window.heroShader = {
    scroll: 0,
    setVisible(v) { if (v === visible) return; visible = v; if (v) { prev = 0; requestAnimationFrame(frame); } }
  };
  function frame(now) {
    if (!visible) return;
    if (slow && now - last < 32) { requestAnimationFrame(frame); return; }
    last = now;
    const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0; prev = now;
    const s = window.heroShader.scroll;
    travel += dt * (0.5 + s * s * 7);
    cur.x += (target.x - cur.x) * 0.04; cur.y += (target.y - cur.y) * 0.04;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uMouse, cur.x, cur.y);
    gl.uniform1f(uScroll, s);
    gl.uniform1f(uTravel, travel);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  // draw one frame immediately so the boot transition reveals a finished scene
  window.heroShader.setVisible(true);
})();
