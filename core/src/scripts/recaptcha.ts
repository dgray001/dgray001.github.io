import { apiPost } from '@core/scripts/api';
import { until } from '@core/scripts/util';
import { public_recaptcha_site_key } from '@site/config/recaptcha';

/**
 * Frontend recaptcha api
 * Optionally returns whether the callback was successfully called
 * Also manages status message and button text / class
 */
export async function recaptchaCallback(
  callback: () => Promise<boolean | void> | boolean | void,
  button?: HTMLButtonElement,
  status_message?: HTMLElement,
  loading_text = 'Loading'
): Promise<boolean> {
  let button_original_text = '';
  if (button) {
    button_original_text = button.innerText;
    button.disabled = true;
    button.innerText = loading_text;
    button.classList.add('loading');
    if (status_message) {
      status_message.innerText = '';
    }
  } else if (status_message) {
    button_original_text = status_message.innerText;
    status_message.innerText = loading_text;
  }
  let success: boolean;
  let finished = false;

  if (DEV && typeof grecaptcha === 'undefined') {
    const callback_success = await callback();
    if (typeof callback_success === 'boolean') {
      success = callback_success;
    }
    return;
  }

  grecaptcha.ready(async function () {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {
      action: 'submit',
    });
    const response = await apiPost('recaptcha', token);
    success = response.success;
    if (success) {
      const callback_success = await callback();
      if (typeof callback_success === 'boolean') {
        success = callback_success;
      }
    } else if (status_message) {
      status_message.classList.add('error');
      status_message.innerText = response.error_message;
    }
    finished = true;
  });

  await until(() => finished);
  if (button) {
    button.disabled = false;
    button.innerText = button_original_text;
    button.classList.remove('loading');
  } else if (status_message) {
    status_message.innerText = button_original_text;
  }
  return success;
}
