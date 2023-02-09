import { verifyRecaptcha, public_recaptcha_site_key } from '../scripts/recaptcha.js';

window.onload = async () => {
  const lay_witness_section = document.getElementById('layWitness');
  if (lay_witness_section) {
    const lay_witness_input = document.getElementById('laywitness-file-upload');
    const lay_witness_form = document.getElementById('laywitness-form');
    lay_witness_form.setAttribute('style', 'display: none; visibility: visible;');
    lay_witness_input.addEventListener('change', () => {
      /** @type {File} */
      const file = lay_witness_input.files[0];
      if (!file) {
        lay_witness_form.setAttribute('style', 'display: none; visibility: visible;');
        return;
      }
      const status_message = document.getElementById('laywitness-form-status-message');
      if (file.type !== 'application/pdf') {
        lay_witness_input.value = '';
        lay_witness_form.setAttribute('style', 'display: none; visibility: visible;');
        status_message.setAttribute('style', 'display: block; color: red');
        status_message.innerText = 'Invalid filetype; please upload a pdf.';
        return;
      }
      lay_witness_form.setAttribute('style', 'display: block; visibility: visible;');
      status_message.setAttribute('style', 'display: none;');
      document.getElementById('section-laywitness').focusFirst();
    });
  }
  const paper_section = document.getElementById('positionPapers');
  if (paper_section) {
    const paper_input = document.getElementById('papers-file-upload');
    const paper_form = document.getElementById('papers-form');
    paper_form.setAttribute('style', 'display: none; visibility: visible;');
    paper_input.addEventListener('change', () => {
      /** @type {File} */
      const file = paper_input.files[0];
      if (!file) {
        paper_form.setAttribute('style', 'display: none; visibility: visible;');
        return;
      }
      const status_message = document.getElementById('papers-form-status-message');
      if (file.type !== 'application/pdf') {
        paper_input.value = '';
        paper_form.setAttribute('style', 'display: none; visibility: visible;');
        status_message.setAttribute('style', 'display: block; color: red');
        status_message.innerText = 'Invalid filetype; please upload a pdf.';
        return;
      }
      paper_form.setAttribute('style', 'display: block; visibility: visible;');
      status_message.setAttribute('style', 'display: none;');
      document.getElementById('section-papers').focusFirst();
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
  const status_message = document.getElementById('laywitness-form-status-message');

  const response = await fetch('./__data/lay_witness/lay_witness.json');
  const json_data = await response.json();
  const laywitness_section = document.getElementById('section-laywitness');
  const laywitness_section_data = laywitness_section.getFormData();
  const lay_witness_input = document.getElementById('laywitness-file-upload');
  /** @type {File} */
  const file = lay_witness_input.files[0];

  let submit_volume = undefined;
  for (const volume of json_data['volumes']) {
    if (volume['number'] == laywitness_section_data['volume']) {
      submit_volume = volume;
      break;
    }
  }
  if (!submit_volume) {
    submit_volume = {
      "number": laywitness_section_data['volume'],
      "year": 2022 + laywitness_section_data['volume'] - 40,
      "issues": [],
    };
    json_data['volumes'].push(submit_volume);
  }
  const issues = submit_volume['issues'];
  const new_issue = {
    "number": laywitness_section_data['issue'],
    "title": laywitness_section_data['title'],
  };
  if (laywitness_section_data['addendum']) {
    let max_addendum = 0;
    for (const issue of issues) {
      if (issue['addendum'] && issue['addendum'] > max_addendum) {
        max_addendum = issue['addendum'];
      }
    }
    new_issue['addendum'] = max_addendum + 1;
  }
  else if (laywitness_section_data['insert']) {
    let max_insert = 0;
    for (const issue of issues) {
      if (issue['insert'] && issue['insert'] > max_insert) {
        max_insert = issue['insert'];
      }
    }
    new_issue['insert'] = max_insert + 1;
  }
  else {
    for (const [i, issue] of issues.entries()) {
      if (issue['number'] === new_issue['number'] && !issue['addendum'] && !issue['insert']) {
        issues.splice(i, 1);
        break;
      }
    }
  }
  issues.push(new_issue);
  // sort by issue number, addendum, and insert, respectively
  issues.sort((a, b) => {
    if (a['number'] > b['number']) {
      return -1;
    }
    else if (a['number'] < b['number']) {
      return 1;
    }
    if (!a['addendum'] && !a['insert']) {
      return -1;
    }
    else if (!b['addendum'] && !b['insert']) {
      return 1;
    }
    if (a['addendum'] && !b['addendum']) {
      return -1;
    }
    else if (b['addendum'] && !a['addendum']) {
      return 1;
    }
    if (a['addendum'] && b['addendum']) {
      if (a['addendum'] > b['addendum']) {
        return 1;
      }
      if (a['addendum'] < b['addendum']) {
        return -1;
      }
    }
    if (a['insert'] && b['insert']) {
      if (a['insert'] > b['insert']) {
        return 1;
      }
      if (a['insert'] < b['insert']) {
        return -1;
      }
    }
    return 0;
  });
  // Sort volumes by number
  json_data['volumes'].sort((a, b) => {
    if (a['number'] > b['number']) {
      return -1;
    }
    else if (a['number'] < b['number']) {
      return 1;
    }
    return 0;
  });

  try {
    const response = await fetch('/server/admin_dashboard/laywitness_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'File upload succeeded';
      laywitness_section.clearFormData();
      const lay_witness_form = document.getElementById('laywitness-form');
      lay_witness_form.setAttribute('style', 'display: none;');
      const lay_witness_input = document.getElementById('laywitness-file-upload');
      lay_witness_input.value = '';
      uploadFile(new_issue, laywitness_section_data, file);
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = response_json;
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'File upload failed. Please report this bug.';
  }

  const button = document.getElementById('laywitness-form-button');
  button.disabled = false;
  button.innerText = 'Upload File';
  button.removeAttribute('style');
}

/**
 * Uploads file onto server
 * @param {{number:number, title:string, addendum?:boolean, insert?:boolean}} new_issue
 * @param {{volume:number, issue:number, title:string, addendum:boolean, insert:boolean}} laywitness_section_data
 * @param {File} file
 * @return {Promise<void>}
 */
async function uploadFile(new_issue, laywitness_section_data, file) {
  const status_message = document.getElementById('laywitness-form-status-message');
  const laywitness_section = document.getElementById('section-laywitness');

  const filename_extension = new_issue['addendum'] ? `-Addendum${new_issue['addendum']}` :
    (new_issue['insert'] ? `-Insert${new_issue['insert']}` : '');
  const filename = `/${laywitness_section_data['volume']}/` +
    `${laywitness_section_data['volume']}.${laywitness_section_data['issue']}` +
    `-Lay-Witness${filename_extension}.pdf`

  try {
    const response = await fetch('/server/admin_dashboard/laywitness_file.php', {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
        'X-File-Name': filename,
      },
      body: file,
    });
    const response_json = await response.json();
    if (response_json['success']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'File upload succeeded';
      laywitness_section.clearFormData();
      const lay_witness_form = document.getElementById('laywitness-form');
      lay_witness_form.setAttribute('style', 'display: none;');
      const lay_witness_input = document.getElementById('laywitness-file-upload');
      lay_witness_input.value = '';
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = response_json;
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'File upload failed. Please report this bug.';
  }
}