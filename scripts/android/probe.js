(function () { try { document.querySelectorAll('.ov.on').forEach(function (e) { e.classList.remove('on'); }); window.__home016.open(); } catch (e) { return 'open: ' + e; }
  var q = document.querySelectorAll('#home016 .h-tools .h-tl .hic16'), o = [];
  for (var i = 0; i < q.length && i < 6; i++) { var r = q[i].getBoundingClientRect(); o.push([Math.round(r.width), Math.round(r.height)]); }
  return JSON.stringify({ n: q.length, sizes: o, ar: CSS.supports('aspect-ratio', '1') }); })()
