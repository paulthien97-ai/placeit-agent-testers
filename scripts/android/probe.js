(function () { var q = document.querySelectorAll('#bottom .ic'), out = [];
  var svg = "<svg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><path d='M22 20h17a15 15 0 0 1 0 30H27' fill='none' stroke='#000' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/><path d='M6 20 26 5v30z' fill='#000' stroke='#000' stroke-width='4' stroke-linejoin='round'/></svg>";
  if (q[0]) q[0].style.setProperty('-webkit-mask-image', 'url("data:image/svg+xml;base64,' + btoa(svg) + '")', 'important');
  if (q[q.length - 1]) q[q.length - 1].style.setProperty('-webkit-mask-size', '100% 100%', 'important');
  for (var i = 0; i < q.length; i++) { var c = getComputedStyle(q[i]); out.push([q[i].getAttribute('style'), c.webkitMaskImage.slice(0, 40), c.webkitMaskSize, c.filter.slice(0, 40)]); }
  var m = document.querySelector('#board .mold'); if (m) { var cm = getComputedStyle(m); out.push(['mold', cm.webkitMaskImage.slice(0, 40), cm.webkitMaskSize]); }
  return JSON.stringify(out); })()
