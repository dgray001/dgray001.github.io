import { verifyRecaptcha, public_recaptcha_site_key } from '../scripts/recaptcha.js';

window.onload = () => {
  const cookies = !document.cookie ? {} : document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
  console.log(cookies);
  const section_content = document.getElementById('form-section-content');
  if (cookies.hasOwnProperty('PHPSESSID')) {
    section_content.innerHTML = `
    <p>
      You are already logged in as ${cookies.email}. Please logout to switch accounts.
    </p>
    <form id="login-form" name="login-form" action="javascript:submitLogoutForm()">
      <div id="login-form-status-message"></div>
      <button class="form-submit-button" id="logout-form-button" onclick="submitLogoutFormButton()" type="button">
        Logout
      </button>
    </form>`;
  }
  else {
    section_content.innerHTML = `
    <form id="login-form" name="login-form" action="javascript:submitLoginForm()">
      <cuf-input-text
        id="username-field"
        flex_option="1"
        validators='["required", "email"]'>
        Login ID
      </cuf-input-text>
      <cuf-input-text
        id="password-field"
        flex_option="1"
        validators='["required"]'>
        Password
      </cuf-input-text>
      <div id="login-form-status-message"></div>
      <button class="form-submit-button" id="login-form-button" onclick="submitLoginFormButton()" type="button">
        Login
      </button>
    </form>`;
  }
}

/**
 * @return {Promise<void>}
 * Submits login form if recaptcha token is valid
 */
window.submitLoginFormButton = async () => {
  if (!validateLoginForm()) {
    return;
  }
  disableLoginFormButton(true);
  submitFormButton();
}

/**
 * @return {Promise<void>}
 * Submits logout form if recaptcha token is valid
 */
window.submitLogoutFormButton = async () => {
  disableLoginFormButton(false);
  submitFormButton();
}

/**
 * @return {Promise<void>}
 * Submits form
 */
async function submitFormButton() {
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
      status_message.innerText = 'reCaptcha validation has failed. ' +
        'If you are human, please report this false positive.';
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
 * Submits login form to server
 * @return {Promise<void>}
 */
window.submitLoginForm = async () => {
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
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = `Logged in successfully as: ${username_data}`;
      location.reload();
      return;
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
  enableLoginFormButton(true);
}

/**
 * Submits logout form to server
 * @return {Promise<void>}
 */
window.submitLogoutForm = async () => {
  document.cookie = '';
  document.location.href = '/server/logout.php';
}

/**
 * Disables login form button
 * @param {boolean} login_form
 */
function disableLoginFormButton(login_form) {
  const button_id = login_form ? 'login-form-button' : 'logout-form-button';
  const button = document.getElementById(button_id);
  button.disabled = true;
  button.innerText = 'Loading';
  button.setAttribute('style', 'box-shadow: none;');
}

/**
 * Enables login form button
 * @param {boolean} login_form
 */
function enableLoginFormButton(login_form) {
  const button_id = login_form ? 'login-form-button' : 'logout-form-button';
  const button = document.getElementById(button_id);
  button.disabled = false;
  button.innerText = login_form ? 'Login' : 'Logout';
  button.removeAttribute('style');
}