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
  document.getElementById('form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitForm() {
  clearValidationErrors();

  var fullname = document.getElementById('f-fullname').value.trim();
  var age = document.getElementById('f-age').value;
  var role = document.getElementById('f-role').value;
  var pname = document.getElementById('f-pname').value.trim();
  var phone = document.getElementById('f-phone').value.trim();
  var email = document.getElementById('f-email').value.trim();
  var source = document.getElementById('f-source').value;
  var hasError = false;

  if (!fullname) { showFieldError('f-fullname', 'Please enter the player full name.'); hasError = true; }
  if (!age) { showFieldError('f-age', 'Please select an age group.'); hasError = true; }
  if (!role) { showFieldError('f-role', 'Please select the player role.'); hasError = true; }
  if (!pname) { showFieldError('f-pname', 'Please enter the parent or guardian name.'); hasError = true; }
  if (!phone) { showFieldError('f-phone', 'Please enter a WhatsApp number.'); hasError = true; }
  if (!email) { showFieldError('f-email', 'Please enter an email address.'); hasError = true; }
  if (!source) { showFieldError('f-source', 'Please tell us how you heard about us.'); hasError = true; }

  var emailPattern = /^\S+@\S+\.\S+$/;
  if (email && !emailPattern.test(email)) {
    showFieldError('f-email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (hasError) return;

  var url = (window.BASE_API_URL || 'https://localhost:7011/api/Contact') + '/player-registration';
  var path = '/api/Contact/player-registration';
  var data = {
    PlayerFullName: fullname,
    AgeGroup: age,
    PlayerRole: role,
    ParentGuardianName: pname,
    WhatsAppNumber: phone,
    EmailAddress: email,
    HowDidYouHearAboutUs: source
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
      document.getElementById('success-player-name').textContent = fullname;
      document.getElementById('form-content').style.display = 'none';
      document.getElementById('success-msg').classList.add('show');
      document.getElementById('form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(function(error) {
      var errorText = error && error.message ? error.message : String(error);
      showError('An error occured: ' + errorText + '. Please send an email to kverma@outlook.com.');
      console.error('Registration form submission error:', error);
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
