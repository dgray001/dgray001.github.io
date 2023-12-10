// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {createContactEmail, scrollToElement, DEV} = await import(`/scripts/util.js?v=${version}`);

export async function onInit() {
  const contact_form_button = document.getElementById('contact-form-button');
  const status_message = document.getElementById('contact-form-status-message');
  if (!contact_form_button || !status_message) {
    throw new Error('Missing required elements');
  }

  contact_form_button.addEventListener('click', () => {
    if (!validateContactForm()) {
      status_message.setAttribute('style', 'display: block; color: maroon;');
      status_message.innerText = 'Please fix the validation errors.';
      return;
    }
    recaptchaCallback(grecaptcha, () => {
      submitContactForm();
    }, contact_form_button, status_message, 'Sending');
  });

  if (!DEV) {
    return;
  }
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  if (!name_section || !address_section || !contact_section || !message || !membership) {
    throw new Error('Missing required elements');
  }

  name_section.setFormData({prefix: '', first: 'Rick', last: 'Roll', suffix: ''});
  address_section.setFormData({
    address1: 'Never gonna give you up',
    address2: '',
    city: 'Never gonna',
    state: 'let you down',
    country: 'France',
    zip: 'desert you',
  });
  contact_section.setFormData({email: 'rick@roll.com', phone: '1-800-beep-bop'});
  message.form_field.value = 'This is a message';
  membership.setFormData({member: false, associate: true, join_chapter: true, start_chapter: false});
}

/**
 * Validates each section in contact form
 * @return {boolean} whether form field is valid.
 */
function validateContactForm() {
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  if (!name_section || !address_section || !contact_section || !message || !membership) {
    throw new Error('Missing required elements');
  }

  const name_section_valid = name_section.validate();
  const address_section_valid = address_section.validate();
  const contact_section_valid = contact_section.validate();
  const message_valid = message.validate();
  const membership_valid = membership.validate();

  return name_section_valid && address_section_valid && contact_section_valid &&
    message_valid && membership_valid;
}

/**
 * Submits contact form to server
 * @return {Promise<void>}
 */
async function submitContactForm() {
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  if (!name_section || !address_section || !contact_section || !message || !membership) {
    throw new Error('Missing required elements');
  }

  const name_section_data = name_section.getDisplayableData();
  const address_section_data = address_section.getDisplayableData();
  const contact_section_data = contact_section.getFormData();
  const message_data = message.getFormData();
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
    if (response_json === 'true') {
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
