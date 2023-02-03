import { verifyRecaptcha, public_recaptcha_site_key } from '../scripts/recaptcha.js';
import { base_url } from '../scripts/util.js';

/**
 * @return {Promise<void>}
 * Checks reCaptcha token then if it passes will redirect to hosted form
 */
window.donateFormButton = async () => {
  if (!validateDonateForm()) {
    return;
  }
  const button = document.getElementById('donate-form-button');
  button.disabled = true;
  button.innerText = 'Loading';
  button.setAttribute('style', 'box-shadow: none;');
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
 * Validates each section in donate form
 * @return {boolean} whether form field is valid.
 */
  function validateDonateForm() {
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
    const donation_field = document.getElementById('donation-amount');
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
  const name_section_data = name_section.getFormData();
  const address_section = document.getElementById('section-address');
  const address_section_data = address_section.getFormData();
  const contact_section = document.getElementById('section-contact');
  const contact_section_data = contact_section.getFormData();
  const message = document.getElementById('section-message');
  const message_data = message.getFormData();
  const membership = document.getElementById('section-membership');
  const membership_data = membership.getDisplayableData();
  let donation_amount = document.getElementById('donation-amount').getFormData();
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
  // post data to server
  try {
    const response = await fetch('/server/donate.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    console.log(response_json);
    const token_input = document.getElementById('hidden-token-input');
    token_input.setAttribute('value', response_json["token"]);
    const donate_form = document.getElementById('donate-form');
    donate_form.submit();
  } catch(error) {
    console.log(error);
  }
}