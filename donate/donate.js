/**
 * @param {string} token
 * @return {void}
 * Submits donate form if recaptcha token is valid
 */
async function submitFormButton(token) {
  const recaptcha_check = await verifyRecaptcha(token);
  const success_message = document.getElementById('recaptcha-success-message');
  const error_message = document.getElementById('recaptcha-error-message');
  if (recaptcha_check) {
    success_message.setAttribute('style', 'display: block;');
    error_message.setAttribute('style', 'display: none;');
    const donate_form = document.getElementById('contact-form');
    //donate_form.submit();
  }
  else {
    success_message.setAttribute('style', 'display: none;');
    error_message.setAttribute('style', 'display: block;');
  }
}

async function loadPage() {
  if (!window.AuthorizeNetIFrame) window.AuthorizeNetIFrame = {};
  window.AuthorizeNetIFrame.onReceiveCommunication = function(querystr) {
    const params = parseQueryString(querystr);
    const iframe = document.getElementById("add_payment");
    const iframe_wrapper = document.getElementById("iframe_wrapper");
    switch (params["action"]) {
      case "successfulSave":
        window.location.href = './receipt';
        break;
      case "cancel":
        iframe.setAttribute('src', '');
        iframe_wrapper.setAttribute('hidden', '');
        break;
      case "resizeWindow":
        const w = parseInt(params["width"]);
        const h = parseInt(params["height"]);
        iframe.style.width = w.toString() + "px";
        iframe.style.height = h.toString() + "px";
        break;
      case "transactResponse":
        iframe.setAttribute('src', '');
        iframe_wrapper.setAttribute('hidden', '');
        window.location.href = './receipt';
        break;
    }
  };
}

async function loadHostedForm(use_iframe) {
  // prevent repeat clicks
  const button = document.getElementById(use_iframe ? 'loadHostedForm_iframe' : 'loadHostedForm');
  button.disabled = true;
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
    const token_input = document.getElementById(use_iframe ? 'tokenInput_iframe' : 'tokenInput');
    token_input.setAttribute('value', response_json["token"]);
    if (use_iframe) {
      const iframe_wrapper = document.getElementById("iframe_wrapper");
      iframe_wrapper.removeAttribute('hidden');
      const send_token_element = document.getElementById("send_token");
      send_token_element.submit();
    }
    else {
      const form_button = document.getElementById('formButton');
      form_button.click();
    }
  } catch(error) {
    console.log(error);
  }
  button.disabled = false;
}

function parseQueryString(str) {
  const vars = [];
  const arr = str.split('&');
  let pair;
  for (var i = 0; i < arr.length; i++) {
    pair = arr[i].split('=');
    vars.push(pair[0]);
    vars[pair[0]] = decodeURI(pair[1]); // replaced unescape with decodeURI
  }
  return vars;
}