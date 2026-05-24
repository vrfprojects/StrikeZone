// Set your HMAC secret here (code-level default). Change the value as needed.
if (!window.HMAC_SECRET) {
  window.HMAC_SECRET = 'strikezone-secret-key123e4567-e89b-12d3-a456-426614174000-strikezone'; // TODO: Replace with your actual HMAC key
}
(function() {
    // BASE_API_URL is now set in config.js. Make sure to load config.js before this file.
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
    return now.getUTCFullYear().toString() +
      pad(now.getUTCMonth() + 1) +
      pad(now.getUTCDate()) +
      pad(now.getUTCHours()) +
      pad(now.getUTCMinutes());
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
