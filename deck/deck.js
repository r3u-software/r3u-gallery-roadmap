// Tiny slide runner: arrows / space / swipe, # deep links, F for fullscreen, scales a 1280x720 stage to the window.
(function () {
  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var bar = document.getElementById('bar');
  var counter = document.getElementById('counter');
  var index = 0;

  function fit() {
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = 'scale(' + s + ')';
  }

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (el, k) { el.classList.toggle('active', k === index); });
    bar.style.width = ((index + 1) / slides.length * 100) + '%';
    counter.textContent = (index + 1) + ' / ' + slides.length;
    try { history.replaceState(null, '', '#' + (index + 1)); } catch (e) { /* file:// */ }
  }

  function fromHash() {
    var n = parseInt(location.hash.replace('#', ''), 10);
    return isNaN(n) ? 0 : n - 1;
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); show(index + 1); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace': e.preventDefault(); show(index - 1); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        break;
      default:
    }
  });

  var startX = null;
  document.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.getElementById('prev').addEventListener('click', function () { show(index - 1); });
  document.getElementById('next').addEventListener('click', function () { show(index + 1); });
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', function () { show(fromHash()); });

  fit();
  show(fromHash());
})();
