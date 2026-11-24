try {
/* (p292) flex gap cho WebView cũ — xem tools/patches/p292_flexgap028.py */ (function () {
  if (!document.documentElement) { document.addEventListener('DOMContentLoaded', arguments.callee); return; }
  var R = document.documentElement, t = document.createElement('div');
  t.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
  t.appendChild(document.createElement('div')); t.appendChild(document.createElement('div')); R.appendChild(t);
  var ok = t.scrollHeight === 1; R.removeChild(t);
  if (ok && !window.__force292) return;
  window.__flexgap292 = 1;
  var P = ['marginLeft', 'marginTop', 'marginRight', 'marginBottom'], touched = [];
  function base(k) { if (!k._g292) { var c = getComputedStyle(k); k._g292 = P.map(function (p) { return [k.style[p], parseFloat(c[p]) || 0]; }); touched.push(k); } return k._g292; }
  function put(k, i, add) { var b = base(k)[i], v = add ? (b[1] + add) + 'px' : b[0]; if (k.style[P[i]] !== v) k.style[P[i]] = v; }
  function pass() {
    pend = 0;
    for (var z = 0; z < touched.length; z++) { var k0 = touched[z], b0 = k0._g292; for (var q = 0; q < 4; q++) if (k0.style[P[q]] !== b0[q][0]) k0.style[P[q]] = b0[q][0]; }
    var all = document.body ? document.body.getElementsByTagName('*') : [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i], cs = getComputedStyle(el), d = cs.display;
      if (d !== 'flex' && d !== 'inline-flex') continue;
      var cg = parseFloat(cs.columnGap) || 0, rg = parseFloat(cs.rowGap) || 0; if (!cg && !rg) continue;
      var dir = cs.flexDirection, row = dir.indexOf('row') === 0, rev = dir.indexOf('reverse') > 0, wrap = cs.flexWrap !== 'nowrap';
      var mi = row ? (rev ? 2 : 0) : (rev ? 3 : 1), gm = row ? cg : rg, kids = [];
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) { var kc = getComputedStyle(c); if (kc.display !== 'none' && kc.position !== 'absolute' && kc.position !== 'fixed') kids.push(c); }
      for (var j = 1; j < kids.length; j++) if (gm) put(kids[j], mi, gm);
      if (wrap && kids.length > 1) {   // đầu mỗi dòng mới: bỏ khoảng ngang, thêm khoảng dọc
        var top0 = row ? kids[0].offsetTop : kids[0].offsetLeft;
        for (var w = 1; w < kids.length; w++) { var o = row ? kids[w].offsetTop : kids[w].offsetLeft;
          if (o > top0 + 1) { if (row && kids[w].offsetLeft <= kids[0].offsetLeft + 1) put(kids[w], mi, 0); var cross = row ? rg : cg; if (cross) put(kids[w], row ? 1 : 0, cross); } }
      }
    }
  }
  var pend = 0;
  function later() { if (!pend) pend = setTimeout(pass, 120); }
  new MutationObserver(later).observe(R, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  window.addEventListener('resize', later); window.addEventListener('load', later); document.addEventListener('DOMContentLoaded', later);
})();
} catch (e) { console.error("inject", e && e.stack); }
try {
/* (p288) mask không tiền tố → -webkit-mask cho WebView cũ — xem tools/patches/p288_mask83_028.py */ (function () {
  var C = window.CSS; if (!C || !C.supports) return;
  if (C.supports('mask-image', 'none') && !window.__force288) return;
  var RX = /(^|[;\s{])mask(-image|-size|-position|-repeat|-origin|-clip|-mode)?\s*:/g;
  function val(t, i) { var d = 0, q = ''; for (var j = i; j < t.length; j++) { var c = t[j];
      if (q) { if (c === q) q = ''; continue; } if (c === '"' || c === "'") q = c; else if (c === '(') d++; else if (c === ')') d--;
      else if ((c === ';' || c === '}') && !d) return j; } return t.length; }
  function blk(t) {   // một khối khai báo → thêm -webkit-mask* còn thiếu ở cuối
    if (t.indexOf('mask') < 0) return t; var add = '', m; RX.lastIndex = 0;
    while ((m = RX.exec(t))) { var k = '-webkit-mask' + (m[2] || ''), e = val(t, RX.lastIndex), v = t.slice(RX.lastIndex, e).trim();
      if (v && t.indexOf(k + ':') < 0 && t.indexOf(k + ' :') < 0 && add.indexOf(k + ':') < 0) add += ';' + k + ':' + v; RX.lastIndex = e; }
    return add ? t.replace(/;?\s*$/, '') + add : t; }
  function css(t) {   // văn bản CSS: xử lý từng khối { … } không lồng (giá trị có thể chứa ngoặc / nháy)
    if (t.indexOf('mask') < 0) return t; var o = '', i = 0;
    while (i < t.length) { var a = t.indexOf('{', i); if (a < 0) { o += t.slice(i); break; }
      var e = a + 1, d = 0, q = ''; for (; e < t.length; e++) { var c = t[e]; if (q) { if (c === q) q = ''; continue; }
        if (c === '"' || c === "'") q = c; else if (c === '(') d++; else if (c === ')') d--; else if (!d && (c === '{' || c === '}')) break; }
      if (t[e] === '{') { o += t.slice(i, a + 1); i = a + 1; continue; }   // @media / @keyframes: đi vào trong
      o += t.slice(i, a + 1) + blk(t.slice(a + 1, e)) + (t[e] || ''); i = e + 1; }
    return o; }
  function fixStyle(n) { var t = n.textContent; if (t.indexOf('mask') < 0 || n._p288 === t.length) return; var u = css(t); n._p288 = u.length; if (u !== t) n.textContent = u; }
  function fixAttr(el) { var t = el.getAttribute && el.getAttribute('style'); if (!t || t.indexOf('mask') < 0) return; var u = blk(t); if (u !== t) el.setAttribute('style', u); }
  var D = window.CSSStyleDeclaration && CSSStyleDeclaration.prototype, ct = D && Object.getOwnPropertyDescriptor(D, 'cssText');
  if (ct && ct.set) Object.defineProperty(D, 'cssText', { configurable: true, enumerable: ct.enumerable, get: ct.get,
    set: function (v) { ct.set.call(this, String(v).indexOf('mask') >= 0 ? blk(String(v)) : v); } });
  ['', 'Image', 'Size', 'Position', 'Repeat', 'Origin', 'Clip', 'Mode'].forEach(function (k) {
    var n = 'mask' + k, w = 'webkitMask' + k; if (!D || n in document.createElement('div').style) return;
    Object.defineProperty(D, n, { configurable: true, get: function () { return this[w]; }, set: function (v) { this[w] = v; } }); });
  function walk(n) { if (n.nodeType !== 1) return; if (n.tagName === 'STYLE') fixStyle(n); else { fixAttr(n);
      var q = n.querySelectorAll('style,[style*="mask"]'); for (var i = 0; i < q.length; i++) q[i].tagName === 'STYLE' ? fixStyle(q[i]) : fixAttr(q[i]); } }
  new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var m = ms[i];
      if (m.type === 'attributes') fixAttr(m.target);
      else if (m.type === 'characterData') { var p = m.target.parentNode; if (p && p.tagName === 'STYLE') fixStyle(p); }
      else { if (m.target.tagName === 'STYLE') fixStyle(m.target); for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]); } } })
    .observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'], characterData: true });
})();
} catch (e) { console.error("inject", e && e.stack); }
try {
/* (p287) polyfill WebView 83 — xem tools/patches/p287_poly83_028.py */ (function () { [window.Element, window.Document, window.DocumentFragment].forEach(function (C) { var p = C && C.prototype; if (!p || p.replaceChildren) return; p.replaceChildren = function () { while (this.lastChild) this.removeChild(this.lastChild); this.append.apply(this, arguments); }; }); })();
} catch (e) { console.error("inject", e && e.stack); }
