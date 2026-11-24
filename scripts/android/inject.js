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
    var n = 'mask' + k, w = 'webkitMask' + k; if (!D || n in document.documentElement.style) return;
    Object.defineProperty(D, n, { configurable: true, get: function () { return this[w]; }, set: function (v) { this[w] = v; } }); });
  function walk(n) { if (n.nodeType !== 1) return; if (n.tagName === 'STYLE') fixStyle(n); else { fixAttr(n);
      var q = n.querySelectorAll('style,[style*="mask"]'); for (var i = 0; i < q.length; i++) q[i].tagName === 'STYLE' ? fixStyle(q[i]) : fixAttr(q[i]); } }
  new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var m = ms[i];
      if (m.type === 'attributes') fixAttr(m.target);
      else if (m.type === 'characterData') { var p = m.target.parentNode; if (p && p.tagName === 'STYLE') fixStyle(p); }
      else { if (m.target.tagName === 'STYLE') fixStyle(m.target); for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]); } } })
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'], characterData: true });
})();
/* (p287) polyfill WebView 83 — xem tools/patches/p287_poly83_028.py */ (function () { [window.Element, window.Document, window.DocumentFragment].forEach(function (C) { var p = C && C.prototype; if (!p || p.replaceChildren) return; p.replaceChildren = function () { while (this.lastChild) this.removeChild(this.lastChild); this.append.apply(this, arguments); }; }); })();
