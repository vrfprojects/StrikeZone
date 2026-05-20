(function() {
  // Generates a GUID (RFC4122 version 4 compliant)
  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Returns current date/time up to the minute as YYYYMMDDHHmm
  function getCurrentDateTimeMinute() {
    var now = new Date();
    var pad = n => n < 10 ? '0' + n : n;
    return now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes());
  }

  // Generates the request key: GUID + datetime (minute)
  window.generateRequestKey = function() {
    return generateGUID() + '-' + getCurrentDateTimeMinute();
  };
})();
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
