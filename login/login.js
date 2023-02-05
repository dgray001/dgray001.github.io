import { verifyRecaptcha, public_recaptcha_site_key } from '../scripts/recaptcha.js';

/**
 * @return {Promise<void>}
 * Submits login form if recaptcha token is valid
 */
window.submitFormButton = async () => {
  if (!validateLoginForm()) {
    return;
  }
  const button = document.getElementById('login-form-button');
  button.disabled = true;
  button.innerText = 'Loading';
  button.setAttribute('style', 'box-shadow: none;');
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    const status_message = document.getElementById('login-form-status-message');
    if (recaptcha_check) {
      const login_form = document.getElementById('login-form');
      login_form.submit();
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = 'reCaptcha validation has failed. If you are human, please report this false positive.';
    }
  });
}

/**
 * Validates each section in contact form
 * @return {boolean} whether form field is valid.
 */
function validateLoginForm() {
  const username = document.getElementById('username-field');
  const username_valid = username.validate();
  const password = document.getElementById('password-field');
  const password_valid = password.validate();
  return username_valid && password_valid;
}

/**
 * Submits contact form to server
 * @return {Promise<void>}
 */
window.submitForm = async () => {
  const username = document.getElementById('username-field');
  const username_data = username.getFormData();
  const password = document.getElementById('password-field');
  const post_data = {
    'username': username_data,
    'password': password.getFormData()
  };
  const status_message = document.getElementById('login-form-status-message');
  try {
    const response = await fetch('/server/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    console.log(response_json);
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = `Logged in successfully as: ${username_data}`;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'Message failed to send. Please report this bug.';
  }
  const button = document.getElementById('login-form-button');
  button.disabled = false;
  button.innerText = 'Login';
}

/**
 * Login error code to message
 * @param {number} 
 */