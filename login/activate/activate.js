// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {verifyRecaptcha, public_recaptcha_site_key} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies, loggedIn, until} = await import(`/scripts/util.js?v=${version}`);

window.on_load = async () => {
  await until(() => document.getElementById('form-section-content'));
  const section_content = document.getElementById('form-section-content');
  if (loggedIn()) {
    const cookies = clientCookies();
    section_content.innerHTML = `
    <p>
      You are already logged in as <b>${cookies.email}</b>. Please logout to switch accounts.
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
        label="Email Address"
        autocomplete="username">
      </cuf-input-text>
      <cuf-input-text
        id="code-field"
        flex_option="1"
        validators='["required"]'
        label="Single Use Code"
        autocomplete="one-time-code">
      </cuf-input-text>
      <div id="login-form-status-message"></div>
      <button class="form-submit-button" id="login-form-button" onclick="submitLoginFormButton()" type="button">
        Login
      </button>
    </form>
    <a class="login-prompt" href="/login">Already activated your account? Click here to login</a>`;
  }
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
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = 'reCaptcha validation has failed. ' +
        'If you are human, please report this false positive.';
    }
  });
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
 * Submits logout form to server
 * @return {Promise<void>}
 */
window.submitLogoutForm = async () => {
  document.cookie = '';
  document.location.href = '/server/logout.php?hard_redirect=/login/activate';
}