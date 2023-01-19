/**
 * @param {string} token
 * @return {Promise<boolean>} valid recaptcha
 * Frontend recaptcha api returning whether the token is valid
 */
async function verifyRecaptcha(token) {
  try {
    const response = await fetch('/server/recaptcha.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token),
    });
    const response_json = await response.json();
    return response_json['success'];
  } catch(error) {
    console.log(error);
  }
  return false;
}

/**
 * @param {string} token
 * @return {void}
 * Submits contact form if recaptcha token is valid
 */
async function submitFormButton(token) {
  const recaptcha_check = await verifyRecaptcha(token);
  const error_message = document.getElementById('recaptcha-error-message');
  if (recaptcha_check) {
    error_message.setAttribute('style', 'visibility: hidden;');
    const contact_form = document.getElementById('contact-form');
    contact_form.submit();
  }
  else {
    error_message.setAttribute('style', 'visibility: visible;');
  }
}

/**
 * @return {void}
 * Submits contact form to server
 * @todo implement
 */
async function submitForm() {
  //
}