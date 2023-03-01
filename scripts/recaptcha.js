const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {DEV, until} = await import(`/scripts/util.js?v=${version}`);

// reCaptcha public site key
export const public_recaptcha_site_key = DEV ?
  '6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1' :
  '6LcNpAskAAAAAKc6tm_rQ8FpJo-j6ftEVaWPu8Gk';

const disable_recaptcha = true;

/**
 * Frontend recaptcha api returning whether the token is valid
 * @param {string} token
 * @return {Promise<boolean>} recaptcha validation
 * @todo for reCaptcha values close to failure add manual check (is this needed?)
 */
export async function verifyRecaptcha(token) {
  try {
    const response = await fetch('/server/recaptcha.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token),
    });
    const response_json = await response.json();
    return !!response_json['success'];
  } catch(error) {
    console.log(error);
  }
  return false;
}

/**
 * @callback grecaptchaCallback
 * @return {Promise<boolean|undefined>}
 */

/**
 * Frontend recaptcha api returning whether the callback was successfully called
 * @param {any} grecaptcha
 * @param {grecaptchaCallback} callback should return true if successful
 * @param {HTMLButtonElement=} button
 * @param {HTMLElement=} status_message
 * @param {string} loading_text
 * @return {Promise<boolean>} whether callback was successfully called
 */
export async function recaptchaCallback(grecaptcha, callback, button, status_message, loading_text = 'Loading') {
  let button_original_text = '';
  if (button) {
    button_original_text = button.innerText;
    button.disabled = true;
    button.innerText = loading_text;
  }
  let success;

  if (DEV && disable_recaptcha) {
    success = !!(await callback());
    if (button) {
      button.disabled = false;
      button.innerText = button_original_text;
    }
    console.log('1');
    return success;
  }

  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    if (recaptcha_check) {
      success = !!(await callback());
      if (button) {
        button.disabled = false;
        button.innerText = button_original_text;
      }
      return;
    }
    else if (status_message) {
      status_message.setAttribute('style', 'display: block; color: red;');
      status_message.innerText = 'reCaptcha validation has failed. ' +
        'If you are human, please report this false positive.';
    }
    success = false;
  });

  await until(() => success !== undefined);
  return success;
}