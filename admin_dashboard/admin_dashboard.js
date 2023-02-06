import { verifyRecaptcha, public_recaptcha_site_key } from '../scripts/recaptcha.js';

window.onload = async () => {
  const lay_witness_section = document.getElementById('layWitness');
  if (lay_witness_section) {
    const lay_witness_input = document.getElementById('laywitness-file-upload');
    const lay_witness_form = document.getElementById('laywitness-form');
    lay_witness_input.addEventListener('change', () => {
      /** @type {File} */
      const file = lay_witness_input.files[0];
      if (!file) {
        lay_witness_form.setAttribute('style', 'display: none;');
        return;
      }
      const status_message = document.getElementById('laywitness-form-status-message');
      if (file.type !== 'application/pdf') {
        lay_witness_input.value = '';
        lay_witness_form.setAttribute('style', 'display: none;');
        status_message.setAttribute('style', 'display: block; color: red');
        status_message.innerText = 'Invalid filetype; please upload a pdf.';
        return;
      }
      lay_witness_form.removeAttribute('style');
      status_message.setAttribute('style', 'display: none;');
    });
  }
};

/**
 * @return {Promise<void>}
 * Submits laywitness form if recaptcha token is valid
 */
window.submitLaywitnessFormButton = async () => {
  if (!validateLaywitnessForm()) {
    return;
  }
  const button = document.getElementById('laywitness-form-button');
  const status_message = document.getElementById('laywitness-form-status-message');
  const laywitness_form = document.getElementById('laywitness-form');
  submitFormButton(button, status_message, laywitness_form);
}

/**
 * Submits input form if recaptcha is valid
 * @param {HTMLButtonElement} button
 * @param {HTMLDivElement} status_message
 * @param {HTMLFormElement} laywitness_form
 * @return {Promise<void>}
 */
function submitFormButton(button, status_message, laywitness_form) {
  button.disabled = true;
  button.innerText = 'Uploading';
  button.setAttribute('style', 'box-shadow: none;');
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    if (recaptcha_check) {
      laywitness_form.submit();
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = 'reCaptcha validation has failed. If you are human, please report this false positive.';
    }
  });
}

/**
 * Validates each section in laywitness form
 * @return {boolean} whether form field is valid.
 */
function validateLaywitnessForm() {
  const laywitness_section = document.getElementById('section-laywitness');
  return laywitness_section.validate();
}

/**
 * Submits laywitness form to server
 * @return {Promise<void>}
 */
window.submitLaywitnessForm = async () => {
  console.log("submitting");
}