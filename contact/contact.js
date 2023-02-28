// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {verifyRecaptcha, public_recaptcha_site_key} = await import(`/scripts/recaptcha.js?v=${version}`);
const {createContactEmail, scrollToElement} = await import(`/scripts/util.js?v=${version}`);

/**
 * @return {Promise<void>}
 * Submits contact form if recaptcha token is valid
 */
window.submitFormButton = async () => {
  if (!validateContactForm()) {
    return;
  }
  const button = document.getElementById('submit-form-button');
  button.disabled = true;
  button.innerText = 'Sending';
  button.setAttribute('style', 'box-shadow: none;');
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    const status_message = document.getElementById('contact-form-status-message');
    if (recaptcha_check) {
      const contact_form = document.getElementById('contact-form');
      contact_form.submit();
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = 'reCaptcha validation has failed. If you are human, please report this false positive.';
    }
  });
}

/**
 * Validates each section in contact form
 * @return {boolean} whether form field is valid.
 */
function validateContactForm() {
  const name_section = document.getElementById('section-name');
  const name_section_valid = name_section.validate();
  const address_section = document.getElementById('section-address');
  const address_section_valid = address_section.validate();
  const contact_section = document.getElementById('section-contact');
  const contact_section_valid = contact_section.validate();
  const message = document.getElementById('section-message');
  const message_valid = message.validate();
  const membership = document.getElementById('section-membership');
  const membership_valid = membership.validate();
  return name_section_valid && address_section_valid && contact_section_valid &&
    message_valid && membership_valid;
}

/**
 * Submits contact form to server
 * @return {Promise<void>}
 */
window.submitForm = async () => {
  const name_section = document.getElementById('section-name');
  const name_section_data = name_section.getDisplayableData();
  const address_section = document.getElementById('section-address');
  const address_section_data = address_section.getDisplayableData();
  const contact_section = document.getElementById('section-contact');
  const contact_section_data = contact_section.getFormData();
  const message = document.getElementById('section-message');
  const message_data = message.getFormData();
  const membership = document.getElementById('section-membership');
  const membership_data = membership.getDisplayableData();
  const form_data = {'name': name_section_data, 'address': address_section_data,
    'contact': contact_section_data, 'message': message_data, 'membership': membership_data};
  const post_data = createContactEmail(form_data);
  const status_message = document.getElementById('contact-form-status-message');
  try {
    const response = await fetch('/server/contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    if (response_json == 'true') {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'Message sent!';
      const contact_form = document.getElementById('contact-form-section');
      contact_form.remove();
      const receipt_message = document.getElementById('contact-form-receipt-message');
      receipt_message.setAttribute('style', 'display: block; color: green');
      receipt_message.innerText = 'Thank you for contacting us. We will be in touch with you soon.';
      const contact_form_header = document.getElementById('contact-form-header');
      scrollToElement(contact_form_header);
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = 'Message failed to send. Please report this bug.';
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'Message failed to send. Please report this bug.';
  }
}