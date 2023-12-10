// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies, loggedIn} = await import(`/scripts/util.js?v=${version}`);

export async function onInit() {
  const section_content = document.getElementById('form-section-content');
  if (!section_content) {
    throw new Error('Missing required elements');
  }

  const form = document.createElement('form');
  form.id = 'reset-password-form';
  form.name = 'reset-password-form';
  const form_sm = document.createElement('div');
  form_sm.id = 'reset-password-form-status-message';
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
    form.appendChild(form_button);
    form.appendChild(form_sm);
  }
  else {
    const username = document.createElement('cuf-input-text');
    username.id = 'username-field';
    username.setAttribute('flex_option', '3');
    username.setAttribute('validators', '["required", "email"]');
    username.setAttribute('label', 'Email Address');
    username.setAttribute('autocomplete', 'username');

    const form_button_email = document.createElement('button');
    form_button_email.classList.add('form-submit-button');
    form_button_email.type = 'button';
    form_button_email.id = 'send-email-form-button';
    form_button_email.innerHTML = 'Send Email';
    const form_sm_email = document.createElement('div');
    form_sm_email.id = 'send-email-status-message';

    const onetime_code = document.createElement('cuf-input-text');
    onetime_code.id = 'code-field';
    onetime_code.setAttribute('flex_option', '3');
    onetime_code.setAttribute('validators', '["required"]');
    onetime_code.setAttribute('label', 'Single Use Code');
    onetime_code.setAttribute('autocomplete', 'one-time-code');

    form_button.id = 'reset-password-form-button';
    form_button.innerHTML = 'Verify Email';

    form.appendChild(username);
    form.appendChild(form_button_email);
    form.appendChild(form_sm_email);
    const code_wrapper = document.createElement('div');
    code_wrapper.setAttribute('style', 'display: none;');
    code_wrapper.appendChild(onetime_code);
    code_wrapper.appendChild(form_button);
    code_wrapper.appendChild(form_sm);
    form.appendChild(code_wrapper);

    const form_button_password = document.createElement('button');
    form_button_password.classList.add('form-submit-button');
    form_button_password.type = 'button';
    form_button_password.id = 'set-password-form-button';
    form_button_password.innerHTML = 'Set Password';
    const form_sm_password = document.createElement('div');
    form_sm_password.id = 'set-password-status-message';

    const password1 = document.createElement('cuf-input-text');
    password1.id = 'set-password';
    password1.setAttribute('flex_option', '3');
    password1.setAttribute('validators', '["required", "password"]');
    password1.setAttribute('label', 'Password');
    password1.setAttribute('datatype', 'password');
    password1.setAttribute('autocomplete', 'new-password');

    const password2 = document.createElement('cuf-input-text');
    password2.id = 'confirm-password';
    password2.setAttribute('flex_option', '3');
    password2.setAttribute('validators', '["required", "password"]');
    password2.setAttribute('label', 'Confirm Password');
    password2.setAttribute('datatype', 'password');
    password2.setAttribute('autocomplete', 'new-password');

    const password_wrapper = document.createElement('div');
    password_wrapper.setAttribute('style', 'display: none;');
    password_wrapper.appendChild(password1);
    password_wrapper.appendChild(password2);
    password_wrapper.appendChild(form_button_password);
    password_wrapper.appendChild(form_sm_password);
    form.appendChild(password_wrapper);

    form_button_email.addEventListener('click', () => {
      if (!username.validate()) {
        return;
      }
      recaptchaCallback(grecaptcha, async () => {
        if (await sendVerificationEmail(form_sm_email, username)) {
          form_button_email.remove();
          code_wrapper.removeAttribute('style');
        }
      }, form_button_email, form_sm_email, 'Sending Email');
    });

    form_button.addEventListener('click', () => {
      if (!username.validate() || !onetime_code.validate()) {
        return;
      }
      recaptchaCallback(grecaptcha, async () => {
        if (await verifyEmail(form_sm, username.getFormData(), onetime_code.getFormData())) {
          form_button.remove();
          code_wrapper.setAttribute('style', 'display: none;');
          form_sm_email.setAttribute('style', 'display: block; color: green;');
          form_sm_email.innerText = 'Email verified. Please set a password.';
          password_wrapper.removeAttribute('style');
          onetime_code.disable();
        }
      }, form_button, form_sm, 'Verifying');
    });

    form_button_password.addEventListener('click', () => {
      if (!password1.validate() || !password1.validate()) {
        return;
      }
      if (password1.getFormData() !== password2.getFormData()) {
        form_sm_password.setAttribute('style', 'display: block; color: maroon;');
        form_sm_password.innerText = 'Passwords do not match.';
        return;
      }
      recaptchaCallback(grecaptcha, async () => {
        if (await setPassword(form_sm_password, username.getFormData(),
          onetime_code.getFormData(), password1.getFormData())) {
          if (loggedIn()) {
            form_button_password.remove();
            password_wrapper.setAttribute('style', 'display: none;');
            form_sm_email.setAttribute('style', 'display: block; color: green;');
            form_sm_email.innerText = 'Your password was successfully reset.';
            const profile_button = document.querySelector('cuf-header')
              .shadowRoot.querySelector('cuf-profile-button');
            if (profile_button && profile_button.shadowRoot) {
              profile_button.setProfileButton(profile_button.shadowRoot);
            }
          }
          else {
            form_sm_email.setAttribute('style', 'display: block; color: red;');
            form_sm_email.innerText = 'Error logging you in after account activation. Please report this bug.';
          }
        }
      }, form_button_password, form_sm_password, 'Setting');
    });
  }

  section_content.appendChild(form);
  const login_link = document.createElement('a');
  login_link.classList.add('login-prompt');
  login_link.href = '/login';
  login_link.innerText = 'Do you know your password? Click here to login';
  section_content.appendChild(login_link);
}

/**
 * Submits logout form to server
 * @param {HTMLDivElement} status_message
 * @param {HTMLElement} username
 * @return {Promise<boolean>} whether email was sent successfully
 */
async function sendVerificationEmail(status_message, username) {
  try {
    const response = await fetch('/server/verify_email_code.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email': username.getFormData(), 'expect_activated': 'true'}),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = 'Verification email sent. Enter the single use code below. The code will expire in 10 minutes.';
      username.disable();
      return true;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red;');
    status_message.innerText = 'Verification email failed to send. Please report this bug.';
  }
  return false;
}

/**
 * Submits single-use code to server
 * @param {HTMLDivElement} status_message
 * @param {string} email
 * @param {string} code
 * @return {Promise<boolean>} whether email was successfully verified
\ */
async function verifyEmail(status_message, email, code) {
  try {
    const response = await fetch('/server/verify_email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email': email, 'code': code, 'expect_activated': 'true'}),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = 'Single-use code successfully verified.';
      return true;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red;');
    status_message.innerText = 'Server error while verifying email. Please report this bug.';
  }
  return false;
}

/**
 * Submits new password to server
 * @param {HTMLDivElement} status_message
 * @param {string} email
 * @param {string} code will verify again the single-use code
 * @param {string} password
 * @return {Promise<boolean>} whether password was successfully set
\ */
async function setPassword(status_message, email, code, password) {
  try {
    const response = await fetch('/server/reset_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email': email, 'code': code, 'password': password}),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = 'Your password was successfully reset';
      return true;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red;');
    status_message.innerText = 'Server error setting password. Please report this bug.';
  }
  return false;
}

/**
 * Submits logout form to server
 */
async function submitLogoutForm() {
  document.cookie = '';
  document.location.href = '/server/logout.php';
}