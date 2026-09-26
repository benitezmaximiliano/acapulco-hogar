/* =========================================================
   Acapulco Hogar — lógica del sitio
   Todo el contenido (productos, categorías, contacto) sale de
   data/data.js. Este archivo casi nunca hace falta tocarlo.
   ========================================================= */
(function () {
  'use strict';
  var D = window.AH_DATA, C = D.contact;
  var IMG = 'assets/img/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var wa = function (msg) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg); };
  var money = function (n) { return '$ ' + Number(n).toLocaleString('es-AR'); };
  var params = new URLSearchParams(location.search);
  var page = document.body.getAttribute('data-page') || 'home';

  var I = {
    wa: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3C8.83 3 3 8.83 3 16.02c0 2.3.6 4.55 1.75 6.53L3 29l6.62-1.73a13 13 0 0 0 6.4 1.63h.01C23.2 28.9 29 23.07 29 15.9 29 12.45 27.65 9.2 25.2 6.77A12.9 12.9 0 0 0 16.02 3Zm0 23.7h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-3.93 1.03 1.05-3.83-.26-.4a10.8 10.8 0 0 1-1.65-5.75c0-5.97 4.87-10.83 10.86-10.83 2.9 0 5.6 1.13 7.65 3.18a10.75 10.75 0 0 1 3.17 7.66c0 5.98-4.87 10.84-10.98 10.84Zm5.95-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.52-.16-.74.17-.22.32-.85 1.06-1.04 1.28-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.63-1.62a9.9 9.9 0 0 1-1.82-2.26c-.19-.33-.02-.5.14-.66.15-.14.33-.38.5-.57.16-.19.22-.33.33-.54.1-.22.05-.4-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.11-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.5.21 2.06.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>'
  };

  /* ---------- Cabecera, pie y botón de WhatsApp ---------- */
  function renderChrome() {
    var cur = params.get('c') || 'todo';
    var links = [{ t: 'Inicio', h: 'index.html', on: page === 'home' }];
    D.categories.forEach(function (c) {
      links.push({ t: c.short || c.title, h: 'catalogo.html?c=' + c.id, on: page === 'catalog' && cur === c.id });
    });
    links.push({ t: 'Info', h: 'info.html', on: page === 'info' });

    var navHtml = links.map(function (l, i) {
      return '<a href="' + l.h + '" style="--i:' + i + '"' + (l.on ? ' aria-current="page"' : '') + '>' + esc(l.t) + '</a>';
    }).join('') + '<a class="btn btn-wa nav-cta" href="' + wa('Hola! Quiero consultar por el catálogo mayorista.') + '" target="_blank" rel="noopener">' + I.wa + 'Escribinos por WhatsApp</a>';

    var header = document.createElement('header');
    header.className = 'site-header';
    header.id = 'siteHeader';
    header.innerHTML =
      '<div class="wrap header-in">' +
      '<a class="brand" href="index.html" aria-label="Acapulco Hogar, inicio"><img src="assets/img/logo-icon-dark.png" alt="" width="34" height="34"><span class="brand-text">Acapulco<em>Hogar</em></span></a>' +
      '<nav class="nav" id="nav" aria-label="Principal">' + navHtml + '</nav>' +
      '<a class="btn btn-wa btn-sm header-wa" href="' + wa('Hola! Quiero consultar por el catálogo mayorista.') + '" target="_blank" rel="noopener">' + I.wa + 'Pedir precios</a>' +
      '<button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>' +
      '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    document.body.appendChild(scrim);

    var nav = $('#nav'), burger = $('#burger');
    function setMenu(open) {
      nav.classList.toggle('open', open);
      scrim.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    scrim.addEventListener('click', function () { setMenu(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });

    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="wrap"><div class="foot">' +
      '<div><a class="brand" href="index.html"><img src="assets/img/logo-icon-light.png" alt="" width="34" height="34"><span class="brand-text">Acapulco<em>Hogar</em></span></a>' +
      '<p>Fabricantes de muebles tejidos a mano. Catálogo y lista de precios mayorista.</p></div>' +
      '<div><h4>Catálogo</h4><ul>' + D.categories.map(function (c) { return '<li><a href="catalogo.html?c=' + c.id + '">' + esc(c.title) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Contacto</h4><ul>' +
      '<li><a href="' + wa('Hola! Quiero consultar por el catálogo mayorista.') + '" target="_blank" rel="noopener">WhatsApp ' + esc(C.whatsappDisplay) + '</a></li>' +
      '<li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></li>' +
      '<li><a href="https://instagram.com/' + esc(C.instagram) + '" target="_blank" rel="noopener">@' + esc(C.instagram) + '</a></li>' +
      '<li><a href="info.html">Condiciones y envíos</a></li></ul></div>' +
      '</div><div class="copy">© ' + new Date().getFullYear() + ' Acapulco Hogar · Catálogo para clientes mayoristas.</div></div>';
    document.body.appendChild(footer);

    var fab = document.createElement('a');
    fab.className = 'wa-fab';
    fab.href = wa('Hola! Quiero consultar por el catálogo mayorista de Acapulco Hogar.');
    fab.target = '_blank';
    fab.rel = 'noopener';
    fab.setAttribute('aria-label', 'Escribinos por WhatsApp');
    fab.innerHTML = I.wa + '<span class="lbl">Escribinos por WhatsApp</span>';
    document.body.appendChild(fab);
    setTimeout(function () { fab.classList.add('open'); }, 2200);
    setTimeout(function () { fab.classList.remove('open'); }, 7500);

    // Datos de contacto en cualquier lugar del HTML
    $$('[data-wa]').forEach(function (el) {
      el.href = wa(el.getAttribute('data-msg') || 'Hola! Quiero consultar por el catálogo mayorista.');
      el.target = '_blank'; el.rel = 'noopener';
    });
    $$('[data-tel]').forEach(function (el) { el.textContent = C.whatsappDisplay; });
    $$('[data-email]').forEach(function (el) { el.href = 'mailto:' + C.email; el.textContent = C.email; });
    $$('[data-ig]').forEach(function (el) { el.href = 'https://instagram.com/' + C.instagram; el.target = '_blank'; el.rel = 'noopener'; el.textContent = '@' + C.instagram; });
    $$('[data-web]').forEach(function (el) { el.href = C.web; el.target = '_blank'; el.rel = 'noopener'; el.textContent = C.web.replace(/^https?:\/\//, ''); });
    $$('[data-hours]').forEach(function (el) { el.innerHTML = C.hours.map(esc).join('<br>'); });
  }

  /* ---------- Productos ---------- */
  var catById = {};
  D.categories.forEach(function (c) { catById[c.id] = c; });

  function priceHtml(p) {
    if (p.price != null) {
      var h = '<strong>' + money(p.price) + '</strong><small>por unidad' + (p.sinIva ? ' · sin IVA' : '') + '</small>';
      if (p.duo != null) h += '<span class="duo">Dúo: ' + money(p.duo) + (p.sinIva ? ' · sin IVA' : '') + '</span>';
      return h;
    }
    return '<span class="ptext">' + esc(p.priceText || 'Consultar precio') + '</span>';
  }

  function cardHtml(p, listIdx, delay) {
    var cat = catById[p.cat] || { title: '' };
    var chips = [].concat(p.badge ? [] : [], p.notes || [], p.materials || []);
    var msg = 'Hola! Quiero consultar por: ' + p.name + ' (' + cat.title + '). ¿Me pasás precio mayorista y disponibilidad?';
    return '<article class="card reveal" style="--d:' + delay + '">' +
      '<button class="card-img" type="button" data-i="' + listIdx + '" aria-label="Ver foto de ' + esc(p.name) + '">' +
      (p.badge ? '<span class="card-badge">' + esc(p.badge) + '</span>' : '') +
      '<img src="' + IMG + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" onload="this.classList.add(\'loaded\')"></button>' +
      '<div class="card-body"><h3>' + esc(p.name) + '</h3>' +
      (p.dims ? '<p class="dims">' + esc(p.dims) + '</p>' : '') +
      (p.desc ? '<p class="desc">' + esc(p.desc) + '</p>' : '') +
      (chips.length ? '<ul class="notes">' + chips.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="price">' + priceHtml(p) + '</div>' +
      '<a class="btn btn-wa btn-sm" href="' + wa(msg) + '" target="_blank" rel="noopener">' + I.wa + 'Consultar</a></div></article>';
  }

  /* ---------- Lightbox ---------- */
  var lb, lbList = [], lbIdx = 0;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Cerrar">' + I.close + '</button>' +
      '<button class="lb-btn lb-prev" aria-label="Anterior">' + I.prev + '</button>' +
      '<button class="lb-btn lb-next" aria-label="Siguiente">' + I.next + '</button>' +
      '<figure><img alt=""><figcaption><strong></strong><span></span></figcaption><a class="btn btn-wa btn-sm" target="_blank" rel="noopener">' + I.wa + 'Consultar por WhatsApp</a></figure>';
    document.body.appendChild(lb);
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { showLb(lbIdx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { showLb(lbIdx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
      if (e.key === 'ArrowRight') showLb(lbIdx + 1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) showLb(lbIdx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
  function showLb(i) {
    if (!lbList.length) return;
    lbIdx = (i + lbList.length) % lbList.length;
    var p = lbList[lbIdx];
    var img = $('img', lb);
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    img.src = IMG + p.img; img.alt = p.name;
    $('figcaption strong', lb).textContent = p.name;
    $('figcaption span', lb).textContent = p.price != null ? money(p.price) + ' por unidad' + (p.sinIva ? ' · sin IVA' : '') : (p.priceText || '');
    $('.btn', lb).href = wa('Hola! Quiero consultar por: ' + p.name + '. ¿Me pasás precio mayorista y disponibilidad?');
    var single = lbList.length < 2;
    $('.lb-prev', lb).style.display = $('.lb-next', lb).style.display = single ? 'none' : '';
  }
  function openLb(list, i) {
    if (!lb) buildLightbox();
    lbList = list;
    showLb(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  function bindCards(root, list) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.card-img');
      if (b) openLb(list(), parseInt(b.getAttribute('data-i'), 10));
    });
  }

  /* ---------- Animaciones al hacer scroll ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observe(root) {
    $$('.reveal:not(.in)', root || document).forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  }

  /* ---------- Página: inicio ---------- */
  function renderHome() {
    var counts = {};
    D.products.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    var box = $('#cats');
    if (box) {
      box.innerHTML = D.categories.map(function (c, i) {
        return '<a class="cat reveal" style="--d:' + i + '" href="catalogo.html?c=' + c.id + '">' +
          '<img src="' + IMG + esc(c.cover) + '" alt="" loading="lazy" decoding="async">' +
          '<span class="cat-count">' + (counts[c.id] || 0) + ' modelos</span>' +
          '<span class="cat-arrow">' + I.arrow + '</span>' +
          '<span class="cat-body"><h3>' + esc(c.title) + '</h3><p>' + esc(c.desc || '') + '</p></span></a>';
      }).join('');
    }
    var rail = $('#featured');
    if (rail) {
      var feat = D.products.filter(function (p) { return p.featured; });
      rail.innerHTML = feat.map(function (p, i) { return cardHtml(p, i, Math.min(i, 3)); }).join('');
      bindCards(rail, function () { return feat; });
      var section = rail.closest('section'); if (section && !feat.length) section.hidden = true;
    }
    var cnt = $('[data-count]'); if (cnt) cnt.textContent = D.products.length;
  }

  /* ---------- Página: catálogo ---------- */
  function renderCatalog() {
    var id = params.get('c') || 'todo';
    var cat = catById[id];
    var cats = cat ? [cat] : D.categories;
    var title = cat ? cat.title : 'Catálogo completo';
    document.title = title + ' · Acapulco Hogar';

    $('#pageTitle').textContent = title;
    $('#pageDesc').textContent = cat ? (cat.desc || '') : 'Todos los modelos en un solo lugar. Usá el buscador para encontrar uno rápido.';

    $('#chips').innerHTML = [{ id: 'todo', title: 'Ver todo' }].concat(D.categories).map(function (c) {
      return '<a class="chip" href="catalogo.html?c=' + c.id + '"' + (c.id === id || (!cat && c.id === 'todo') ? ' aria-current="page"' : '') + '>' + esc(c.short || c.title) + '</a>';
    }).join('');
    var active = $('#chips [aria-current]');
    if (active && active.scrollIntoView) { $('#chips').scrollLeft = Math.max(0, active.offsetLeft - 16); }

    var body = $('#catalogBody'), shown = [];
    function render(q) {
      var query = norm(q || '').trim();
      shown = [];
      var html = '', total = 0;
      cats.forEach(function (c) {
        var all = D.products.filter(function (p) { return p.cat === c.id; });
        var defs = (D.sections[c.id] || []).slice();
        var known = defs.map(function (s) { return s.id; });
        if (all.some(function (p) { return known.indexOf(p.sec) < 0; })) defs.push({ id: '__otros', title: defs.length ? 'Más productos' : c.title, std: !defs.length });
        defs.forEach(function (s) {
          var items = all.filter(function (p) {
            var inSec = s.id === '__otros' ? known.indexOf(p.sec) < 0 : p.sec === s.id;
            return inSec && (!query || norm(p.name + ' ' + (p.dims || '') + ' ' + (p.desc || '')).indexOf(query) > -1);
          });
          if (!items.length) return;
          total += items.length;
          html += '<section class="sec">' + ((cat && defs.length === 1) ? '' : '<div class="band reveal"><h2>' + esc(s.title) + '</h2>' + (!cat ? '<p>' + esc(c.title) + '</p>' : '') + '</div>') +
            '<div class="wrap sec-body">' +
            (s.intro ? '<p class="price-note" style="margin-top:0">' + esc(s.intro) + '</p>' : '') +
            (s.std ? '<ul class="mats">' + D.standardMaterials.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
            '<div class="grid" style="margin-top:1.6rem">' +
            items.map(function (p, i) { shown.push(p); return cardHtml(p, shown.length - 1, i % 4); }).join('') +
            '</div></div></section>';
        });
      });
      body.innerHTML = total ? html : '<div class="wrap empty"><h3>No encontramos ese modelo</h3><p>Probá con otra palabra o escribinos por WhatsApp y te ayudamos.</p></div>';
      observe(body);
    }
    bindCards(body, function () { return shown; });
    var input = $('#search');
    input.addEventListener('input', function () { render(input.value); });
    render('');
  }

  renderChrome();
  if (page === 'home') renderHome();
  if (page === 'catalog') renderCatalog();
  observe();
})();
