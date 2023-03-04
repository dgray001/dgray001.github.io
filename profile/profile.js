// @ts-check
'use strict';

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {clientCookies, loggedIn} = await import(`/scripts/util.js?v=${version}`);

export function onInit() {
  if (!loggedIn()) {
    throw new Error('Tried to load profile but not logged in.');
  }

  const email = document.getElementById('info-email');
  const role = document.getElementById('info-role');
  const change_password = document.getElementById('change-password');
  const change_password_sm = document.getElementById('change-password-sm');
  if (!email || !role || !change_password) {
    throw new Error('Missing needed elements');
  }

  const cookies = clientCookies();
  email.innerHTML = cookies['email'];
  role.innerHTML = cookies['role'];
  change_password.addEventListener('click', async () => {
    const success = await recaptchaCallback(grecaptcha, async () => {
      window.location.href = '/profile/verify_email?redirect=/profile/reset_password';
    }, change_password, change_password_sm);
    console.log(success);
  });
}