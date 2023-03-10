// @ts-check
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
  form.id = 'activate-form';
  form.name = 'activate-form';
  const form_sm = document.createElement('div');
  form_sm.id = 'activate-form-status-message';
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
    onetime_code.setAttribute('style', 'display: none;');

    form_button.id = 'activate-form-button';
    form_button.innerHTML = 'Activate';

    form.appendChild(username);
    form.appendChild(form_button_email);
    form.appendChild(form_sm_email);

    form_button_email.addEventListener('click', () => {
      recaptchaCallback(grecaptcha, async () => {
        if (await sendVerificationEmail(form_sm_email, username)) {
          form_button_email.remove();
          form.appendChild(onetime_code);
          form.appendChild(form_button);
          form.appendChild(form_sm);
        }
      }, form_button, form_sm, 'Sending Email');
    });
  }

  section_content.appendChild(form);
  const login_link = document.createElement('a');
  login_link.classList.add('login-prompt');
  login_link.href = '/login';
  login_link.innerText = 'Already activated your account? Click here to login';
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
    const response = await fetch('/server/verify_email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email': username.getFormData()}),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = 'Verification email sent. Enter the single use code below.';
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
 * Submits logout form to server
 */
async function submitLogoutForm() {
  document.cookie = '';
  document.location.href = '/server/logout.php';
}