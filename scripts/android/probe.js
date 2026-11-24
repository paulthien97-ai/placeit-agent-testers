(function () { try { document.querySelectorAll('.ov.on').forEach(function (e) { e.classList.remove('on'); }); window.__home016.open(); } catch (e) { return 'open: ' + e; }
  var e = document.querySelector('#home016 .h-tools .h-tl .hic16'); if (!e) return 'no icon'; var c = getComputedStyle(e), out = { h: c.height, w: c.width, disp: c.display, flex: c.flex, minH: c.minHeight, maxH: c.maxHeight, boxSizing: c.boxSizing, inlineStyle: e.getAttribute('style'), cls: e.className };
  out.sup = [CSS.supports('(aspect-ratio: 1)'), CSS.supports('not (aspect-ratio: 1)')];
  var hits = []; for (var i = 0; i < document.styleSheets.length; i++) { var rs; try { rs = document.styleSheets[i].cssRules; } catch (x) { continue; }
    (function walk(rs, pre) { for (var j = 0; j < rs.length; j++) { var r = rs[j]; if (r.cssRules) walk(r.cssRules, (r.conditionText || r.media && r.media.mediaText || '') + ' > '); else if (r.selectorText && e.matches(r.selectorText) && /height/.test(r.style.cssText)) hits.push(i + ':' + pre + r.selectorText + ' {' + r.style.cssText.slice(0, 120) + '}'); } })(rs, ''); }
  out.hits = hits.slice(-8); out.parent = [e.parentNode.className, getComputedStyle(e.parentNode).display, getComputedStyle(e.parentNode).height];
  return JSON.stringify(out); })()
