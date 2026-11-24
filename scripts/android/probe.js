(function () { var q = document.querySelectorAll('#bottom .ic'), out = [];
  if (q[0]) q[0].style.setProperty('filter', 'none', 'important');
  if (q[q.length - 1]) { q[q.length - 1].style.setProperty('-webkit-mask', 'none', 'important'); q[q.length - 1].style.setProperty('-webkit-clip-path', 'circle(40%)', 'important'); }
  var m = document.querySelectorAll('#board .mold');
  for (var i = 0; i < m.length; i++) { var c = getComputedStyle(m[i]); out.push(['mold', c.webkitMaskImage.slice(0, 30), c.webkitMaskSize, c.filter, c.opacity, c.backgroundColor, c.backgroundImage.slice(0, 30), c.transform, (m[i].getAttribute('style') || '').replace(/url\([^)]*\)/g, 'url()').slice(0, 300)]); }
  if (m[0]) { m[0].style.setProperty('filter', 'none', 'important'); }
  return JSON.stringify(out); })()
