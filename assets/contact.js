function clearValidationErrors() {
  document.querySelectorAll('.field-error-msg').forEach(function(node) { node.remove(); });
  document.querySelectorAll('.input-error').forEach(function(node) { node.classList.remove('input-error'); });
}

function showFieldError(fieldId, message) {
  var node = document.getElementById(fieldId);
  if (!node) return;
  var errorMsg = document.createElement('div');
  errorMsg.className = 'field-error-msg';
  errorMsg.id = fieldId + '-error';
  errorMsg.textContent = message;
  node.parentElement.appendChild(errorMsg);
  node.classList.add('input-error');
}

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

  var url = window.BASE_API_URL || 'https://localhost:7011/api/Contact';
  var path = '/api/Contact';
  var data = {
    Name: name,
    EmailAddress: email,
    PhoneNumber: phone,
    Subject: 'Strike Zone website contact form message',
    Message: message
  };

  var requestKey = window.generateRequestKey();
  var secret = window.HMAC_SECRET;
  var timestamp = (Date.now() + (new Date().getTimezoneOffset() * 60000)).toString(); // UTC Unix ms
  // Stable JSON stringify (sorted keys, no spaces)
  function stableStringify(obj) {
    return '{' + Object.keys(obj).sort().map(k => '"' + k + '"' + ':' + JSON.stringify(obj[k])).join(',') + '}';
  }
  var jsonPayload = stableStringify(data);
  var message = 'POST' + path + jsonPayload + timestamp;
  console.log('HMAC message string:', message);
  console.log('JSON payload:', jsonPayload);
  console.log('Timestamp:', timestamp);
  console.log('Secret:', secret);
  // Dynamically load hmac.js if not already loaded
  function sendRequest(signature) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Request-Key': requestKey,
      'X-Timestamp': timestamp,
      'X-Signature': signature
    };
    console.log("Headers:", headers);
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'X-Request-Key': requestKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature
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
  if (window.generateHmacSignature) {
    window.generateHmacSignature(secret, message).then(sendRequest);
  } else {
    var script = document.createElement('script');
    script.src = 'assets/hmac.js';
    script.onload = function() {
      window.generateHmacSignature(secret, message).then(sendRequest);
    };
    document.head.appendChild(script);
  }
}
