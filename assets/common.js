function toggleMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

(function initReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length || typeof IntersectionObserver === 'undefined') {
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function(node) { observer.observe(node); });
})();
