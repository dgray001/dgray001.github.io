// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {verifyRecaptcha, public_recaptcha_site_key} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies} = await import(`/scripts/util.js?v=${version}`);

window.onload = () => {
  const cookies = clientCookies();
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
        validators='["required", "email"]'
        label="Login ID"
        autocomplete="username">
      </cuf-input-text>
      <cuf-input-text
        id="password-field"
        flex_option="1"
        validators='["required"]'
        label="Password"
        datatype="password"
        autocomplete="current-password">
      </cuf-input-text>
      <div id="login-form-status-message"></div>
      <button class="form-submit-button" id="login-form-button" onclick="submitLoginFormButton()" type="button">
        Login
      </button>
    </form>`;
  }
  const url_params = new URLSearchParams(window.location.search);
  if (url_params.get('redirect')) {
    const status_message = document.getElementById('login-form-status-message');
    status_message.innerText = 'Please login to gain access to this page.';
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = `Logged in successfully as: ${username_data}`;
      const url_params = new URLSearchParams(window.location.search);
      if (url_params.get('redirect')) {
        document.location.href = url_params.get('redirect');
      }
      else {
        document.location.href = '/';
      }
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