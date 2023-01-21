/**
 * @return {Promise<void>}
 * Checks reCaptcha token then if it passes will redirect to hosted form
 */
async function donateFormButton() {
  const button = document.getElementById('donate-form-button');
  button.disabled = true;
  button.innerText = 'Loading';
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    if (recaptcha_check) {
      loadHostedForm();
    }
    else {
      const status_message = document.getElementById('donate-form-status-message');
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = 'reCaptcha validation has failed. If you are human, please report this false positive.';
    }
  });
}

/**
 * @return {Promise<void>}
 * Request server to provide hosted form token then proceeds to hosted form
 */
async function loadHostedForm() {
  // Load test data for now ; will be taken from form submit in future
  const data = await fetch('./donate/test.json');
  const json_data = await data.json();
  // post data to server
  try {
    const response = await fetch('/server/donate.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json_data),
    });
    const response_json = await response.json();
    const token_input = document.getElementById('hidden-token-input');
    token_input.setAttribute('value', response_json["token"]);
    const form_button = document.getElementById('hidden-form-submit-button');
    form_button.click();
  } catch(error) {
    console.log(error);
  }
}