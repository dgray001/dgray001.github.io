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
  const button = document.getElementById(use_iframe ? 'loadHostedForm_iframe' : 'loadHostedForm');
  button.disabled = true;
  setInterval(() => {}, 2000);
  const data = await fetch('./donate/test.json');
  const json_data = await data.json();
  const response = await fetch('https://apitest.authorize.net/xml/v1/request.api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json_data),
  });
  const response_json = await response.json();
  const token_input = document.getElementById(use_iframe ? 'tokenInput_iframe' : 'tokenInput');
  token_input.setAttribute('value', response_json['token']);
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

