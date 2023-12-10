// @ts-nocheck
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {recaptchaCallback} = await import(`/scripts/recaptcha.js?v=${version}`);
const {createContactEmail, base_url, DEV} = await import(`/scripts/util.js?v=${version}`);

export async function onInit() {
  const donate_form_button = document.getElementById('donate-form-button');
  const status_message = document.getElementById('donate-form-status-message');
  if (!donate_form_button || !status_message) {
    throw new Error('Missing required elements');
  }

  donate_form_button.addEventListener('click', () => {
    if (!validateDonateForm()) {
      status_message.setAttribute('style', 'display: block; color: maroon;');
      status_message.innerText = 'Please fix the validation errors.';
      return;
    }
    recaptchaCallback(grecaptcha, () => {
      loadHostedForm();
    }, donate_form_button, status_message, 'Processing');
  });

  if (!DEV) {
    return;
  }
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  const donation_field = document.getElementById('donation-amount');
  if (!name_section || !address_section || !contact_section || !message || !membership || !donation_field) {
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
  donation_field.form_field.value ='$12.32';
}

/**
 * Validates each section in donate form
 * @return {boolean} whether form field is valid.
 */
function validateDonateForm() {
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  const donation_field = document.getElementById('donation-amount');
  if (!name_section || !address_section || !contact_section || !message || !membership || !donation_field) {
    throw new Error('Missing required elements');
  }
  const name_section_valid = name_section.validate();
  const address_section_valid = address_section.validate();
  const contact_section_valid = contact_section.validate();
  const message_valid = message.validate();
  const membership_valid = membership.validate();
  const donation_field_valid = donation_field.validate();
  return name_section_valid && address_section_valid && contact_section_valid &&
    message_valid && membership_valid && donation_field_valid;
}

/**
 * Request server to provide hosted form token then proceed to hosted form
 * @return {Promise<void>}
 */
async function loadHostedForm() {
  const name_section = document.getElementById('section-name');
  const address_section = document.getElementById('section-address');
  const contact_section = document.getElementById('section-contact');
  const message = document.getElementById('section-message');
  const membership = document.getElementById('section-membership');
  const donation_field = document.getElementById('donation-amount');
  if (!name_section || !address_section || !contact_section || !message || !membership || !donation_field) {
    throw new Error('Missing required elements');
  }

  const name_section_data = name_section.getFormData();
  const address_section_data = address_section.getFormData();
  const contact_section_data = contact_section.getFormData();
  let donation_amount = donation_field.getFormData();
  if (donation_amount.startsWith('$')) {
    donation_amount = donation_amount.slice(1);
  }
  
  const order = {
    'description': 'donation',
  };
  const customer = {
    'email': contact_section_data['email'],
  };
  const billTo = {
    'firstName': name_section_data['first'],
    'lastName': name_section_data['last'],
    'address': address_section_data['address1'],
    'city': address_section_data['city'],
    'state': address_section_data['state'],
    'zip': address_section_data['zip'],
    'country': address_section_data['country'],
  };
  const transaction_request = {
    "transactionType": "authCaptureTransaction",
    "amount": donation_amount,
    "order": order,
    "customer": customer,
    "billTo": billTo
  };
  const hosted_payment_settings = {
    "setting": [{
      "settingName": "hostedPaymentReturnOptions",
      "settingValue": `{\"showReceipt\": true, \"url\": \"${base_url}/donate/receipt\", \"urlText\": \"Return to CUF.org\", \"cancelUrl\": \"${base_url}/donate\", \"cancelUrlText\": \"Cancel\"}`
    }, {
      "settingName": "hostedPaymentButtonOptions",
      "settingValue": "{\"text\": \"Donate\"}"
    }, {
      "settingName": "hostedPaymentStyleOptions",
      "settingValue": "{\"bgColor\": \"green\"}"
    }, {
      "settingName": "hostedPaymentPaymentOptions",
      "settingValue": "{\"cardCodeRequired\": true, \"showCreditCard\": true, \"showBankAccount\": false}"
    }, {
      "settingName": "hostedPaymentSecurityOptions",
      "settingValue": "{\"captcha\": true}"
    }, {
      "settingName": "hostedPaymentShippingAddressOptions",
      "settingValue": "{\"show\": false, \"required\": false}"
    }, {
      "settingName": "hostedPaymentBillingAddressOptions",
      "settingValue": "{\"show\": true, \"required\": true}"
    }, {
      "settingName": "hostedPaymentCustomerOptions",
      "settingValue": "{\"showEmail\": true, \"requiredEmail\": true, \"addPaymentProfile\": true}"
    }, {
      "settingName": "hostedPaymentOrderOptions",
      "settingValue": "{\"show\": true, \"merchantName\": \"CUF\"}"
    }, {
      "settingName": "hostedPaymentIFrameCommunicatorUrl",
      "settingValue": `{\"url\": \"${base_url}/donate/iframe_communicator.html\"}`
    }]
  };
  const post_data = {
    'getHostedPaymentPageRequest': {
      'transactionRequest': transaction_request,
      'hostedPaymentSettings': hosted_payment_settings
    }
  };

  // send email
  const name_section_email_data = name_section.getDisplayableData();
  const address_section_email_data = address_section.getDisplayableData();
  const message_data = message.getFormData();
  const membership_data = membership.getDisplayableData();
  const email_form_data = {'name': name_section_email_data, 'address': address_section_email_data,
    'contact': contact_section_data, 'message': message_data, 'membership': membership_data};
  const email_post_data = createContactEmail(email_form_data, false);
  try {
    await fetch('/server/donate_email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(email_post_data),
    });
  } catch(error) {
    console.log(error);
  }

  // post data to server
  const status_message = document.getElementById('donate-form-status-message');
  try {
    const response = await fetch('/server/donate.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    const token_input = document.getElementById('hidden-token-input');
    token_input.setAttribute('value', response_json["token"]);
    const donate_form = document.getElementById('donate-form');
    donate_form.submit();
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'Donation failed to process. Please report this bug.';
  }
}
