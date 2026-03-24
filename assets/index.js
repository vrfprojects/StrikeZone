function clearValidationErrors() {
  document.querySelectorAll('.field-error-msg').forEach(function(node) { node.remove(); });
  document.querySelectorAll('.input-error').forEach(function(node) { node.classList.remove('input-error'); });
  document.querySelectorAll('.checkbox-error').forEach(function(node) { node.classList.remove('checkbox-error'); });
}

function showFieldError(fieldId, message) {
  var field = document.getElementById(fieldId);
  if (!field) return;

  var errorId = fieldId + '-error';
  var errorNode = document.getElementById(errorId);

  if (field.type === 'checkbox') {
    var label = field.closest('.fcheckbox');
    if (!label) return;
    label.classList.add('checkbox-error');

    if (!errorNode) {
      errorNode = document.createElement('div');
      errorNode.id = errorId;
      errorNode.className = 'field-error-msg';
      label.insertAdjacentElement('afterend', errorNode);
    }
    errorNode.textContent = message;
    return;
  }

  field.classList.add('input-error');
  var insertAfter = field.closest('.finput-group') || field;

  if (!errorNode) {
    errorNode = document.createElement('div');
    errorNode.id = errorId;
    errorNode.className = 'field-error-msg';
    insertAfter.insertAdjacentElement('afterend', errorNode);
  }
  errorNode.textContent = message;
}

function wireInlineValidation() {
  var fieldIds = ['c-name', 'c-email', 'c-phone', 'c-message', 'f-fname', 'f-lname', 'f-age', 'f-pname', 'f-phone'];
  fieldIds.forEach(function(id) {
    var node = document.getElementById(id);
    if (!node) return;
    var eventName = node.tagName === 'SELECT' ? 'change' : 'input';
    node.addEventListener(eventName, function() {
      node.classList.remove('input-error');
      var msg = document.getElementById(id + '-error');
      if (msg) msg.remove();
    });
  });

  ['f-terms', 'f-indemnity'].forEach(function(id) {
    var node = document.getElementById(id);
    if (!node) return;
    node.addEventListener('change', function() {
      var label = node.closest('.fcheckbox');
      if (label) label.classList.remove('checkbox-error');
      var msg = document.getElementById(id + '-error');
      if (msg) msg.remove();
    });
  });
}

(function initAnchorOffsets() {
  var navbar = document.querySelector('.navbar');
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      var targetTop = target.getBoundingClientRect().top + window.scrollY;
      var visualOffset = targetId === '#home' ? navbarHeight : Math.max(navbarHeight - 28, 0);
      var scrollTop = Math.max(targetTop - visualOffset, 0);

      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      history.replaceState(null, '', targetId);
    });
  });
})();

(function initActiveNavOnScroll() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    navLinks.forEach(function(a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });
})();

function showError(message) {
  document.getElementById('error-msg-text').textContent = message;
  document.getElementById('error-msg').style.display = 'block';
  document.getElementById('contact-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitContactForm() {
  clearValidationErrors();

  var name = document.getElementById('c-name').value.trim();
  var email = document.getElementById('c-email').value.trim();
  var phone = document.getElementById('c-phone').value.trim();
  var message = document.getElementById('c-message').value.trim();
  var hasError = false;

  if (!name) { showFieldError('c-name', 'Please enter your full name.'); hasError = true; }
  if (!email) { showFieldError('c-email', 'Please enter your email address.'); hasError = true; }
  if (!phone) { showFieldError('c-phone', 'Please enter your phone number.'); hasError = true; }
  if (!message) { showFieldError('c-message', 'Please enter your message.'); hasError = true; }

  var emailPattern = /^\S+@\S+\.\S+$/;
  if (email && !emailPattern.test(email)) {
    showFieldError('c-email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (hasError) return;

  var url = 'https://ex.bakerly.co.za/api/Contact';
  var data = {
    name: name,
    emailAddress: email,
    phoneNumber: phone,
    subject: '',
    message: message,
    consentToPrivacyPolicy: false
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    body: JSON.stringify(data)
  })
  .then(async function(response) {
    var responseBody = await response.text();
    if (response.status !== 200) {
      var bodyText = responseBody && responseBody.trim() ? responseBody : '[empty response body]';
      throw new Error('Status ' + response.status + ': ' + bodyText);
    }
    return responseBody;
  })
  .then(function() {
    document.getElementById('contact-success-name').textContent = name;
    document.getElementById('contact-form-content').style.display = 'none';
    document.getElementById('contact-success-msg').classList.add('show');
    document.getElementById('contact-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  })
  .catch(function(error) {
    var errorText = error && error.message ? error.message : String(error);
    showError('An error occured: ' + errorText + '. Please send an email to kverma@outlook.com.');
    console.error('Contact form submission error:', error);
    document.getElementById('contact-form-content').style.display = '';
  });
}

function submitForm() {
  clearValidationErrors();

  var fname = document.getElementById('f-fname').value.trim();
  var lname = document.getElementById('f-lname').value.trim();
  var age = document.getElementById('f-age').value;
  var pname = document.getElementById('f-pname').value.trim();
  var phone = document.getElementById('f-phone').value.trim();
  var terms = document.getElementById('f-terms').checked;
  var indemnity = document.getElementById('f-indemnity').checked;
  var hasError = false;

  if (!fname) { showFieldError('f-fname', 'Please enter the player first name.'); hasError = true; }
  if (!lname) { showFieldError('f-lname', 'Please enter the player last name.'); hasError = true; }
  if (!age) { showFieldError('f-age', 'Please select an age group.'); hasError = true; }
  if (!pname) { showFieldError('f-pname', 'Please enter the parent or guardian name.'); hasError = true; }
  if (!phone) { showFieldError('f-phone', 'Please enter a WhatsApp number.'); hasError = true; }
  if (!terms) {
    showFieldError('f-terms', 'Please confirm you have read the league rules.');
    hasError = true;
  }
  if (!indemnity) {
    showFieldError('f-indemnity', 'Please confirm parent indemnity before submitting.');
    hasError = true;
  }

  if (hasError) return;

  document.getElementById('form-content').style.display = 'none';
  document.getElementById('success-msg').classList.add('show');
  document.getElementById('form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

wireInlineValidation();
