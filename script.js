/* ============================================================
   Odilbek-Baxtiyor Mebel — скрипт
   1. CONFIG: тексты и ссылки (редактируйте здесь)
   2. Переводы RU / UZ
   3. Ссылки, копирование номера, тосты
   4. Появление блоков при прокрутке
   5. Фон: блики воды (каустика) и мыльные пузыри
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Настройки ----------
     Пустая ссылка = при нажатии показывается «Ссылка пока не добавлена». */
  var CONFIG = {
    name: 'Odilbek-Baxtiyor Mebel',
    desc: {
      ru: 'Мебель для ванных комнат. Свяжитесь с нами удобным для вас способом.',
      uz: 'Hammom uchun mebel. Siz uchun qulay usulda biz bilan bog‘laning.'
    },
    telegram: '@OBM_mebel',             // @username или https://t.me/username (личные сообщения)
    phone: '+998995 513 00 77',         // например: +998 90 123 45 67
    channel: 'https://t.me/+eXY5e9Ojc9YwOTYy', // @channel или https://t.me/channel
    channelDesc: {
      ru: 'Новинки мебели для ванных комнат',
      uz: 'Hammom mebellari yangiliklari'
    },
    developerUrl: 'https://webv-2.vercel.app'   // кнопка «Разработчик» в футере
  };

  /* ---------- 2. Переводы ---------- */
  var I18N = {
    ru: {
      langAria: 'Язык страницы',
      tgTitle: 'Telegram', tgSub: 'Написать в личные сообщения',
      telTitle: 'Позвонить', telPh: '+998 XX XXX XX XX', copyAria: 'Скопировать номер',
      chTitle: 'Telegram-канал',
      devBtn: 'Разработчик',
      pending: 'Ссылка пока не добавлена', copied: 'Номер скопирован', copyFail: 'Не удалось скопировать номер',
      metaDesc: 'Мебель для ванных комнат — Odilbek-Baxtiyor Mebel: связь в Telegram, звонок и Telegram-канал.'
    },
    uz: {
      langAria: 'Sahifa tili',
      tgTitle: 'Telegram', tgSub: 'Shaxsiy xabar yozing',
      telTitle: 'Qo‘ng‘iroq qilish', telPh: '+998 XX XXX XX XX', copyAria: 'Raqamni nusxalash',
      chTitle: 'Telegram kanal',
      devBtn: 'Dasturchi',
      pending: 'Havola hali qo‘shilmagan', copied: 'Raqam nusxalandi', copyFail: 'Raqamni nusxalab bo‘lmadi',
      metaDesc: 'Hammom uchun mebel — Odilbek-Baxtiyor Mebel: Telegram, qo‘ng‘iroq va Telegram kanal.'
    }
  };

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var lang = 'ru';
  if (location.protocol === 'file:') root.classList.add('file');

  function q(s) { return document.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function t(k) { return I18N[lang][k]; }

  var brand = q('#brand'), desc = q('#desc'), chDesc = q('#chDesc'), telNum = q('#telNum');
  var logo = q('#logo'), badge = q('#badge'), meta = q('meta[name="description"]');
  var toastEl = q('#toast'), copyBtn = q('#copyBtn');

  /* ---------- 3. Ссылки ---------- */
  function tgUrl(v) {
    v = (v || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return 'https://t.me/' + v.replace(/^@/, '').replace(/^(https?:\/\/)?t\.me\//i, '');
  }
  function telHref(v) {
    var d = (v || '').replace(/[^\d+]/g, '');
    return d ? 'tel:' + d : '';
  }
  function setLink(el, href, external) {
    if (href) {
      el.setAttribute('href', href);
      el.removeAttribute('data-pending');
      if (external) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener noreferrer'); }
    } else {
      el.setAttribute('href', '#');
      el.setAttribute('data-pending', '');
      el.removeAttribute('target');
    }
  }
  setLink(q('#tgLink'), tgUrl(CONFIG.telegram), true);
  setLink(q('#telLink'), telHref(CONFIG.phone), false);
  setLink(q('#chLink'), tgUrl(CONFIG.channel), true);
  setLink(q('#devLink'), (CONFIG.developerUrl || '').trim(), true);

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-pending]') : null;
    if (a) { e.preventDefault(); toast(t('pending')); }
  });

  /* ---------- Тост ---------- */
  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- Копирование номера ---------- */
  var doneTimer = 0;
  function copied() {
    toast(t('copied'));
    copyBtn.classList.add('done');
    clearTimeout(doneTimer);
    doneTimer = setTimeout(function () { copyBtn.classList.remove('done'); }, 1500);
  }
  function fallbackCopy() {
    try {
      var r = document.createRange();
      r.selectNodeContents(telNum);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      var ok = document.execCommand('copy');
      if (ok) copied(); else toast(t('copyFail'));
    } catch (err) { toast(t('copyFail')); }
  }
  copyBtn.addEventListener('click', function () {
    if (!CONFIG.phone) { toast(t('pending')); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.phone).then(copied, fallbackCopy);
    } else { fallbackCopy(); }
  });

  /* ---------- Язык ---------- */
  function apply(l) {
    lang = l;
    root.lang = l;
    root.setAttribute('data-lang', l);
    qa('[data-i18n]').forEach(function (el) { el.textContent = I18N[l][el.getAttribute('data-i18n')]; });
    qa('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', I18N[l][el.getAttribute('data-i18n-aria')]); });
    qa('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l)); });
    brand.textContent = CONFIG.name.replace(/-/g, '‑');
    desc.textContent = CONFIG.desc[l];
    chDesc.textContent = CONFIG.channelDesc[l];
    telNum.textContent = CONFIG.phone || t('telPh');
    logo.setAttribute('aria-label', CONFIG.name);
    document.title = CONFIG.name;
    if (meta) meta.setAttribute('content', t('metaDesc'));
  }

  var saved = null;
  try { saved = localStorage.getItem('taplink-lang'); } catch (err) {}
  var nav = ((navigator.language || '') + '').toLowerCase();
  apply(saved === 'ru' || saved === 'uz' ? saved : (nav.indexOf('uz') === 0 ? 'uz' : 'ru'));

  qa('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-set-lang');
      apply(l);
      try { localStorage.setItem('taplink-lang', l); } catch (err) {}
    });
  });

  /* ---------- Блик на карточках при касании и наведении ---------- */
  function spec(e) {
    var r = this.getBoundingClientRect();
    this.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    this.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }
  qa('.card').forEach(function (c) {
    c.addEventListener('pointermove', spec);
    c.addEventListener('pointerdown', spec);
  });

  /* ---------- 4. Появление при прокрутке ---------- */
  var els = qa('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.setProperty('--d', (n++ * 90) + 'ms');
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2600);
  }

  /* ============================================================
     5. Фон: блики воды (каустика) и мыльные пузыри
     - каустика: свет, дрожащий на дне ванны, считается на маленькой
       сетке и растягивается на весь экран (дёшево и мягко);
     - пузыри: радужная плёнка, лёгкое покачивание, уходят от курсора;
       касание или клик по пузырю его лопает (брызги и круги на воде).
     ============================================================ */
  function initScene() {
    var cCaus = q('#caustics'), cBub = q('#bubbles'), bgEl = q('.bg');
    if (!cCaus || !cBub || !bgEl || !cCaus.getContext || !cBub.getContext) return;
    var xC = cCaus.getContext('2d'), xB = cBub.getContext('2d');
    if (!xC || !xB) return;

    var TAU = Math.PI * 2;
    function rand(a, b) { return a + Math.random() * (b - a); }
    function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* --- цвета из CSS-переменных (меняются вместе с темой) --- */
    var T = { rim: '', fill: '', hi: '', film: 0.2, cr: 255, cg: 255, cb: 255, ca: 0.5 };
    function readTheme() {
      var cs = getComputedStyle(root);
      function g(n) { return (cs.getPropertyValue(n) || '').trim(); }
      T.rim = g('--bub-rim') || 'rgba(24,128,150,.4)';
      T.fill = g('--bub-fill') || 'rgba(130,215,230,.16)';
      T.hi = g('--bub-hi') || 'rgba(255,255,255,.95)';
      T.film = num(g('--bub-film'), 0.2);
      var c = g('--caus-rgb').split(',');
      T.cr = num(c[0], 255); T.cg = num(c[1], 255); T.cb = num(c[2], 255);
      T.ca = num(g('--caus-a'), 0.5);
    }

    /* --- каустика --- */
    var GW = 112, GH = 112;
    cCaus.width = GW; cCaus.height = GH;
    var img = xC.createImageData(GW, GH);
    function causticFrame(time) {
      var d = img.data, k = 0, inten = 0.005, n, px, py, ix, iy, nx, ny, c, tt, v;
      for (var y = 0; y < GH; y++) {
        py = (y / GH) * TAU - 250;
        for (var x = 0; x < GW; x++) {
          px = (x / GW) * TAU - 250;
          ix = px; iy = py; c = 1;
          for (n = 0; n < 5; n++) {
            tt = time * (1 - 3.5 / (n + 1));
            nx = px + Math.cos(tt - ix) + Math.sin(tt + iy);
            ny = py + Math.sin(tt - iy) + Math.cos(tt + ix);
            ix = nx; iy = ny;
            c += 1 / Math.hypot(px * inten / Math.sin(ix + tt), py * inten / Math.cos(iy + tt));
          }
          c /= 5;
          c = 1.17 - Math.pow(c, 1.4);
          v = Math.pow(Math.abs(c), 8) * 1.3;
          if (v > 1 || v !== v) v = v !== v ? 0 : 1;
          d[k++] = T.cr; d[k++] = T.cg; d[k++] = T.cb; d[k++] = v * 255 * T.ca;
        }
      }
      xC.putImageData(img, 0, 0);
    }

    /* --- пузыри --- */
    var W = 0, H = 0, dpr = 1;
    var bubbles = [], drops = [], rings = [];
    var S = { tx: 0, ty: 0, px: 0, py: 0, mx: -9999, my: -9999, mouse: false };

    function makeBubble(initial) {
      var r = Math.random() < 0.2 ? rand(44, 82) : rand(10, 40);
      return {
        r: r, x0: rand(0, W),
        y: initial ? rand(0, H) : H + r + rand(10, H * 0.5),
        vy: -(14 + 900 / (r + 20)),
        ax: rand(6, 18), fx: rand(0.25, 0.7), ph: rand(0, TAU), hue: rand(0, 360),
        ox: 0, oy: 0, dx: 0, dy: 0
      };
    }
    function wantCount() { return clamp(Math.round(W * H / 28000), 9, 24); }
    function resize() {
      var ow = W, oh = H;
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cBub.width = Math.round(W * dpr); cBub.height = Math.round(H * dpr);
      xB.setTransform(dpr, 0, 0, dpr, 0, 0);
      var i, want = wantCount();
      if (ow && oh) {
        for (i = 0; i < bubbles.length; i++) { bubbles[i].x0 *= W / ow; bubbles[i].y *= H / oh; }
      }
      while (bubbles.length < want) bubbles.push(makeBubble(true));
      if (bubbles.length > want) bubbles.length = want;
    }

    function step(dt, time) {
      var i, b, sx, tox, toy, ddx, ddy, dd, R, f, k;
      for (i = 0; i < bubbles.length; i++) {
        b = bubbles[i];
        b.y += b.vy * dt;
        sx = Math.sin(b.ph + time * b.fx) * b.ax;
        tox = 0; toy = 0;
        if (S.mouse) {
          ddx = (b.x0 + sx) - S.mx; ddy = b.y - S.my;
          dd = Math.sqrt(ddx * ddx + ddy * ddy); R = 110 + b.r;
          if (dd < R && dd > 0.01) { f = (1 - dd / R) * (40 + b.r * 0.4); tox = ddx / dd * f; toy = ddy / dd * f; }
        }
        k = Math.min(1, 5 * dt);
        b.ox += (tox - b.ox) * k; b.oy += (toy - b.oy) * k;
        b.dx = b.x0 + sx + b.ox + S.px * (6 + b.r * 0.22);
        b.dy = b.y + b.oy + S.py * (6 + b.r * 0.22);
        if (b.y < -b.r - 20) bubbles[i] = makeBubble(false);
      }
      for (i = drops.length - 1; i >= 0; i--) {
        b = drops[i];
        b.vy += 260 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt * b.decay;
        if (b.life <= 0) drops.splice(i, 1);
      }
      for (i = rings.length - 1; i >= 0; i--) {
        rings[i].t += dt;
        if (rings[i].t >= rings[i].dur) rings.splice(i, 1);
      }
    }

    function drawBubble(b, time) {
      var r = b.r, wob = Math.sin(time * 2.1 + b.ph) * 0.025;
      var lw = Math.max(2, r * 0.14), s, film, g;
      xB.save();
      xB.translate(b.dx, b.dy);
      xB.scale(1 + wob, 1 - wob);

      g = xB.createRadialGradient(0, 0, r * 0.55, 0, 0, r);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, T.fill);
      xB.fillStyle = g;
      xB.beginPath(); xB.arc(0, 0, r, 0, TAU); xB.fill();

      /* радужная плёнка по краю */
      if (xB.createConicGradient) {
        film = xB.createConicGradient(b.ph + time * 0.25, 0, 0);
        for (s = 0; s <= 4; s++) film.addColorStop(s / 4, 'hsla(' + (((b.hue + s * 90 + time * 20) % 360)).toFixed(0) + ',85%,68%,' + T.film + ')');
      } else {
        film = xB.createLinearGradient(-r, -r, r, r);
        for (s = 0; s <= 3; s++) film.addColorStop(s / 3, 'hsla(' + (((b.hue + s * 100) % 360)).toFixed(0) + ',85%,68%,' + T.film + ')');
      }
      xB.lineWidth = lw; xB.strokeStyle = film;
      xB.beginPath(); xB.arc(0, 0, r - lw / 2, 0, TAU); xB.stroke();

      /* тонкий контур */
      xB.lineWidth = 1.2; xB.strokeStyle = T.rim;
      xB.beginPath(); xB.arc(0, 0, r, 0, TAU); xB.stroke();

      /* блики */
      xB.fillStyle = T.hi;
      xB.beginPath(); xB.ellipse(-r * 0.4, -r * 0.44, r * 0.26, r * 0.13, -0.7, 0, TAU); xB.fill();
      xB.globalAlpha = 0.45; xB.strokeStyle = T.hi; xB.lineCap = 'round';
      xB.lineWidth = Math.max(1.5, r * 0.07);
      xB.beginPath(); xB.arc(0, 0, r * 0.84, Math.PI * 0.15, Math.PI * 0.5); xB.stroke();
      xB.globalAlpha = 0.8;
      xB.beginPath(); xB.arc(r * 0.18, -r * 0.62, Math.max(1, r * 0.05), 0, TAU); xB.fill();
      xB.restore();
    }

    function draw(time) {
      var i, b, p;
      xB.clearRect(0, 0, W, H);
      for (i = 0; i < bubbles.length; i++) drawBubble(bubbles[i], time);
      for (i = 0; i < rings.length; i++) {
        b = rings[i]; p = b.t / b.dur; p = 1 - Math.pow(1 - p, 3);
        xB.globalAlpha = (1 - b.t / b.dur) * 0.9;
        xB.lineWidth = 1.5; xB.strokeStyle = T.rim;
        xB.beginPath(); xB.arc(b.x, b.y, b.r0 + (b.r1 - b.r0) * p, 0, TAU); xB.stroke();
      }
      for (i = 0; i < drops.length; i++) {
        b = drops[i];
        xB.globalAlpha = Math.min(1, b.life);
        xB.fillStyle = T.rim;
        xB.beginPath(); xB.arc(b.x, b.y, b.r, 0, TAU); xB.fill();
        xB.fillStyle = T.hi;
        xB.beginPath(); xB.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, TAU); xB.fill();
      }
      xB.globalAlpha = 1;
    }

    /* касание: лопаем ближайший пузырь или пускаем круги по воде */
    function pop(x, y) {
      var i, b, dx, dy, d, hit = -1, best = 1e9, n, a, sp;
      for (i = 0; i < bubbles.length; i++) {
        b = bubbles[i];
        dx = x - b.dx; dy = y - b.dy; d = Math.sqrt(dx * dx + dy * dy);
        if (d <= b.r * 1.08 && d < best) { best = d; hit = i; }
      }
      if (hit < 0) { rings.push({ x: x, y: y, r0: 6, r1: 70, t: 0, dur: 0.9 }); return; }
      b = bubbles[hit];
      rings.push({ x: b.dx, y: b.dy, r0: b.r, r1: b.r * 1.5, t: 0, dur: 0.5 });
      n = Math.round(6 + b.r / 10);
      for (i = 0; i < n; i++) {
        a = rand(0, TAU); sp = rand(50, 150);
        drops.push({
          x: b.dx + Math.cos(a) * b.r * 0.8, y: b.dy + Math.sin(a) * b.r * 0.8,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, r: rand(1.2, 2.8), life: 1, decay: rand(1.1, 1.8)
        });
      }
      bubbles[hit] = makeBubble(false);
      bubbles[hit].y = H + bubbles[hit].r + rand(60, 360);
    }

    /* --- переменные для параллакса (свечение и наклон логотипа) --- */
    var lastPx = 999, lastPy = 999, lastSy = -1;
    function applyVars() {
      var sy = window.pageYOffset || 0;
      if (Math.abs(S.px - lastPx) > 0.0008 || Math.abs(S.py - lastPy) > 0.0008) {
        bgEl.style.setProperty('--px', S.px.toFixed(3));
        bgEl.style.setProperty('--py', S.py.toFixed(3));
        badge.style.setProperty('--ry', (S.px * 9).toFixed(2) + 'deg');
        badge.style.setProperty('--rx', (-S.py * 7).toFixed(2) + 'deg');
        lastPx = S.px; lastPy = S.py;
      }
      if (sy !== lastSy) { bgEl.style.setProperty('--sy', String(sy)); lastSy = sy; }
    }

    /* --- запуск --- */
    readTheme();
    resize();
    var rz = 0;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(resize, 150); });

    function redrawStatic() { causticFrame(23 + 1.7); step(0, 0); draw(0); }
    function onTheme() { readTheme(); if (reduce) redrawStatic(); }
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', onTheme); else if (mq.addListener) mq.addListener(onTheme);
    } catch (err) {}
    if (window.MutationObserver) new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    if (reduce) { redrawStatic(); return; }

    window.addEventListener('pointerdown', function (e) { pop(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      S.mouse = true; S.mx = e.clientX; S.my = e.clientY;
      S.tx = (e.clientX / W - 0.5) * 2; S.ty = (e.clientY / H - 0.5) * 2;
    }, { passive: true });
    document.addEventListener('mouseleave', function () { S.mouse = false; S.tx = 0; S.ty = 0; });

    var last = 0, lastC = -1000;
    function frame(ts) {
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016, k = Math.min(1, 4.5 * dt);
      last = ts;
      S.px += (S.tx - S.px) * k; S.py += (S.ty - S.py) * k;
      if (ts - lastC > 85) { lastC = ts; causticFrame(ts / 1000 * 0.45 + 23); }
      step(dt, ts / 1000);
      draw(ts / 1000);
      applyVars();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  initScene();
})();
