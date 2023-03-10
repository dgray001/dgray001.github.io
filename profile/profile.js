// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies, loggedIn} = await import(`/scripts/util.js?v=${version}`);

export function onInit() {
  if (!loggedIn()) {
    throw new Error('Tried to load profile but not logged in.');
  }

  const email = document.getElementById('info-email');
  const role = document.getElementById('info-role');
  const change_password = document.getElementById('change-password');
  const change_password_form = document.getElementById('change-password-form');
  const change_password_button = document.getElementById('change-password-form-button');
  const change_password_sm = document.getElementById('change-password-status-message');
  const password_old = document.getElementById('change-password-old');
  const password_new = document.getElementById('change-password-new');
  const password_confirm = document.getElementById('change-password-confirm');
  if (!email || !role || !change_password || !change_password_form || !change_password_button ||
    !change_password_sm || !password_old || !password_new || !password_confirm) {
    throw new Error('Missing needed elements');
  }

  const cookies = clientCookies();
  email.innerHTML = cookies['email'];
  role.innerHTML = cookies['role'];

  change_password.addEventListener('click', () => {
    if (change_password_form.hasAttribute('style')) {
      change_password_form.removeAttribute('style');
      change_password.innerHTML = "Cancel";
    }
    else {
      change_password_form.setAttribute('style', 'display: none;');
      change_password.innerHTML = "Change Password";
    }
  });

  change_password_button.addEventListener('click', () => {
    if (!password_old.validate() || !password_new.validate() || !password_confirm.validate()) {
      return;
    }
    if (password_new.getFormData() !== password_confirm.getFormData()) {
      change_password_sm.setAttribute('style', 'display: block; color: maroon;');
      change_password_sm.innerText = 'Passwords do not match.';
      return;
    }
    recaptchaCallback(grecaptcha, async () => {
      if (await changePassword(change_password_sm, cookies['email'],
        password_old.getFormData(), password_new.getFormData())) {
        change_password_form.setAttribute('style', 'display: none;');
        change_password.innerHTML = "Change Password";
      }
    }, change_password_button, change_password_sm, 'Changing');
  });
}

/**
 * Submits change password request to the server
 * @param {HTMLElement} status_message
 * @param {string} email
 * @param {string} old_password
 * @param {string} new_password
 * @return {Promise<boolean>} whether password was successfully reset
 */
async function changePassword(status_message, email, old_password, new_password) {
  try {
    const response = await fetch('/server/change_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email': email, 'old_password': old_password, 'new_password': new_password}),
    });
    const response_json = await response.json();
    if (response_json['valid']) {
      status_message.setAttribute('style', 'display: block; color: green;');
      status_message.innerText = 'Password successfully changed.';
      return true;
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = response_json; // display echo message to user
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red;');
    status_message.innerText = 'Server failed to change password. Please report this bug.';
  }
  return false;
}