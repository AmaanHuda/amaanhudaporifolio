/* ==========================================================================
   Amaan — portfolio motion engine · retro-futurist edition
   GSAP + ScrollTrigger + Lenis, vanilla JS.
   Terminal boot → VHS stripe wipe → chrome name drops onto a synthwave horizon
   → scroll throttles the grid to a warp jump while a teletype phrase decodes;
   block-cursor word wipes; pinned rolodex of files; split-flap experience
   rows; channel-select drum with a CRT set and static bursts; CRT power-on
   project dialog; hyperspace tunnel gallery; scroll-driven oscilloscope;
   sunset-stripe contact takeover; synthwave footer.
   ========================================================================== */
(() => {
  'use strict';
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqMobile = matchMedia('(max-width: 860px)');
  const isMobile = () => mqMobile.matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  gsap.registerPlugin(ScrollTrigger);

  const GLYPHS = '█▓▒░<>/\\[]{}=+*#%&@$?!01ΣΔΩ';
  const FLAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789—';
  const rg = (set = GLYPHS) => set[(Math.random() * set.length) | 0];

  /* text decoder: every character cycles through glyphs, then locks in */
  function scramble(el, to, { duration = 0.7, chars = GLYPHS } = {}) {
    if (el._scr) cancelAnimationFrame(el._scr);
    if (reduced) { el.textContent = to; return Promise.resolve(); }
    const from = el.textContent;
    const len = Math.max(from.length, to.length);
    const q = [];
    for (let i = 0; i < len; i++) {
      const start = Math.random() * duration * 0.4;
      q.push({ from: from[i] || '', to: to[i] || '', start, end: start + duration * (0.3 + Math.random() * 0.3) });
    }
    const t0 = performance.now();
    return new Promise(res => {
      const step = () => {
        const t = (performance.now() - t0) / 1000;
        let out = '', done = 0;
        for (const c of q) {
          if (t >= c.end) { out += c.to; done++; }
          else if (t >= c.start) out += c.to === ' ' ? ' ' : rg(chars);
          else out += c.from;
        }
        el.textContent = out;
        if (done === q.length) { el._scr = 0; res(); } else el._scr = requestAnimationFrame(step);
      };
      step();
    });
  }

  /* teletype: types `text` into el at `cps` characters per second */
  function typeText(el, text, cps = 40) {
    el.classList.remove('done');
    if (reduced) { el.textContent = text; el.classList.add('done'); return gsap.to({}, { duration: 0 }); }
    const o = { n: 0 };
    return gsap.to(o, {
      n: text.length, duration: text.length / cps, ease: 'none',
      onUpdate: () => { el.textContent = text.slice(0, o.n | 0); },
      onComplete: () => { el.textContent = text; }
    });
  }

  /* ------------------------------------------------------------------------
     1. Render content from data.js
     ------------------------------------------------------------------------ */
  const socials = [
    { label: 'GitHub', url: D.contact.github, ext: true },
    { label: 'LinkedIn', url: D.contact.linkedin, ext: true },
    { label: 'Mail', url: 'mailto:' + D.contact.email }
  ];
  const linkAttrs = s => `href="${esc(s.url)}"${s.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
  const socialLinks = sep => socials.map(s => `<a class="chr" data-chr="${s.label}" ${linkAttrs(s)}></a>`).join(sep);

  function render() {
    const fullName = D.name.first + D.name.second;
    $('#sr-title').textContent = `${D.fullName || fullName} — ${D.role}`;
    // every [data-resume] link downloads the PDF in /assets
    $$('[data-resume]').forEach(a => {
      if (!D.resume) { a.remove(); return; }
      a.href = D.resume.file; a.setAttribute('download', D.resume.downloadName || '');
      a.setAttribute('aria-label', 'Download resume (PDF)');
    });
    $('#hero-name').innerHTML = Array.from(fullName.toUpperCase()).map(c => `<span class="hn-ch"><span class="hn-in">${esc(c)}</span></span>`).join('')
      + '<span class="hn-ch hn-dot"><span class="hn-in">.</span></span>';
    $('#hero-tagline').innerHTML = D.hero.tagline.replace(/<br\s*\/?>/g, '<br> ');   // keeps a space when the break is hidden on phones
    $('#hero-socials').innerHTML = socialLinks('<span class="sep" aria-hidden="true">/</span>');
    $('#contact-socials').innerHTML = socialLinks('');
    $('#footer-socials').innerHTML = socialLinks('');

    $('#about-lead').innerHTML = D.about.lead;
    const sub = $('#about-sub');
    sub.innerHTML = `<span class="sr-only">${esc(D.about.sub)}</span><span class="ghost" aria-hidden="true">${esc(D.about.sub)}</span><span class="live caret" aria-hidden="true"></span>`;
    $('#about-meta').innerHTML = (D.about.meta || [['Role', D.role]])
      .map(([k, v]) => `<div>${k}<b data-final="${esc(v)}">${esc(v)}</b></div>`).join('');
    const img = new Image();
    img.onload = () => { $('#about-photo').src = img.src; $('#about-holo').classList.add('has-photo'); };
    if (D.about.photo) img.src = D.about.photo;

    const n = D.education.length;
    $('#edu-deck').innerHTML = D.education.map((e, i) => `
      <article class="edu-card">
        <header class="edu-card-head"><span>FILE ${pad(i + 1)}/${pad(n)}</span><span class="edu-stripes"></span><span>EDU</span></header>
        <div class="edu-years">${esc(e.years)}</div>
        <div class="edu-hand-row">
          <p class="edu-hand${e.school ? '' : ' alt'}">${esc(e.school || e.place.split('·')[0].trim())}</p>
          ${e.score ? `<span class="edu-stamp"><svg viewBox="0 0 120 60" aria-hidden="true"><path d="M8 32 C8 10 62 4 98 12 C122 18 116 50 74 54 C36 58 4 50 10 26" /></svg><b>${esc(e.score)}</b></span>` : ''}
        </div>
        <h3 class="edu-title">${esc(e.title)}</h3>
        <p class="edu-place">${esc(e.place)}</p>
        <p class="edu-notes">${esc(e.notes)}</p>
        <footer class="edu-card-foot"><span class="barcode"></span><span>REF-${(0x3a1 + i * 0x2f7).toString(16).toUpperCase()}</span></footer>
      </article>`).join('');
    $('#edu-leds').innerHTML = D.education.map(() => '<i></i>').join('');

    $('#exp-list').innerHTML = D.experience.map((x, i) => `
      <div class="exp-item" data-i="${i}">
        <button type="button" class="exp-row" aria-expanded="false" aria-controls="exp-body-${i}">
          <span class="exp-role">${esc(x.role)}</span>
          <span class="exp-org">${esc(x.org)}</span>
          <span class="exp-type">${esc(x.type)}</span>
          <span class="exp-date">${esc(x.date)}</span>
          <span class="plus" aria-hidden="true"></span>
        </button>
        <div class="exp-body" id="exp-body-${i}"><ul>${x.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
      </div>`).join('');

    $('#projects-list').innerHTML = D.projects.map((p, i) => `
      <button type="button" class="proj-item" data-i="${i}" aria-label="Open ${esc(p.name)}">
        <span class="proj-ch">CH ${pad(i + 1)}</span><span class="proj-name">${esc(p.name)}</span><span class="proj-year">${esc(p.date)}</span>
      </button>`).join('');

    $('#skills-text').textContent = D.skills.text;
    $('#skills-right').innerHTML = D.skills.groups.map((g, i) => `
      <div class="skill-group${i === 0 ? ' open' : ''}">
        <button type="button" class="skill-head" aria-expanded="${i === 0}"><span>${esc(g.name)}<span class="count">[${pad(g.items.length)}]</span></span><span class="plus" aria-hidden="true"></span></button>
        <div class="skill-body"><ul>${g.items.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
      </div>`).join('');

    $('#contact-avail').innerHTML = '&gt; ' + esc(D.contact.availability).replace('internships', '<em>internships</em>');
    $('#contact-mail').textContent = D.contact.email;
    $('#contact-mail').href = 'mailto:' + D.contact.email;
    if (D.contact.phone) $('#contact-socials').insertAdjacentHTML('beforeend', `<a class="chr" data-chr="Call" href="tel:${esc(D.contact.phone.replace(/[^\d+]/g, ''))}"></a>`);
    const fm = $('#footer-mail');
    fm.dataset.chr = D.contact.email; fm.href = 'mailto:' + D.contact.email;

    // sunset bands for the contact takeover: yellow → orange → pink → violet
    const stops = ['#ffd23f', '#ffb43a', '#ff9440', '#ff7a3d', '#ff5a55', '#ff3f6e', '#ff2f7a', '#e02a92', '#b02cc0', '#7b2ff7'];
    $('#contact-bands').innerHTML = stops.map(c => `<i style="background:${c}"></i>`).join('');
    $('#boot-stripes').innerHTML = '<i></i>'.repeat(14);

    const mq = ['End of transmission', '✦', 'Thanks for tuning in', '✦', `${fullName} · ${D.role}`, '✦', 'Insert coin to continue', '✦'];
    const half = mq.map(t => `<span>${esc(t)}</span>`).join('');
    $('#marquee').innerHTML = half + half;

    $('#footer-name').innerHTML = Array.from(fullName.toUpperCase()).map(c => `<span class="fc">${esc(c)}</span>`).join('') + '<span class="fc dot">.</span>';
  }

  /* HUD links: plain monospace text that decodes on hover */
  function buildChr(el) {
    const text = el.dataset.chr || '';
    const interactive = el.matches('a,button');
    if (interactive && !el.getAttribute('aria-label')) el.setAttribute('aria-label', text.replace(/[→←▲▸↓↗]/g, '').trim());
    el.innerHTML = `<span class="chr-t"${interactive ? ' aria-hidden="true"' : ''}>${esc(text)}</span>`;
    if (interactive && !isTouch) {
      const t = el.firstChild;
      el.addEventListener('pointerenter', () => scramble(t, text, { duration: 0.4 }));
    }
  }

  /* word split that keeps nested <em> (TreeWalker over text nodes) */
  function wrapWords(root, cls = 'word') {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    const words = [];
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        const s = document.createElement('span'); s.className = cls; s.textContent = tok;
        frag.appendChild(s); words.push(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    return words;
  }

  /* char split inside non-breaking word wrappers (keeps <em>) */
  function splitChars(root) {
    const chars = [];
    wrapWords(root, 'tw').forEach(w => {
      const txt = w.textContent; w.textContent = '';
      Array.from(txt).forEach(c => { const s = document.createElement('span'); s.className = 'tc'; s.textContent = c; w.appendChild(s); chars.push(s); });
    });
    return chars;
  }

  render();
  $$('[data-chr]').forEach(buildChr);

  /* ------------------------------------------------------------------------
     2. Lenis on the GSAP ticker
     ------------------------------------------------------------------------ */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    e.preventDefault();
    if (id === '#top') return lenis.scrollTo(0, { duration: 2.2 });
    const t = $(id); if (!t) return;
    const offset = id === '#contact' && !isMobile() ? innerHeight * 0.85 : 0;
    lenis.scrollTo(t, { duration: 1.6, offset });
  });

  // live HUD clock
  const clock = $('#hud-clock');
  const tick = () => { const d = new Date(); clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  tick(); setInterval(tick, 1000);

  /* ------------------------------------------------------------------------
     3. Reticle cursor
     ------------------------------------------------------------------------ */
  const reticle = $('#reticle'), reticleLabel = $('#reticle-label');
  const rx = gsap.quickTo(reticle, 'x', { duration: 0.25, ease: 'power3.out' });
  const ry = gsap.quickTo(reticle, 'y', { duration: 0.25, ease: 'power3.out' });
  if (!isTouch) {
    addEventListener('pointermove', e => { rx(e.clientX); ry(e.clientY); reticle.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => reticle.classList.remove('on'));
    document.addEventListener('pointerover', e => {
      reticle.classList.toggle('hot', !!e.target.closest('a, button, input, textarea, .tv-screen'));
    });
  }
  function label(text) {
    if (isTouch) return;
    if (!text) { reticle.classList.remove('labelled'); return; }
    if (reticleLabel.textContent !== text) reticleLabel.textContent = text;
    reticle.classList.add('labelled');
  }

  /* ------------------------------------------------------------------------
     4. Boot sequence → stripe wipe → hero
     ------------------------------------------------------------------------ */
  const bootLog = $('#boot-log'), bootFill = $('#boot-fill'), bootPct = $('#boot-pct');
  const bootText = [
    `${D.name.first + D.name.second}/OS  v26.11   (C) 2026 RETRO DYNAMICS`.toUpperCase(),
    'MEMORY TEST ............ 640K OK',
    `MOUNTING /PROJECTS ..... ${pad(D.projects.length)} FOUND`,
    'LINKING AI CORE ........ ONLINE',
    'CALIBRATING NEON GRID .. OK',
    'IGNITION SEQUENCE ...... READY'
  ].join('\n');
  const bp = { n: 0, pct: 0 };

  const heroLetters = $$('#hero-name .hn-in');
  const hudLabels = $$('#hero .hud-label');
  const heroBarText = $$('#hero-bar .chr-t');

  function heroIntro() {
    const tl = gsap.timeline();
    tl.fromTo(heroLetters, { yPercent: -140, opacity: 0, skewX: -30 }, { yPercent: 0, opacity: 1, skewX: 0, duration: 0.9, ease: 'back.out(1.7)', stagger: { each: 0.07, from: 'edges' } })
      .fromTo(heroLetters, { backgroundPosition: '200% 0%, 0% 0%' }, { backgroundPosition: '-100% 0%, 0% 0%', duration: 1.3, ease: 'power2.inOut', stagger: 0.05 }, '-=0.35')
      .add(() => typeText($('#hero-role'), D.role.toUpperCase(), 32), '-=1.3')
      .fromTo(['#hud-tl', '#hud-tr'], { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'steps(10)', stagger: 0.12 }, '<')
      .fromTo('#hero-bar', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: 'steps(8)' }, '<0.15')
      .add(() => [...hudLabels, ...heroBarText].forEach(el => scramble(el, el.textContent, { duration: 0.9 })), '<')
      .fromTo('#hero-scroll', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'steps(10)' }, '-=0.2');
    return tl;
  }

  const boot = gsap.timeline({ delay: 0.2 });
  boot
    .to('#boot-screen', { scaleX: 1, duration: 0.28, ease: 'power2.out' })
    .to('#boot-screen', { scaleY: 1, duration: 0.3, ease: 'power3.out' })
    .to(bp, { n: bootText.length, duration: 1.5, ease: 'none', onUpdate: () => { bootLog.textContent = bootText.slice(0, bp.n | 0) + '█'; } }, '+=0.05')
    .to(bp, { pct: 100, duration: 1.6, ease: 'steps(20)', onUpdate: () => { bootFill.style.transform = `scaleX(${bp.pct / 100})`; bootPct.textContent = pad(Math.round(bp.pct), 3) + '%'; } }, '<')
    .to('#boot-skip', { opacity: 0, duration: 0.2 })
    .to('#boot-screen', { scaleY: 0.006, filter: 'brightness(3)', duration: 0.2, ease: 'power3.in' }, '+=0.1')
    .to('#boot-screen', { scaleX: 0, duration: 0.16, ease: 'power3.in' })
    .set('#hero', { opacity: 1 })
    .to('#boot-stripes i', { scaleX: 0, duration: 0.55, ease: 'power3.inOut', stagger: { each: 0.03, from: 'center' } })
    .add(finishIntro, '-=0.15')
    .add(heroIntro(), '-=0.4');

  const skip = () => { if (boot.progress() < 1) boot.progress(1); };
  $('#boot-skip').addEventListener('click', skip);
  addEventListener('keydown', e => { if (!introDone && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) skip(); });
  if (reduced) boot.progress(1);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) skip(); });

  let introDone = false;
  function finishIntro() {
    if (introDone) return; introDone = true;
    document.body.classList.remove('is-loading');
    const b = $('#boot'); b && b.remove();
    lenis.start();
    requestAnimationFrame(setupScroll);
  }

  /* ------------------------------------------------------------------------
     5. Warp starfield (2D canvas)
     ------------------------------------------------------------------------ */
  const warp = (() => {
    const cv = $('#warp-canvas'), ctx = cv.getContext('2d');
    const N = isMobile() ? 220 : 420;
    const stars = Array.from({ length: N }, () => { const z = Math.random(); return { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z, pz: z }; });
    const COLS = ['#3ff2ff', '#ff2fb0', '#ffffff', '#ffd23f'];
    let running = false, last = 0, W = 0, H = 0, dpr = 1;
    const api = { speed: 0.2, start, stop };
    function resize() {
      dpr = 1;
      W = cv.width = Math.round(cv.clientWidth * dpr);
      H = cv.height = Math.round(cv.clientHeight * dpr);
    }
    function draw(now) {
      if (!running) return;
      const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now;
      const cx = W / 2, cy = H / 2, f = Math.max(W, H) * 0.5;
      ctx.fillStyle = '#0b0718'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, f * 0.9);
      g.addColorStop(0, `rgba(123,47,247,${0.12 + api.speed * 0.15})`); g.addColorStop(1, 'rgba(11,7,24,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      // move every star, then stroke in a few batched paths (colour × depth band)
      for (const s of stars) {
        s.pz = s.z;
        s.z -= api.speed * dt * 0.9;
        if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = s.pz = 1; }
      }
      for (let band = 0; band < 3; band++) {
        const zMin = band / 3, zMax = (band + 1) / 3;
        ctx.lineWidth = (3 - band) * 1.1 * dpr;
        ctx.globalAlpha = 1 - band * 0.3;
        for (let c = 0; c < COLS.length; c++) {
          ctx.strokeStyle = COLS[c];
          ctx.beginPath();
          for (let i = c; i < stars.length; i += COLS.length) {
            const s = stars[i];
            if (s.z < zMin || s.z >= zMax) continue;
            const sx = cx + (s.x / s.z) * f, sy = cy + (s.y / s.z) * f;
            if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) { s.z = 1; continue; }
            ctx.moveTo(cx + (s.x / s.pz) * f, cy + (s.y / s.pz) * f); ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    function start() { if (running) return; running = true; last = 0; resize(); requestAnimationFrame(draw); }
    function stop() { running = false; }
    addEventListener('resize', () => { if (running) resize(); });
    return api;
  })();

  /* ------------------------------------------------------------------------
     6. Scroll scenes (built after the intro)
     ------------------------------------------------------------------------ */
  function setupScroll() {
    heroScene();
    aboutScene();
    titleReveals();
    educationScene();
    experienceScene();
    projectsScene();
    tunnelScene();
    skillsScene();
    githubScene();
    linkedinScene();
    contactScene();
    footerScene();
    railScene();
    ScrollTrigger.refresh();
  }

  /* --- hero → warp jump ------------------------------------------------- */
  function heroScene() {
    const letters = $$('#hero-name .hn-ch'), mid = (letters.length - 1) / 2;
    const phraseEl = $('#warp-phrase'), phrase = D.hero.phrase.toUpperCase();
    // teletype decode: a head of random glyphs runs ahead of the locked text
    const decode = p => {
      const N = phrase.length, head = p * (N + 6);
      let out = '';
      for (let i = 0; i < N; i++) {
        const c = phrase[i];
        if (c === ' ') out += ' ';
        else if (i < head - 6) out += c;
        else if (i < head) out += rg();
        else out += ' ';   // non-breaking pad keeps the centred line from shifting
      }
      phraseEl.textContent = out;
    };
    decode(0);
    const dec = { p: 0 }, ex = { p: 0 };
    let covered = false, warpOn = false;

    const tl = gsap.timeline({ paused: true });
    tl.to('#hud-tl, #hud-tr', { y: -80, opacity: 0, duration: 0.14, ease: 'none' }, 0)
      .to('#hero-bar, #hero-scroll', { y: 80, opacity: 0, duration: 0.14, ease: 'none' }, 0)
      .to('#hero-role', { opacity: 0, letterSpacing: '1.2em', duration: 0.16, ease: 'none' }, 0)
      .to(letters, { x: i => (i - mid) * innerWidth * 0.2, z: 560, opacity: 0, duration: 0.32, ease: 'power2.in' }, 0.04)
      .fromTo('#warp-canvas', { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'none' }, 0.22)
      .to(dec, { p: 1, duration: 0.34, ease: 'none', onUpdate: () => decode(dec.p) }, 0.5)
      .set({}, {}, 1);

    ScrollTrigger.create({
      trigger: '#scroll-wrap', start: 'top top', end: () => '+=' + innerHeight * 2.2, scrub: 0.6,
      animation: tl, invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress;
        if (window.heroShader) window.heroShader.scroll = clamp01(p / 0.45);
        warp.speed = 0.15 + Math.pow(p, 1.3) * 2.2;
        warpOn = p > 0.18;
        if (warpOn && !covered) warp.start(); else warp.stop();
        // once the starfield is opaque the horizon underneath is invisible: pause it
        if (window.heroShader && !covered) window.heroShader.setVisible(p < 0.42);
      }
    });

    // content rises over the stage: phrase erases, stage dims
    gsap.timeline({ scrollTrigger: { trigger: '#content', start: 'top bottom', end: 'top top', scrub: true } })
      .to('#stage-dim', { opacity: 0.85, ease: 'none', duration: 1 }, 0)
      .to('#hero', { scale: 0.94, ease: 'none', duration: 1 }, 0)
      .to(ex, { p: 1, duration: 0.45, ease: 'none', onUpdate: () => decode(1 - ex.p) }, 0);

    ScrollTrigger.create({
      trigger: '#content', start: 'top top',
      onEnter() { covered = true; warp.stop(); window.heroShader && window.heroShader.setVisible(false); },
      onLeaveBack() { covered = false; if (warpOn) warp.start(); }
    });
  }

  /* --- about: block-cursor word wipe, teletype, CRT power-on ------------- */
  function aboutScene() {
    wrapWords($('#about-lead')).forEach(w => {
      const final = w.closest('em') ? '#ff7a3d' : '#f2eaff';
      gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 82%', end: 'top 64%', scrub: true } })
        .fromTo(w, { backgroundSize: '0% 100%', backgroundPosition: '0% 0%' }, { backgroundSize: '100% 100%', duration: 0.5, ease: 'none' })
        .set(w, { color: final, backgroundPosition: '100% 0%' })
        .to(w, { backgroundSize: '0% 100%', duration: 0.5, ease: 'none' });
    });

    const live = $('#about-sub .live');
    ScrollTrigger.create({
      trigger: '#about-sub', start: 'top 85%', once: true,
      onEnter: () => typeText(live, D.about.sub, 90).eventCallback('onComplete', () => { live.textContent = D.about.sub; live.classList.add('done'); })
    });

    $$('#about-meta > div').forEach((cell, i) => {
      const b = $('b', cell);
      gsap.fromTo(cell, { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'steps(8)', delay: i * 0.15,
        scrollTrigger: { trigger: '#about-meta', start: 'top 90%' },
        onStart: () => scramble(b, b.dataset.final, { duration: 0.9 })
      });
    });

    // the hologram itself lives in js/holo.js; here its HUD frame just brackets in
    gsap.fromTo('#about-holo .hc', { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'steps(6)', stagger: 0.08, scrollTrigger: { trigger: '#about-holo', start: 'top 72%' } });
    if (!isMobile()) gsap.fromTo('#about-holo', { y: 60 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* --- section titles: speed-italic swoosh; eyebrows decode ------------- */
  function titleReveals() {
    $$('.section-title').forEach(t => {
      const chars = splitChars(t);
      gsap.fromTo(chars, { opacity: 0, x: -50, skewX: -40 }, {
        opacity: 1, x: 0, skewX: 0, duration: 0.6, ease: 'power3.out', stagger: 0.025,
        scrollTrigger: { trigger: t, start: 'top 85%', onEnter: () => t.classList.add('is-in') }
      });
    });
    $$('.eyebrow').forEach(e => {
      const txt = e.textContent;
      ScrollTrigger.create({ trigger: e, start: 'top 90%', once: true, onEnter: () => scramble(e, txt, { duration: 0.8 }) });
    });
  }

  /* --- education: pinned rolodex flip --------------------------------- */
  function educationScene() {
    const cards = $$('.edu-card'), n = cards.length;
    const leds = $$('#edu-leds i'), count = $('#edu-count');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      let shown = -1;
      const update = f => {
        cards.forEach((c, i) => {
          const flip = clamp01(f - i);
          const depth = Math.max(0, i - f);
          gsap.set(c, {
            rotationX: flip * 105, y: -depth * 26 - flip * 40, z: -depth * 70,
            opacity: flip > 0 ? 1 - clamp01((flip - 0.5) / 0.5) : 1 - Math.min(depth, 3) * 0.25,
            zIndex: n - i
          });
        });
        const k = Math.min(n - 1, Math.round(f));
        if (k !== shown) {
          shown = k;
          leds.forEach((l, i) => l.classList.toggle('on', i <= k));
          scramble(count, `FILE ${pad(k + 1)}`, { duration: 0.35, chars: FLAP });
        }
      };
      const o = { f: 0 };
      update(0);
      gsap.to(o, {
        f: n - 1, ease: 'none', onUpdate: () => update(o.f),
        scrollTrigger: { trigger: '#edu-pin', start: 'top top', end: () => '+=' + innerHeight * 0.85 * n, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      return () => gsap.set(cards, { clearProps: 'all' });
    });
    mm.add('(max-width: 860px)', () => {
      cards.forEach(card => gsap.fromTo(card, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'steps(10)', scrollTrigger: { trigger: card, start: 'top 88%' } }));
    });
  }

  /* --- experience: split-flap dates + accordion ------------------------ */
  function toggleHeight(body, open, onDone) {
    gsap.to(body, { height: open ? body.scrollHeight : 0, duration: 0.45, ease: 'power3.inOut', onComplete: () => { if (open) body.style.height = 'auto'; ScrollTrigger.refresh(); onDone && onDone(); } });
  }

  function experienceScene() {
    const items = $$('.exp-item');
    items.forEach((item, i) => {
      const row = $('.exp-row', item), body = $('.exp-body', item), date = $('.exp-date', item);
      const dateText = D.experience[i].date;
      ScrollTrigger.create({
        trigger: item, start: 'top center', end: 'bottom center',
        onToggle: s => {
          item.classList.toggle('active-row', s.isActive);
          if (s.isActive) scramble(date, dateText, { duration: 0.55, chars: FLAP });
        }
      });
      row.addEventListener('click', () => {
        const open = !item.classList.contains('open');
        if (open && body.style.height === 'auto') return;
        if (!open) body.style.height = body.scrollHeight + 'px';
        item.classList.toggle('open', open);
        row.setAttribute('aria-expanded', open);
        toggleHeight(body, open);
        if (open) gsap.fromTo($$('li', body), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, ease: 'steps(4)', stagger: 0.09, delay: 0.15 });
        label(open ? 'CLOSE −' : 'OPEN +');
      });
      row.addEventListener('pointermove', () => label(item.classList.contains('open') ? 'CLOSE −' : 'OPEN +'));
      row.addEventListener('pointerleave', () => label(''));
    });
    gsap.fromTo(items, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'steps(14)', stagger: 0.12,
      scrollTrigger: { trigger: '#exp-list', start: 'top 82%' },
      onComplete: () => gsap.set(items, { clearProps: 'clipPath' })
    });
  }

  /* --- projects: drum list, CRT set with static, detail ---------------- */
  let openProject = () => {};
  function projectsScene() {
    const items = $$('.proj-item');
    const tv = $('#proj-tv'), tvImg = $('#tv-img'), osd = $('#tv-osd'), tvName = $('#tv-name'), screen = $('#tv-screen');
    D.projects.forEach(p => { const i = new Image(); i.src = p.cover; });

    // static noise bursts on channel change
    const noise = $('#tv-noise'), nctx = noise.getContext('2d');
    const nimg = nctx.createImageData(noise.width, noise.height);
    let noiseUntil = 0, noiseLive = false;
    function noiseFrame(now) {
      const d = nimg.data;
      for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = v * 0.9; d[i + 1] = v * 0.85; d[i + 2] = v; d[i + 3] = 255; }
      // a darker rolling band
      const band = ((now / 4) % noise.height) | 0;
      for (let y = band; y < Math.min(noise.height, band + 14); y++) for (let x = 0; x < noise.width; x++) { const k = (y * noise.width + x) * 4; d[k] *= 0.4; d[k + 1] *= 0.4; d[k + 2] *= 0.4; }
      nctx.putImageData(nimg, 0, 0);
      if (now < noiseUntil) requestAnimationFrame(noiseFrame);
      else { noiseLive = false; gsap.to(noise, { opacity: 0, duration: 0.15, ease: 'steps(3)' }); }
    }
    function staticBurst(ms = 320) {
      noiseUntil = performance.now() + ms;
      gsap.set(noise, { opacity: 1 });
      if (!noiseLive) { noiseLive = true; requestAnimationFrame(noiseFrame); }
    }

    let active = -1;
    function channel(i) {
      const p = D.projects[i];
      staticBurst(reduced ? 0 : 300);
      gsap.delayedCall(0.14, () => { tvImg.src = p.cover; tvImg.alt = p.name; tvName.textContent = p.name; });
      scramble(osd, 'CH ' + pad(i + 1), { duration: 0.4, chars: FLAP });
      gsap.fromTo('#tv-roll', { yPercent: -14 }, { yPercent: 0, duration: 0.4, ease: 'steps(6)', delay: 0.1 });
    }
    function activate(i) {
      if (i === active) return;
      active = i;
      items.forEach((el, k) => el.classList.toggle('active', k === i));
      if (i > -1 && !isMobile()) channel(i);
    }

    // drum: rows tilt away from the centre line like a slot-machine reel
    const qr = items.map(el => gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' }));
    const qo = items.map(el => gsap.quickTo(el, 'opacity', { duration: 0.4, ease: 'power2.out' }));
    function onScroll() {
      const vh = innerHeight; let best = -1, bestD = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dd = (r.top + r.height / 2 - vh / 2) / (vh / 2);
        const d = Math.max(-1, Math.min(1, dd));
        qr[i](-d * (isMobile() ? 25 : 48));
        qo[i](1 - Math.abs(d) * 0.65);
        if (Math.abs(dd) < bestD) { bestD = Math.abs(dd); best = i; }
      });
      activate(bestD < 0.4 ? best : -1);
    }
    lenis.on('scroll', onScroll); onScroll();

    if (!isMobile()) ScrollTrigger.create({ trigger: '#projects-list', start: 'top 55%', end: 'bottom 45%', toggleClass: { targets: tv, className: 'visible' } });

    screen.addEventListener('pointermove', () => label('▶ PLAY'));
    screen.addEventListener('pointerleave', () => label(''));
    screen.addEventListener('click', () => active > -1 && openProject(active));
    items.forEach((el, i) => el.addEventListener('click', () => {
      if (i === active || isMobile()) return openProject(i);
      lenis.scrollTo(el, { offset: -innerHeight / 2 + el.offsetHeight / 2, duration: 1.2 });
    }));

    openProject = projectDetail(items);
  }

  /* CRT power-on dialog */
  function projectDetail(items) {
    const detail = $('#detail'), fade = $('#page-fade');
    const tEl = $('#detail-title');
    const parts = ['#detail-ch', '#detail-year', '#detail-desc', '#detail-points', '#detail-tags', '#detail-links', '#detail-back'];
    const media = $('#detail-media'), mImg = $('#detail-img');
    let current = -1, busy = false;

    function fill(p, i) {
      tEl.textContent = '';
      $('#detail-ch').textContent = `CH ${pad(i + 1)} // NOW PLAYING`;
      $('#detail-year').textContent = p.date;
      $('#detail-desc').textContent = p.desc;
      $('#detail-points').innerHTML = p.points.map(x => `<li>${esc(x)}</li>`).join('');
      $('#detail-tags').innerHTML = p.tags.map(x => `<span>${esc(x)}</span>`).join('');
      $('#detail-links').innerHTML = p.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`).join('');
      mImg.src = p.cover; mImg.alt = p.name + ' cover';
    }
    function open(i) {
      if (busy || current > -1) return; busy = true; current = i;
      const p = D.projects[i]; fill(p, i);
      lenis.stop(); label('');
      $('#proj-tv').classList.remove('visible');
      $$('#rail, #readout').forEach(e => e.classList.remove('show'));
      detail.removeAttribute('inert'); detail.setAttribute('aria-hidden', 'false');
      detail.scrollTop = 0;
      gsap.set(parts, { opacity: 0 }); gsap.set(media, { opacity: 0 });
      gsap.timeline({ onComplete() { busy = false; $('#detail-back').focus({ preventScroll: true }); } })
        .to(fade, { opacity: 1, duration: 0.35, ease: 'steps(4)' }, 0)
        .add(() => detail.classList.add('active'), 0.2)
        .fromTo(detail, { opacity: 1, scaleX: 0, scaleY: 0.006, filter: 'brightness(5)' }, { scaleX: 1, duration: 0.25, ease: 'power2.out' }, 0.2)
        .to(detail, { scaleY: 1, filter: 'brightness(1)', duration: 0.35, ease: 'power3.out' }, 0.45)
        .add(() => scramble(tEl, p.name, { duration: 0.8 }), 0.8)
        .fromTo(parts, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: 'steps(5)', stagger: 0.08 }, 0.85)
        .fromTo(media, { opacity: 0, scaleY: 0.02, scaleX: 0.6 }, { opacity: 1, scaleY: 0.02, scaleX: 1, duration: 0.18, ease: 'none' }, 0.9)
        .to(media, { scaleY: 1, duration: 0.35, ease: 'power3.out' }, 1.08)
        .add(() => { busy = false; }, 1.2);
      history.pushState({ project: p.id }, '', '#' + p.id);
    }
    function close(fromPop) {
      if (busy || current < 0) return; busy = true;
      gsap.timeline({
        onComplete() {
          detail.classList.remove('active');
          detail.setAttribute('inert', ''); detail.setAttribute('aria-hidden', 'true');
          gsap.set(detail, { opacity: 0, scaleX: 1, scaleY: 1, filter: 'none' });
          items[current].focus({ preventScroll: true });
          current = -1; busy = false; lenis.start(); ScrollTrigger.refresh();
        }
      })
        .to(detail, { scaleY: 0.006, filter: 'brightness(5)', duration: 0.24, ease: 'power3.in' }, 0)
        .to(detail, { scaleX: 0, duration: 0.18, ease: 'power3.in' }, 0.24)
        .to(fade, { opacity: 0, duration: 0.3, ease: 'steps(4)' }, 0.35);
      if (!fromPop && location.hash) history.back();
    }
    $('#detail-back').addEventListener('click', () => close());
    addEventListener('keydown', e => {
      if (current < 0) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = $$('button, a[href]', detail); const a = f[0], b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    });
    addEventListener('popstate', () => { if (current > -1) close(true); });
    return open;
  }

  /* --- hyperspace tunnel: fly through neon frames past the covers ------ */
  function tunnelScene() {
    if (isMobile()) return;
    const world = $('#tunnel-world'), vel = $('#tunnel-vel');
    const S = 620;
    const els = [];
    D.projects.forEach((p, k) => {
      const c = document.createElement('div'); c.className = 't-card';
      c.innerHTML = `<img src="${esc(p.cover)}" alt=""><span>CH ${pad(k + 1)} · ${esc(p.name)}</span>`;
      world.appendChild(c);
      const side = k % 2 ? 1 : -1;
      els.push({ el: c, z: -(k + 1.2) * S * 1.5, x: side * (0.24 + (k % 3) * 0.03), y: [-0.16, 0.12, -0.04][k % 3], ry: -side * 18 });
    });
    const depth = (D.projects.length + 1.2) * S * 1.5;
    const rings = Math.ceil(depth / S) + 4;
    for (let r = 0; r < rings; r++) {
      const ring = document.createElement('div'); ring.className = 't-ring' + (r % 2 ? ' c' : '');
      world.appendChild(ring);
      els.push({ el: ring, z: -r * S, x: 0, y: 0, ry: 0, ring: true });
    }
    const phrase = $('#tunnel-phrase');
    const words = wrapWords(phrase);
    let lastP = 0;

    function update(p) {
      const cam = p * (depth + 600) - 300;
      const W = innerWidth, H = innerHeight;
      els.forEach(it => {
        const zr = it.z + cam;
        const o = Math.min(clamp01((zr + 5200) / 1600), clamp01((820 - zr) / 380));
        if (o <= 0) { it.el.style.visibility = 'hidden'; return; }
        it.el.style.visibility = 'visible';
        it.el.style.opacity = o;
        it.el.style.transform = `translate(-50%, -50%) translate3d(${it.x * W}px, ${it.y * H}px, ${zr}px) rotateY(${it.ry}deg)` + (it.ring ? ` rotateZ(${(it.z / S) * 4 + p * 30}deg)` : '');
      });
      const g = (p - 0.18) / 0.62;
      phrase.style.opacity = g <= 0 || g >= 1 ? 0 : Math.min(1, g / 0.08, (1 - g) / 0.15);
      const lit = Math.floor(clamp01(g / 0.7) * (words.length + 1));
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
      vel.textContent = Math.min(0.99, 0.08 + p * 0.78 + Math.abs(p - lastP) * 12).toFixed(2);
      lastP = p;
    }
    update(0);
    ScrollTrigger.create({ trigger: '#tunnel', start: 'top top', end: 'bottom bottom', onUpdate: s => update(s.progress) });
  }

  /* --- skills: oscilloscope + accordion with chip pop-in --------------- */
  function skillsScene() {
    const groups = $$('.skill-group');
    const pop = body => gsap.fromTo($$('li', body), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.5)', stagger: 0.035, delay: 0.12 });
    groups.forEach(g => {
      const body = $('.skill-body', g), head = $('.skill-head', g);
      if (g.classList.contains('open')) body.style.height = 'auto';
      head.addEventListener('click', () => {
        if (g.classList.contains('open')) {
          body.style.height = body.scrollHeight + 'px';
          g.classList.remove('open'); head.setAttribute('aria-expanded', 'false'); toggleHeight(body, false); return;
        }
        groups.forEach(o => {
          if (o !== g && o.classList.contains('open')) {
            const b = $('.skill-body', o); b.style.height = b.scrollHeight + 'px';
            o.classList.remove('open'); $('.skill-head', o).setAttribute('aria-expanded', 'false'); toggleHeight(b, false);
          }
        });
        g.classList.add('open'); head.setAttribute('aria-expanded', 'true'); toggleHeight(body, true); pop(body);
      });
    });
    gsap.fromTo(groups, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'steps(10)', stagger: 0.1, scrollTrigger: { trigger: '#skills-right', start: 'top 80%', onEnter: () => pop($('.skill-group.open .skill-body')) }, onComplete: () => gsap.set(groups, { clearProps: 'clipPath' }) });

    // oscilloscope: amplitude and frequency follow scroll velocity
    const cv = $('#scope-canvas'), ctx = cv.getContext('2d');
    let running = false, v = 0, amp = 0.2, ph = 0, W = 0, H = 0, dpr = 1;
    lenis.on('scroll', e => { v = e.velocity || 0; });
    function resize() { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = cv.clientWidth * dpr; H = cv.height = cv.clientHeight * dpr; }
    function draw() {
      if (!running) return;
      v *= 0.92;
      amp += ((0.16 + Math.min(Math.abs(v) / 25, 0.75)) - amp) * 0.08;
      ph += 0.05 + Math.min(Math.abs(v), 60) * 0.006;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(107,255,154,.12)'; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += W / 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += H / 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const freq = 2 + Math.min(Math.abs(v) / 8, 6);
      ctx.strokeStyle = '#6bff9a'; ctx.lineWidth = 2 * dpr; ctx.shadowColor = '#6bff9a'; ctx.shadowBlur = 10 * dpr;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const t = x / W;
        const y = H / 2 + Math.sin(t * Math.PI * 2 * freq + ph) * amp * H * 0.42 * (0.75 + 0.25 * Math.sin(t * Math.PI * 3 + ph * 0.3));
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }
    addEventListener('resize', () => running && resize());
    ScrollTrigger.create({
      trigger: '#skills', start: 'top bottom', end: 'bottom top',
      onToggle: s => { running = s.isActive; if (running) { resize(); requestAnimationFrame(draw); } }
    });
  }

  /* --- GitHub: live profile stats + contribution calendar -------------- */
  function githubScene() {
    const user = D.github && D.github.user;
    const section = $('#github');
    if (!user) { section.remove(); return; }
    const status = $('#gh-status'), cal = $('#gh-cal');
    $('#gh-profile').href = `https://github.com/${encodeURIComponent(user)}`;
    const setStatus = (text, ok) => { status.classList.toggle('bad', !ok); status.innerHTML = `<span class="blink">●</span> ${esc(text)}`; };

    // 30-minute session cache keeps visitors well under GitHub's 60 requests/hour limit
    async function getJSON(url) {
      const key = 'gh:' + url;
      try { const c = JSON.parse(sessionStorage.getItem(key)); if (c && Date.now() - c.t < 1800000) return c.d; } catch {}
      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch {}
      return d;
    }

    let inView = false, cells = [], total = null, revealed = false;
    function reveal() {
      if (revealed || !inView || !cells.length) return;
      revealed = true;
      gsap.fromTo(cells, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'steps(3)', stagger: { each: reduced ? 0 : 0.0022 } });
      if (total != null) {
        const o = { n: 0 }, el = $('#gh-total');
        gsap.to(o, { n: total, duration: reduced ? 0 : 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = pad(Math.round(o.n), 4); } });
      }
    }
    ScrollTrigger.create({ trigger: section, start: 'top 70%', once: true, onEnter: () => { inView = true; reveal(); } });

    const base = 'https://api.github.com/users/' + encodeURIComponent(user);
    Promise.allSettled([
      getJSON(base),
      getJSON(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`)
    ]).then(([prof, contrib]) => {
      if (prof.status === 'fulfilled') {
        scramble($('#gh-repos'), pad(prof.value.public_repos), { duration: 0.6, chars: FLAP });
        scramble($('#gh-followers'), pad(prof.value.followers), { duration: 0.6, chars: FLAP });
      }
      if (contrib.status === 'fulfilled' && contrib.value.contributions) {
        const days = contrib.value.contributions;
        total = contrib.value.total ? (contrib.value.total.lastYear ?? Object.values(contrib.value.total)[0]) : days.reduce((s, d) => s + d.count, 0);
        let best = 0, run = 0;
        days.forEach(d => { run = d.count > 0 ? run + 1 : 0; best = Math.max(best, run); });
        $('#gh-streak').textContent = best + (best === 1 ? ' day' : ' days');
        const offset = new Date(days[0].date + 'T00:00:00').getDay();
        cal.innerHTML = '<i class="pad"></i>'.repeat(offset) + days.map(d =>
          `<i class="l${d.level}" title="${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}"></i>`).join('');
        cells = $$('i:not(.pad)', cal);
        gsap.set(cells, { opacity: 0 });
        cal.parentElement.scrollLeft = cal.parentElement.scrollWidth;   // narrow screens: start on the most recent weeks
        if (!inView) $('#gh-total').textContent = pad(total, 4);
      } else {
        cal.innerHTML = '<p class="gh-offline">Calendar feed offline. Open the profile to see contributions.</p>';
      }
      const ok = prof.status === 'fulfilled' || contrib.status === 'fulfilled';
      const d = new Date();
      setStatus(ok ? `Uplink established · @${user} · synced ${pad(d.getHours())}:${pad(d.getMinutes())}` : 'Uplink lost · GitHub unreachable right now', ok);
      reveal();
      ScrollTrigger.refresh();
    });
  }

  /* --- LinkedIn: transmissions carousel ------------------------------- */
  function linkedinScene() {
    const section = $('#linkedin');
    const posts = (D.linkedin && D.linkedin.posts) || [];
    if (!posts.length) { section.remove(); return; }
    const track = $('#li-track'), count = $('#li-count'), tape = $('#li-tape-fill');
    $('#li-profile').href = D.contact.linkedin;
    const fmt = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    track.innerHTML = posts.map((p, i) => `
      <article class="li-card${p.repost ? ' repost' : ''}" aria-roledescription="slide" aria-label="${i + 1} of ${posts.length}">
        <header class="li-card-bar"><span>TX-${pad(i + 1)}</span><span>${fmt(p.date)}</span><span class="li-in">in</span></header>
        <div class="li-card-body">
          <p class="li-org">${p.repost ? '↻ ' : ''}${esc(p.org)}</p>
          <h3 class="li-title">${esc(p.title)}</h3>
          <p class="li-text">${esc(p.text)}</p>
          <div class="li-tags">${(p.tags || []).map(t => `<span>#${esc(t.replace(/\s+/g, ''))}</span>`).join('')}</div>
        </div>
        <a class="li-read" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Read on LinkedIn ↗</a>
      </article>`).join('');
    const cards = $$('.li-card', track);
    let cur = -1, idle = 0, live = false;

    // active card = the one nearest the track's left edge
    function sync() {
      const left = track.scrollLeft, max = track.scrollWidth - track.clientWidth;
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - cards[0].offsetLeft - left); if (d < bd) { bd = d; best = i; } });
      if (max > 0 && left >= max - 4) best = cards.length - 1;
      tape.style.transform = `scaleX(${max > 0 ? left / max : 1})`;
      if (best !== cur) {
        cur = best;
        cards.forEach((c, i) => c.classList.toggle('active', i === cur));
        scramble(count, `TX ${pad(cur + 1)}/${pad(cards.length)}`, { duration: 0.3, chars: FLAP });
      }
    }
    const go = i => {
      i = (i + cards.length) % cards.length;
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    };
    $('#li-prev').addEventListener('click', () => { go(cur - 1); idle = 0; });
    $('#li-next').addEventListener('click', () => { go(cur + 1); idle = 0; });
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    });
    // drag to scroll with a mouse (touch already swipes natively)
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('grabbing'); });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('grabbing'); if (moved) go(cur); });
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    sync();

    // auto-advance every 6s while on screen and not hovered
    ScrollTrigger.create({ trigger: section, start: 'top 80%', end: 'bottom 20%', onToggle: s => { live = s.isActive; } });
    section.addEventListener('pointerenter', () => { idle = -1e9; });
    section.addEventListener('pointerleave', () => { idle = 0; });
    if (!reduced) setInterval(() => { if (live && !down && ++idle >= 6) { idle = 0; go(cur + 1); } }, 1000);

    gsap.fromTo(cards, { clipPath: 'inset(0 0 100% 0)', y: 30 }, {
      clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.6, ease: 'steps(10)', stagger: 0.12,
      scrollTrigger: { trigger: track, start: 'top 82%' }, onComplete: () => gsap.set(cards, { clearProps: 'clipPath' })
    });
  }

  /* --- contact: sunset bands sweep in, terminal powers on --------------- */
  function contactScene() {
    const form = $('#contact-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim(), msg = form.message.value.trim();
      if (!msg) { form.message.focus(); return; }
      location.href = `mailto:${D.contact.email}?subject=${encodeURIComponent('Portfolio enquiry' + (name ? ' from ' + name : ''))}&body=${encodeURIComponent(msg)}`;
    });
    const bands = $$('#contact-bands i');
    if (isMobile()) {
      gsap.fromTo(bands, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: '#contact', start: 'top 75%' } });
      gsap.from(['#contact-title', '#contact-term', '#contact-bottom'], { y: 40, opacity: 0, duration: 0.8, ease: 'steps(8)', stagger: 0.12, scrollTrigger: { trigger: '#contact-pin', start: 'top 60%' } });
      return;
    }
    gsap.timeline({ scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom bottom', scrub: true } })
      .fromTo(bands, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'none', stagger: 0.025 }, 0)
      .fromTo('#contact-title', { xPercent: -120, skewX: -35 }, { xPercent: 0, skewX: 0, duration: 0.2, ease: 'power3.out' }, 0.36)
      .fromTo('#contact-term', { opacity: 0, scaleX: 0.1, scaleY: 0.01 }, { opacity: 1, scaleX: 1, duration: 0.08, ease: 'none' }, 0.48)
      .to('#contact-term', { scaleY: 1, duration: 0.1, ease: 'power2.out' }, 0.56)
      .fromTo('#contact-bottom', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.14, ease: 'steps(10)' }, 0.6)
      .set({}, {}, 1);
  }

  /* --- footer: name drops in with a bounce ----------------------------- */
  function footerScene() {
    const fname = $('#footer-name');
    const fit = () => {
      fname.style.fontSize = '15vw';
      const w = fname.scrollWidth;
      fname.style.fontSize = (15 * innerWidth * 0.92 / w) + 'vw';
    };
    fit(); addEventListener('resize', fit);
    document.fonts && document.fonts.ready.then(fit);
    const chars = $$('.fc', fname);
    gsap.fromTo(chars, { yPercent: -160, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', stagger: 0.07, scrollTrigger: { trigger: '#footer', start: 'top 55%' } });
    gsap.fromTo('.footer-sun', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#footer', start: 'top bottom', end: 'top top', scrub: true } });
    const links = $$('#footer .footer-top .chr-t');
    ScrollTrigger.create({ trigger: '#footer', start: 'top 60%', once: true, onEnter: () => links.forEach(l => scramble(l, l.textContent, { duration: 0.9 })) });
  }

  /* --- HUD rail + T+ readout ------------------------------------------ */
  function railScene() {
    const rail = $('#rail'), bar = $('#rail-bar'), lab = $('#rail-label'), out = $('#readout'), pct = $('#readout-pct');
    const secs = $$('[data-label]').filter(s => getComputedStyle(s).display !== 'none' && s.id !== 'contact');
    let segs = [], zoneA = 0, zoneB = 1, curName = '';
    function measure() {
      const starts = secs.map(s => s.getBoundingClientRect().top + scrollY);
      const lastS = secs[secs.length - 1];
      zoneA = starts[0]; zoneB = lastS.getBoundingClientRect().top + scrollY + lastS.offsetHeight;
      bar.innerHTML = '';
      segs = secs.map((s, i) => {
        const end = i < secs.length - 1 ? starts[i + 1] : zoneB;
        const seg = document.createElement('div'); seg.className = 'rail-seg';
        seg.style.flex = String((end - starts[i]) / (zoneB - zoneA));
        seg.innerHTML = '<div class="rail-fill"></div>';
        seg.addEventListener('click', () => lenis.scrollTo(s, { duration: 1.2 }));
        bar.appendChild(seg);
        return { fill: seg.firstChild, a: starts[i], b: end, name: s.dataset.label };
      });
    }
    ScrollTrigger.addEventListener('refresh', measure); measure();
    lenis.on('scroll', () => {
      const y = scrollY + innerHeight * 0.5;
      const p = (y - zoneA) / (zoneB - zoneA);
      const show = p > 0 && p < 1 && !$('#detail').classList.contains('active');
      rail.classList.toggle('show', show); out.classList.toggle('show', show);
      pct.textContent = pad(Math.round(scrollY / (document.documentElement.scrollHeight - innerHeight) * 100), 3);
      segs.forEach(s => {
        s.fill.style.height = clamp01((y - s.a) / (s.b - s.a)) * 100 + '%';
        if (y >= s.a && y < s.b && curName !== s.name) { curName = s.name; scramble(lab, s.name, { duration: 0.35 }); }
      });
      lab.style.top = clamp01(p) * 100 + '%';
    });
  }
})();
