JSON.stringify([...document.querySelectorAll('#bottom .ic, #board .mold')].slice(0, 5).map(function (e) { var c = getComputedStyle(e);
  return [e.className, e.getBoundingClientRect().width, c.webkitMaskImage.slice(0, 50), c.webkitMaskSize, c.backgroundColor, (e.getAttribute('style') || '').slice(0, 60)]; }))
