/* ==========================================================================
   About · hologram projector (Three.js, lazy-loaded)
   A vector-style wireframe globe projected from a pedestal: lat/long
   lines + a dot shell, a fresnel core, an "origin" pin on India, three
   tilted orbits carrying satellites that raise a conjunction alert when
   two drift close (a nod to Orbital AI), and HUD tags pinned to 3D points.
   Boots when it scrolls into view, follows the cursor, spins when dragged.
   ========================================================================== */
const root = document.getElementById('about-holo');
const D = window.PORTFOLIO || {};
const H = (D.about && D.about.holo) || {};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 860px)').matches;

if (root) {
  let booted = false, visible = false, api = null;
  const io = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !booted) {
      booted = true;
      import('./vendor/three.module.min.js')
        .then(THREE => { api = build(THREE); api && api.start(); })
        .catch(() => root.classList.add('no-webgl'));
    } else if (api) visible ? api.start() : api.stop();
  }, { rootMargin: '250px 0px' });
  io.observe(root);
}

/* small local text decoder for the HUD tags */
const GL = '█▓▒░<>/\\[]{}=+*#%&@$?!01ΣΔΩ';
function decode(el, text, ms = 700) {
  if (reduced) { el.textContent = text; return; }
  const t0 = performance.now(), ends = [...text].map(() => Math.random() * ms * 0.7 + ms * 0.3);
  (function step() {
    const t = performance.now() - t0;
    el.textContent = [...text].map((c, i) => c === ' ' || t >= ends[i] ? c : GL[(Math.random() * GL.length) | 0]).join('');
    if (t < ms) requestAnimationFrame(step); else el.textContent = text;
  })();
}

function build(THREE) {
  const canvas = root.querySelector('canvas');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch { root.classList.add('no-webgl'); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const C = { cyan: new THREE.Color('#3ff2ff'), magenta: new THREE.Color('#ff2fb0'), sun: new THREE.Color('#ffd23f'), orange: new THREE.Color('#ff7a3d'), red: new THREE.Color('#ff3b5c') };
  const R = 1.3;
  const U = { uTime: { value: 0 }, uReveal: { value: 0 } };
  const ADD = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

  const world = new THREE.Group(); scene.add(world);           // whole hologram (tilts with cursor)
  const holo = new THREE.Group(); holo.position.y = 0.38; world.add(holo);
  const globe = new THREE.Group(); holo.add(globe);             // spins

  /* ---- lat/long wireframe ------------------------------------------- */
  const pts = [];
  const seg = 120;
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = Math.sin(lat * Math.PI / 180) * R, r = Math.cos(lat * Math.PI / 180) * R;
    for (let i = 0; i < seg; i++) {
      const a = i / seg * Math.PI * 2, b = (i + 1) / seg * Math.PI * 2;
      pts.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r);
    }
  }
  for (let m = 0; m < 24; m++) {
    const lon = m / 24 * Math.PI * 2;
    for (let i = 0; i < seg / 2; i++) {
      const p = -Math.PI / 2 + i / (seg / 2) * Math.PI, q = -Math.PI / 2 + (i + 1) / (seg / 2) * Math.PI;
      pts.push(Math.cos(p) * Math.cos(lon) * R, Math.sin(p) * R, Math.cos(p) * Math.sin(lon) * R,
               Math.cos(q) * Math.cos(lon) * R, Math.sin(q) * R, Math.cos(q) * Math.sin(lon) * R);
    }
  }
  const wireGeo = new THREE.BufferGeometry();
  wireGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const shellVert = `
    uniform float uTime; varying float vFace; varying float vY; varying float vScan;
    uniform float uSize;
    void main(){
      vec3 n = normalize(normalMatrix * normalize(position));
      vFace = n.z; vY = position.y;
      float scanY = mod(uTime * 0.55, 3.6) - 1.8;
      vScan = exp(-pow((position.y - scanY) * 7.0, 2.0));
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize * (6.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`;
  const wireMat = new THREE.ShaderMaterial({
    ...ADD, uniforms: { ...U, uSize: { value: 0 }, uColor: { value: C.cyan } },
    vertexShader: shellVert,
    fragmentShader: `
      uniform vec3 uColor; uniform float uReveal; varying float vFace; varying float vY; varying float vScan;
      void main(){
        if (abs(vY) > uReveal * ${(R * 1.02).toFixed(3)}) discard;
        float a = mix(0.10, 0.55, smoothstep(-0.2, 0.35, vFace));
        vec3 c = mix(uColor, vec3(1.0), vScan * 0.6);
        gl_FragColor = vec4(c, a + vScan * 0.6);
      }`
  });
  globe.add(new THREE.LineSegments(wireGeo, wireMat));

  /* ---- dot shell (fibonacci sphere) ------------------------------------ */
  const N = small ? 900 : 1600, dots = new Float32Array(N * 3), ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    dots.set([Math.cos(th) * r * R * 1.004, y * R * 1.004, Math.sin(th) * r * R * 1.004], i * 3);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dots, 3));
  const dotMat = new THREE.ShaderMaterial({
    ...ADD, uniforms: { ...U, uSize: { value: 2.2 }, uColor: { value: C.magenta } },
    vertexShader: shellVert,
    fragmentShader: `
      uniform vec3 uColor; uniform float uReveal; varying float vFace; varying float vY; varying float vScan;
      void main(){
        if (abs(vY) > uReveal * ${(R * 1.02).toFixed(3)}) discard;
        vec2 d = gl_PointCoord - 0.5; if (dot(d, d) > 0.25) discard;
        float a = mix(0.05, 0.75, smoothstep(-0.1, 0.5, vFace));
        gl_FragColor = vec4(mix(uColor, vec3(1.0, 0.85, 0.95), vScan), a + vScan * 0.5);
      }`
  });
  globe.add(new THREE.Points(dotGeo, dotMat));

  /* ---- fresnel core + halo -------------------------------------------- */
  const fres = (color, power, strength, side) => new THREE.ShaderMaterial({
    ...ADD, side, uniforms: { uReveal: U.uReveal, uColor: { value: color } },
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uReveal; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(vN, vV)), ${power.toFixed(1)}); gl_FragColor = vec4(uColor, f * ${strength.toFixed(2)} * uReveal); }`
  });
  holo.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 32), fres(C.magenta, 2.4, 0.6, THREE.FrontSide)));
  holo.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 48, 32), fres(C.cyan, 5.0, 0.28, THREE.BackSide)));

  /* ---- origin pin -------------------------------------------------------- */
  const origin = H.origin || { lat: 20.6, lon: 78.9, label: 'Origin · India' };
  const ll = (lat, lon, r) => {
    const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  };
  const pinBase = ll(origin.lat, origin.lon, R), pinTip = ll(origin.lat, origin.lon, R * 1.42);
  const pin = new THREE.Group(); globe.add(pin);
  const spike = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pinBase, pinTip]), new THREE.LineBasicMaterial({ color: C.sun, ...ADD }));
  pin.add(spike);
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.085, 40), new THREE.MeshBasicMaterial({ color: C.sun, side: THREE.DoubleSide, ...ADD }));
  pulse.position.copy(pinBase.clone().multiplyScalar(1.004)); pulse.lookAt(pinBase.clone().multiplyScalar(2)); pin.add(pulse);
  const pinDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: C.sun }));
  pinDot.position.copy(pinBase); pin.add(pinDot);
  const pinAnchor = new THREE.Object3D(); pinAnchor.position.copy(pinTip); pin.add(pinAnchor);

  /* ---- orbits + satellites ------------------------------------------- */
  const orbitDefs = [
    { r: 1.78, tilt: [0.42, 0, 0.18], color: C.cyan, speed: 0.34, sats: 3 },
    { r: 2.1, tilt: [-0.28, 0.6, -0.36], color: C.magenta, speed: -0.24, sats: 3 },
    { r: 2.42, tilt: [1.2, -0.3, 0.1], color: C.sun, speed: 0.17, sats: 2 }
  ];
  const labels = H.satellites || ['Orbital AI · SIH top 7', 'SGPA 9.18', 'Coding since 2021'];
  const sats = [], orbits = [];
  const satGeo = new THREE.OctahedronGeometry(0.055, 0), panelGeo = new THREE.PlaneGeometry(0.16, 0.045);
  orbitDefs.forEach((o, oi) => {
    const g = new THREE.Group(); g.rotation.set(...o.tilt); holo.add(g);
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 257 }, (_, i) => { const a = i / 256 * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * o.r, 0, Math.sin(a) * o.r); })),
      new THREE.LineDashedMaterial({ color: o.color, dashSize: 0.09, gapSize: 0.06, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
    ring.computeLineDistances(); g.add(ring);
    g.scale.setScalar(0.001);
    orbits.push(g);
    for (let s = 0; s < o.sats; s++) {
      const sat = new THREE.Group();
      sat.add(new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0xffffff })));
      const panel = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: o.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
      sat.add(panel);
      g.add(sat);
      sats.push({ obj: sat, ring: oi, r: o.r, a: (s / o.sats) * Math.PI * 2 + oi * 0.7, speed: o.speed * (1 + s * 0.04), label: s === 0 ? labels[oi] : null });
    }
  });

  // conjunction alert line between the two closest satellites on different orbits
  const alertGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const alertLine = new THREE.Line(alertGeo, new THREE.LineBasicMaterial({ color: C.red, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  holo.add(alertLine);

  /* ---- projector pedestal + beam -------------------------------------- */
  const baseY = -1.62;
  const pedestal = new THREE.Group(); pedestal.position.y = baseY; world.add(pedestal);
  [[0.55, 0.62, C.cyan, 0.9], [0.85, 0.88, C.magenta, 0.6], [1.15, 1.17, C.cyan, 0.35], [1.5, 1.51, C.magenta, 0.2]].forEach(([a, b, c, o]) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(a, b, 96), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2; pedestal.add(m);
  });
  const ticks = [];
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * Math.PI * 2, r0 = 0.95, r1 = i % 4 ? 1.02 : 1.08;
    ticks.push(Math.cos(a) * r0, 0, Math.sin(a) * r0, Math.cos(a) * r1, 0, Math.sin(a) * r1);
  }
  const tickRing = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3)), new THREE.LineBasicMaterial({ color: C.sun, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending }));
  pedestal.add(tickRing);
  const polar = new THREE.PolarGridHelper(2.6, 16, 6, 64, 0x7b2ff7, 0x3a1466);
  polar.material.transparent = true; polar.material.opacity = 0.35; polar.material.depthWrite = false;
  pedestal.add(polar);

  const beamH = 2.15;
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 0.55, beamH, 64, 1, true),
    new THREE.ShaderMaterial({
      ...ADD, side: THREE.DoubleSide, uniforms: { uTime: U.uTime },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uTime; varying vec2 vUv;
        float h(float x){ return fract(sin(x * 91.7) * 4375.85); }
        void main(){
          float fade = pow(1.0 - vUv.y, 1.6);
          float streak = 0.55 + 0.45 * h(floor(vUv.x * 90.0));
          float flow = 0.75 + 0.25 * sin(vUv.y * 40.0 - uTime * 3.0);
          gl_FragColor = vec4(mix(vec3(0.25, 0.95, 1.0), vec3(1.0, 0.2, 0.7), vUv.y), fade * streak * flow * 0.22);
        }`
    }));
  beam.position.y = baseY + beamH / 2;
  beam.scale.y = 0.001; beam.position.y = baseY;
  world.add(beam);

  /* ---- distant stars ------------------------------------------------------ */
  const sp = new Float32Array(500 * 3);
  for (let i = 0; i < 500; i++) {
    const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, r = 14 + Math.random() * 8;
    sp.set([Math.sqrt(1 - u * u) * Math.cos(t) * r, u * r, Math.sqrt(1 - u * u) * Math.sin(t) * r - 6], i * 3);
  }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sp, 3)),
    new THREE.PointsMaterial({ color: 0xbfd8ff, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(stars);

  /* ---- HUD tags pinned to 3D anchors ---------------------------------- */
  const layer = root.querySelector('.holo-tags');
  const mkTag = (text, cls) => {
    const el = document.createElement('div');
    el.className = 'holo-tag ' + (cls || '');
    el.innerHTML = '<i></i><span class="ln"></span><b></b>';
    layer.appendChild(el);
    return { el, b: el.querySelector('b'), text };
  };
  const tags = [{ ...mkTag(origin.label, 'sun'), anchor: pinAnchor, surface: pinBase }];
  sats.filter(s => s.label).forEach(s => tags.push({ ...mkTag(s.label, s.ring === 1 ? 'mag' : s.ring === 2 ? 'sun' : ''), anchor: s.obj }));

  const hudRot = root.querySelector('[data-hud="rot"]'), hudObj = root.querySelector('[data-hud="obj"]'), hudConj = root.querySelector('[data-hud="conj"]');
  const alertEl = root.querySelector('.holo-alert');
  hudObj.textContent = String(sats.length).padStart(2, '0');

  /* ---- interaction ------------------------------------------------------ */
  // start rotated so the origin pin swings round to face the camera shortly after boot
  let tx = 0, ty = 0, cx = 0, cy = 0, spin = Math.atan2(-pinBase.x, pinBase.z) - 0.45, spinVel = 0, dragging = false, lastX = 0;
  root.addEventListener('pointermove', e => {
    const r = root.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (dragging) { spinVel += (e.clientX - lastX) * 0.0022; lastX = e.clientX; }
  });
  root.addEventListener('pointerleave', () => { tx = ty = 0; dragging = false; root.classList.remove('dragging'); });
  root.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; root.classList.add('dragging'); root.setPointerCapture(e.pointerId); });
  root.addEventListener('pointerup', () => { dragging = false; root.classList.remove('dragging'); });

  /* ---- sizing ------------------------------------------------------------ */
  let W = 0, Hh = 0;
  function resize() {
    W = root.clientWidth; Hh = root.clientHeight;
    renderer.setSize(W, Hh, false);
    camera.aspect = W / Hh;
    camera.fov = W / Hh < 0.9 ? 40 : 34;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(root); resize();

  /* ---- boot sequence ------------------------------------------------------- */
  const gs = window.gsap;
  function boot() {
    root.classList.add('on');
    if (!gs || reduced) {
      U.uReveal.value = 1; beam.scale.y = 1; beam.position.y = baseY + beamH / 2; orbits.forEach(o => o.scale.setScalar(1));
      tags.forEach(t => (t.b.textContent = t.text)); return;
    }
    const tl = gs.timeline();
    tl.to(beam.scale, { y: 1, duration: 0.7, ease: 'power3.out' }, 0)
      .to(beam.position, { y: baseY + beamH / 2, duration: 0.7, ease: 'power3.out' }, 0)
      .to(U.uReveal, { value: 1, duration: 1.3, ease: 'steps(14)' }, 0.35)
      .to(orbits.map(o => o.scale), { x: 1, y: 1, z: 1, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.15 }, 0.9)
      .add(() => tags.forEach((t, i) => setTimeout(() => { t.el.classList.add('in'); decode(t.b, t.text); }, i * 180)), 1.5);
  }

  /* ---- frame loop -------------------------------------------------------- */
  const v = new THREE.Vector3(), wp = new THREE.Vector3(), camPos = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
  let running = false, last = 0, t = 0, conjCount = 0, conjOn = false, bootedOnce = false;
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now; t += dt;
    U.uTime.value = t;

    // scroll: the camera dollies in and rises as the section scrolls past
    const r = root.getBoundingClientRect();
    const sp = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
    if (!bootedOnce && r.top < innerHeight * 0.72) { bootedOnce = true; boot(); }
    camera.position.set(Math.sin((sp - 0.5) * 0.6) * 1.2, 0.55 + (sp - 0.5) * 0.9, 9.6 - sp * 1.2);
    camera.lookAt(0, 0.12, 0);

    cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
    world.rotation.y = cx * 0.35; world.rotation.x = cy * 0.16;
    spinVel *= 0.94;
    spin += dt * (reduced ? 0.05 : 0.16) + spinVel;
    globe.rotation.y = spin;
    tickRing.rotation.y -= dt * 0.25;
    polar.rotation.y += dt * 0.05;

    const ps = 1 + ((t * 0.9) % 1) * 1.6;
    pulse.scale.setScalar(ps); pulse.material.opacity = 1 - (ps - 1) / 1.6;

    sats.forEach(s => {
      s.a += s.speed * dt;
      s.obj.position.set(Math.cos(s.a) * s.r, 0, Math.sin(s.a) * s.r);
      s.obj.rotation.y = -s.a; s.obj.children[0].rotation.x += dt * 2;
    });

    // conjunction check
    let best = Infinity, pa = null, pb = null;
    for (let i = 0; i < sats.length; i++) for (let j = i + 1; j < sats.length; j++) {
      if (sats[i].ring === sats[j].ring) continue;
      sats[i].obj.getWorldPosition(a); sats[j].obj.getWorldPosition(b);
      const d = a.distanceTo(b);
      if (d < best) { best = d; pa = sats[i]; pb = sats[j]; }
    }
    const close = best < 0.55 && U.uReveal.value > 0.99;
    if (close) {
      pa.obj.getWorldPosition(a); pb.obj.getWorldPosition(b);
      holo.worldToLocal(a); holo.worldToLocal(b);
      alertGeo.attributes.position.setXYZ(0, a.x, a.y, a.z); alertGeo.attributes.position.setXYZ(1, b.x, b.y, b.z);
      alertGeo.attributes.position.needsUpdate = true;
      alertLine.material.opacity = 0.5 + 0.5 * Math.sin(t * 30);
      if (!conjOn) { conjOn = true; conjCount++; hudConj.textContent = String(conjCount).padStart(2, '0'); alertEl.classList.add('show'); }
    } else if (conjOn) { conjOn = false; alertLine.material.opacity = 0; alertEl.classList.remove('show'); }

    renderer.render(scene, camera);

    // project HUD tags
    camera.getWorldPosition(camPos);
    tags.forEach(tag => {
      tag.anchor.getWorldPosition(wp);
      v.copy(wp).project(camera);
      let vis = v.z < 1;
      if (tag.surface) {                                   // hide the origin tag when India faces away
        const n = tag.surface.clone().applyMatrix4(globe.matrixWorld).sub(holo.getWorldPosition(a)).normalize();
        vis = vis && n.dot(camPos.clone().sub(wp).normalize()) > -0.05;
      } else {                                             // satellites: hide when behind the globe
        holo.getWorldPosition(a);
        vis = vis && (wp.distanceTo(camPos) < a.distanceTo(camPos) + 0.4);
      }
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * Hh;
      const flip = x > W * 0.62;
      tag.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      tag.el.classList.toggle('flip', flip);
      tag.el.classList.toggle('hidden', !vis);
    });

    if (hudRot && ((t * 10) | 0) % 2 === 0) {
      const deg = ((spin * 180 / Math.PI) % 360 + 360) % 360;
      hudRot.textContent = `${deg.toFixed(1).padStart(5, '0')}° / ${(world.rotation.x * 57.3).toFixed(1)}°`;
    }
    requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return; running = true; last = 0;
      requestAnimationFrame(frame);
    },
    stop() { running = false; }
  };
}
