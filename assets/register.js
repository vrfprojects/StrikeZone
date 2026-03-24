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

  var url = 'https://ex.bakerly.co.za/api/Contact/player-registration';
  var data = {
    playerFullName: fullname,
    ageGroup: age,
    playerRole: role,
    parentGuardianName: pname,
    whatsAppNumber: phone,
    emailAddress: email,
    howDidYouHearAboutUs: source
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
