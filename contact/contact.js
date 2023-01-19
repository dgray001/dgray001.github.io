/**
 * @param {string} token
 * @return {void}
 * Submits contact form if recaptcha token is valid
 */
async function submitFormButton(token) {
  const recaptcha_check = await verifyRecaptcha(token);
  const success_message = document.getElementById('recaptcha-success-message');
  const error_message = document.getElementById('recaptcha-error-message');
  if (recaptcha_check) {
    success_message.setAttribute('style', 'display: block;');
    error_message.setAttribute('style', 'display: none;');
    const contact_form = document.getElementById('contact-form');
    //contact_form.submit();
  }
  else {
    success_message.setAttribute('style', 'display: none;');
    error_message.setAttribute('style', 'display: block;');
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