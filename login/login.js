// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies, loggedIn, DEV} = await import(`/scripts/util.js?v=${version}`);

export async function onInit() {
  const section_content = document.getElementById('form-section-content');
  if (!section_content) {
    throw new Error('Missing required elements');
  }

  const form = document.createElement('form');
  form.id = 'login-form';
  form.name = 'login-form';
  const form_sm = document.createElement('div');
  form_sm.id = 'login-form-status-message';
  const form_button = document.createElement('button');
  form_button.classList.add('form-submit-button');
  form_button.type = 'button';

  if (loggedIn()) {
    const cookies = clientCookies();
    const already_logged_in = document.createElement('p');
    already_logged_in.innerHTML =
      `You are already logged in as <b>${cookies.email}</b>. Please logout to switch accounts.`;
    section_content.appendChild(already_logged_in);
    form_button.id = 'logout-form-button';
    form_button.innerHTML = 'Logout';
    form_button.addEventListener('click', () => {
      recaptchaCallback(grecaptcha, () => {
        submitLogoutForm();
      }, form_button, form_sm, 'Logging Out');
    });
  }
  else {
    form.innerHTML = `
      <cuf-input-text
        id="username-field"
        flex_option="1"
        validators='["required", "email"]'
        label="Login ID (email)"
        autocomplete="username">
      </cuf-input-text>
      <cuf-input-text
        id="password-field"
        flex_option="1"
        validators='["required"]'
        label="Password"
        datatype="password"
        helper-text="<a href='/login/reset_password'>Forgot password? Click here</a>"
        autocomplete="current-password">
      </cuf-input-text>
    `;
    form_button.id = 'login-form-button';
    form_button.innerHTML = 'Login';
    form_button.addEventListener('click', () => {
      if (!validateLoginForm()) {
        form_sm.setAttribute('style', 'display: block; color: maroon;');
        form_sm.innerText = 'Please fix the validation errors.';
        return;
      }
      recaptchaCallback(DEV ? undefined : grecaptcha, () => {
        submitLoginForm();
      }, form_button, form_sm, 'Logging In');
    });
    /*const forgot_password = document.createElement('a');
    forgot_password.innerHTML = 'Forgot Password?';
    forgot_password.classList.add('forgot-password');
    forgot_password.href = '/login/reset_password';
    form.appendChild(forgot_password);*/
  }

  form.appendChild(form_button);
  form.appendChild(form_sm);
  section_content.appendChild(form);
  const activate_link = document.createElement('a');
  activate_link.classList.add('activate-account');
  activate_link.href = '/login/activate';
  activate_link.innerText = 'Don\'t have login credentials yet? Click here to activate your account';
  section_content.appendChild(activate_link);

  const url_params = new URLSearchParams(window.location.search);
  if (url_params.get('redirect')) {
    form_sm.setAttribute('style', 'display: block; color: navy;');
    form_sm.innerText = `Please login to gain access to this page.`;
  }
}

/**
 * Validates each section in contact form
 * @return {boolean} whether form field is valid.
 */
function validateLoginForm() {
  const username = document.getElementById('username-field');
  const password = document.getElementById('password-field');
  if (!username || !password) {
    throw new Error('Missing required elements');
  }
  const username_valid = username.validate();
  const password_valid = password.validate();
  return username_valid && password_valid;
}

/**
 * Submits login form to server
 * @return {Promise<void>}
 */
async function submitLoginForm() {
  const username = document.getElementById('username-field');
  const password = document.getElementById('password-field');
  const status_message = document.getElementById('login-form-status-message');
  if (!username || !password || !status_message) {
    throw new Error('Missing required elements');
  }

  const username_data = username.getFormData();
  const post_data = {
    'username': username_data,
    'password': password.getFormData()
  };
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
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = `Logged in successfully as: ${username_data}`;
      const url_params = new URLSearchParams(window.location.search);
      const redirect = url_params.get('redirect');
      if (redirect) {
        document.location.href = redirect;
      }
      else {
        document.location.href = '/';
      }
      return;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red;');
    status_message.innerText = 'Login failed. Please report this bug.';
  }
}

/**
 * Submits logout form to server
 * @return {Promise<void>}
 */
async function submitLogoutForm() {
  document.cookie = '';
  document.location.href = '/server/logout.php';
}