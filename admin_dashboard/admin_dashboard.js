'use strict';

import {verifyRecaptcha, public_recaptcha_site_key} from '../scripts/recaptcha.js';
import {until} from '../scripts/util.js';

window.onload = async () => {
  const lay_witness_section = document.getElementById('layWitness');
  if (lay_witness_section) {
    const lay_witness_title = lay_witness_section.querySelector('.section-title');
    const lay_witness_body = lay_witness_section.querySelector('.laywitness-body');
    lay_witness_title.addEventListener('click', () => {
      if (lay_witness_body.hasAttribute('style')) {
        lay_witness_body.removeAttribute('style');
      }
      else {
        lay_witness_body.setAttribute('style', 'display: none;');
      }
    });
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
    await updateLaywitnessList();
    const lay_witness_list = document.getElementById('current-laywitness');
    const edit_lay_witness_button = document.getElementById('edit-laywitness-button');
    edit_lay_witness_button.addEventListener('click', () => {
      if (lay_witness_list.getAttribute('style').includes('display: block')) {
        lay_witness_list.setAttribute('style', 'display: none; visibility: visible;');
        edit_lay_witness_button.innerText = 'Edit Lay Witness';
        return;
      }
      edit_lay_witness_button.innerText = 'Cancel';
      lay_witness_list.setAttribute('style', 'display: block; visibility: visible;');
    });
  }
  const news_section = document.getElementById('news');
  if (news_section) {
    const news_title = news_section.querySelector('.section-title');
    const news_body = news_section.querySelector('.news-body');
    news_title.addEventListener('click', () => {
      if (news_body.hasAttribute('style')) {
        news_body.removeAttribute('style');
      }
      else {
        news_body.setAttribute('style', 'display: none;');
      }
    });
    const add_news_button = document.getElementById('new-news-button');
    const news_form = document.getElementById('news-form');
    news_form.setAttribute('style', 'display: none; visibility: visible;');
    add_news_button.addEventListener('click', () => {
      const news_form = document.getElementById('news-form');
      if (news_form.getAttribute('style').includes('display: block')) {
        news_form.setAttribute('style', 'display: none; visibility: visible;');
        add_news_button.innerText = 'Add News';
        return;
      }
      add_news_button.innerText = 'Cancel';
      const status_message = document.getElementById('news-form-status-message');
      news_form.setAttribute('style', 'display: block; visibility: visible;');
      status_message.setAttribute('style', 'display: none;');
      document.getElementById('section-news').focusFirst();
    });
    await updateNewsList();
    const news_list = document.getElementById('current-news');
    const edit_news_button = document.getElementById('edit-news-button');
    edit_news_button.addEventListener('click', () => {
      if (news_list.getAttribute('style').includes('display: block')) {
        news_list.setAttribute('style', 'display: none; visibility: visible;');
        edit_news_button.innerText = 'Edit News';
        return;
      }
      edit_news_button.innerText = 'Cancel';
      news_list.setAttribute('style', 'display: block; visibility: visible;');
    });
  }
  const paper_section = document.getElementById('positionPapers');
  if (paper_section) {
    const paper_title = paper_section.querySelector('.section-title');
    const paper_body = paper_section.querySelector('.papers-body');
    paper_title.addEventListener('click', () => {
      if (paper_body.hasAttribute('style')) {
        paper_body.removeAttribute('style');
      }
      else {
        paper_body.setAttribute('style', 'display: none;');
      }
    });
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
 * Updates current laywitness list
 * @return {Promise<void>}
 */
window.updateLaywitnessList = async () => {
  const laywitness_list = document.getElementById('current-laywitness');
  laywitness_list.replaceChildren();
  const laywitness_response = await fetch('./__data/lay_witness/lay_witness.json');
  const laywitness_data = await laywitness_response.json();
  for (const [i, volume] of laywitness_data['volumes'].entries()) {
    const volume_div = document.createElement('div');
    const issue_wrapper = document.createElement('div');
    issue_wrapper.setAttribute('style', 'display: none;');
    const volume_title = document.createElement('div');
    volume_title.innerHTML = `
      <div class="line-item clickable-piece">
        <span class="uneditable-content">Volume: </span>
        <span class="editable-content">${volume['number']} (${volume['year']})</span>
      </div>
    `;
    volume_title.addEventListener('click', () => {
      if (issue_wrapper.getAttribute('style')) {
        issue_wrapper.removeAttribute('style');
      }
      else {
        issue_wrapper.setAttribute('style', 'display: none;');
      }
    });
    volume_div.appendChild(volume_title);
    volume_div.appendChild(issue_wrapper);
    for (const [j, issue] of volume['issues'].entries()) {
      const issue_div = document.createElement('div');
      issue_div.innerHTML = `
        <div class="line-item">
          <span class="uneditable-content">Number: </span>
          <span class="editable-content">${issue['number']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Title: </span>
          <span class="editable-content">${issue['title']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Addendum: </span>
          <span class="editable-content">${!!issue['addendum']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Insert: </span>
          <span class="editable-content">${!!issue['insert']}</span>
        </div>
        <button class="over-piece left" id="edit-laywitness-button-${i}-${j}"
          onclick="editLaywitnessPiece(${i}, ${j})">Edit Issue</button>
        <button class="over-piece right" id="delete-laywitness-button-${i}-${j}"
          onclick="deleteLaywitnessPiece(${i}, ${j})">Delete Issue</button>
      `;
      issue_div.classList.add('editable-subpiece');
      issue_div.id = `editable-laywitness-piece-${i}-${j}`;
      issue_wrapper.appendChild(issue_div);
    }
    volume_div.classList.add('editable-piece');
    volume_div.id = `editable-laywitness-volume-piece-${i}`;
    laywitness_list.appendChild(volume_div);
  }
}

/**
 * Updates current news list
 * @return {Promise<void>}
 */
window.updateNewsList = async () => {
  const news_list = document.getElementById('current-news');
  news_list.replaceChildren();
  const news_response = await fetch('./__data/news/news.json');
  const news_data = await news_response.json();
  for (const [i, news_piece] of news_data['content'].entries()) {
    const news_div = document.createElement('div');
    news_div.innerHTML = `
      <div class="line-item">
        <span class="uneditable-content">Title: </span>
        <span class="editable-content">${news_piece['title']}</span>
      </div>
      <div class="line-item">
        <span class="uneditable-content">Title Link: </span>
        <span class="editable-content">
          <a target="_blank" href="${news_piece['titlelink']}">${news_piece['titlelink']}</a>
        </span>
      </div>
      <div class="line-item">
        <span class="uneditable-content">Description: </span>
        <span class="editable-content">${news_piece['description']}</span>
      </div>
      <button class="over-piece left" id="edit-news-button-${i}"
        onclick="editNewsPiece(${i})">Edit News Piece</button>
      <button class="over-piece right" id="delete-news-button-${i}"
        onclick="deleteNewsPiece(${i})">Delete News Piece</button>
    `;
    news_div.classList.add('editable-piece');
    news_div.id = `editable-news-piece-${i}`;
    news_list.appendChild(news_div);
  }
};

/**
 * Edits the laywitness piece at the input index
 * @param {number} i index of volume to edit
 * @param {number} j index of issue to edit
 * @return {Promise<void>}
 */
window.editLaywitnessPiece = async (i, j) => {
  const piece_div = document.getElementById(`editable-laywitness-piece-${i}-${j}`);
  const edit_button = document.getElementById(`edit-laywitness-button-${i}-${j}`);
  if (edit_button.classList.contains('editing')) {
    edit_button.innerText = 'Edit Issue';
    edit_button.classList.remove('editing');
    const laywitness_piece_form = document.getElementById(`laywitness-piece-form-${i}-${j}`);
    laywitness_piece_form.remove();
    return;
  }
  edit_button.innerText = 'Cancel';
  edit_button.classList.add('editing');
  piece_div.innerHTML += `
    <form id="laywitness-piece-form-${i}-${j}" action="javascript:editUpdateLaywitnessPiece(${i}, ${j})">
      <br><label for="laywitness-file-upload-${i}-${j}">Update Lay Witness PDF:</label><br>
      <input id="laywitness-file-upload-${i}-${j}" type="file" accept="application/pdf">
      <cuf-form-section-laywitness id="section-laywitness-${i}-${j}"></cuf-form-section-laywitness>
      <button class="form-submit-button" id="laywitness-piece-form-button-${i}-${j}" type="submit">Update Laywitness</button>
    </form>
  `;
  const laywitness_response = await fetch('./__data/lay_witness/lay_witness.json');
  const laywitness_data = await laywitness_response.json();
  const volume = laywitness_data['volumes'][i]['number'];
  const issue = laywitness_data['volumes'][i]['issues'][j];
  const laywitness_piece_form_section = document.getElementById(`section-laywitness-${i}-${j}`);
  await until(() => laywitness_piece_form_section.form_fields.length == 5);
  laywitness_piece_form_section.setFormData(volume, issue);
  laywitness_piece_form_section.focusFirst();
};

/**
 * Edits the news piece at the input index
 * @param {number} i index of news to edit
 * @return {Promise<void>}
 */
window.editNewsPiece = async (i) => {
  const piece_div = document.getElementById(`editable-news-piece-${i}`);
  const edit_button = document.getElementById(`edit-news-button-${i}`);
  if (edit_button.classList.contains('editing')) {
    edit_button.innerText = 'Edit News Piece';
    edit_button.classList.remove('editing');
    const news_piece_form = document.getElementById(`news-piece-form-${i}`);
    news_piece_form.remove();
    return;
  }
  edit_button.innerText = 'Cancel';
  edit_button.classList.add('editing');
  piece_div.innerHTML += `
    <form id="news-piece-form-${i}" action="javascript:editUpdateNewsPiece(${i})">
      <cuf-form-section-news id="section-news-${i}"></cuf-form-section-news>
      <button class="form-submit-button" id="news-piece-form-button-${i}" type="submit">Update News</button>
    </form>
  `;
  const news_response = await fetch('./__data/news/news.json');
  const news_data = await news_response.json();
  const news_piece_form_section = document.getElementById(`section-news-${i}`);
  await until(() => news_piece_form_section.form_fields.length == 3);
  news_piece_form_section.setFormData(news_data['content'][i]);
  news_piece_form_section.focusFirst();
};

/**
 * Edits laywitness piece from edit form data
 * @param {number} i index of volume to edit
 * @param {number} j index of issue to edit
 * @return {Promise<void>}
 */
window.editUpdateLaywitnessPiece = async (i, j) => {
  const edit_button = document.getElementById(`laywitness-piece-form-button-${i}-${j}`);
  edit_button.disabled = true;
  edit_button.innerText = 'Editing';
  const laywitness_response = await fetch('./__data/lay_witness/lay_witness.json');
  const laywitness_data = await laywitness_response.json();
  const volume = laywitness_data['volumes'][i]['number'];
  const issue = laywitness_data['volumes'][i]['issues'][j];
  laywitness_data['volumes'][i]['issues'].splice(j, 1);
  if (!laywitness_data['volumes'][i]['issues'].length) {
    laywitness_data['volumes'].splice(i, 1);
  }
  const filename = laywitnessFilename(volume, issue);
  const laywitness_piece_input = document.getElementById(`laywitness-file-upload-${i}-${j}`);
  /** @type {File} */
  let laywitness_pdf = laywitness_piece_input.files[0];
  if (!laywitness_pdf) {
    const laywitness_pdf_response = await fetch(`./__data/lay_witness/${filename}`);
    const laywitness_pdf_blob = await laywitness_pdf_response.blob();
    laywitness_pdf = new File([laywitness_pdf_blob], filename.split('/')[-1], {
      type: "application/pdf",
    });
  }
  const laywitness_piece_form_section = document.getElementById(`section-laywitness-${i}-${j}`);
  const laywitness_section_data = laywitness_piece_form_section.getFormData();
  const {post_data, new_issue} = processLaywitnessFormData(laywitness_data, laywitness_section_data);
  const new_filename = laywitnessFilename(laywitness_section_data['volume'], new_issue);

  try {
    // Delete old file
    const delete_response = await fetch('/server/admin_dashboard/laywitness_file_delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
      }),
    });
    const delete_response_json = await delete_response.json();
    if (!delete_response_json['success']) {
      throw new Error('Delete old file failed');
    }
    // Update json data
    const data_response = await fetch('/server/admin_dashboard/laywitness_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    });
    const data_response_json = await data_response.json();
    if (!data_response_json['success']) {
      throw new Error('Update laywitness data failed');
    }
    // Upload new file
    const file_response = await fetch('/server/admin_dashboard/laywitness_file.php', {
      method: 'POST',
      headers: {
        'Content-Type': laywitness_pdf.type,
        'X-File-Name': new_filename,
      },
      body: laywitness_pdf,
    });
    const file_response_json = await file_response.json();
    if (!file_response_json['success']) {
      throw new Error('Update file failed');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateLaywitnessList();
  }
};

/**
 * Edits news piece from edit form data
 * @param {number} i index of news to edit
 * @return {Promise<void>}
 */
window.editUpdateNewsPiece = async (i) => {
  const edit_button = document.getElementById(`news-piece-form-button-${i}`);
  edit_button.disabled = true;
  edit_button.innerText = 'Editing';
  const news_response = await fetch('./__data/news/news.json');
  const news_data = await news_response.json();
  const news_piece_form_section = document.getElementById(`section-news-${i}`);
  const news_section_data = news_piece_form_section.getFormData();
  const new_news = {
    'title': news_section_data['title'],
    'description': news_section_data['description'],
  };
  if (news_section_data['titlelink']) {
    new_news['titlelink'] = news_section_data['titlelink'];
  }
  news_data['content'][i] = new_news;
  try {
    const response = await fetch('/server/admin_dashboard/news_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(news_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
    }
    else {
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateNewsList();
  }
};

/**
 * Deletes the laywitness issue at the input index
 * @param {number} i index of volume to delete
 * @param {number} j index of issue to delete
 * @return {Promise<void>}
 */
window.deleteLaywitnessPiece = async (i, j) => {
  const delete_button = document.getElementById(`delete-laywitness-button-${i}-${j}`);
  delete_button.disabled = true;
  delete_button.innerText = 'Deleting';
  const lay_witness_response = await fetch('./__data/lay_witness/lay_witness.json');
  const lay_witness_data = await lay_witness_response.json();
  const volume = lay_witness_data['volumes'][i]['number'];
  const issue = lay_witness_data['volumes'][i]['issues'][j];
  const filename = laywitnessFilename(volume, issue);
  lay_witness_data['volumes'][i]['issues'].splice(j, 1);
  if (!lay_witness_data['volumes'][i]['issues'].length) {
    lay_witness_data['volumes'].splice(i, 1);
  }
  try {
    // Update data
    const response = await fetch('/server/admin_dashboard/laywitness_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lay_witness_data),
    });
    const response_json = await response.json();
    if (!response_json['success']) {
      throw new Error('Updating laywitness data failed');
    }
    // Delete file
    const delete_response = await fetch('/server/admin_dashboard/laywitness_file_delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
      }),
    });
    const delete_response_json = await delete_response.json();
    if (!delete_response_json['success']) {
      throw new Error('Delete laywitness file failed');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateLaywitnessList();
  }
};

/**
 * Deletes the news piece at the input index
 * @param {number} i index of news to delete
 * @return {Promise<void>}
 */
window.deleteNewsPiece = async (i) => {
  const delete_button = document.getElementById(`delete-news-button-${i}`);
  delete_button.disabled = true;
  delete_button.innerText = 'Deleting';
  const news_response = await fetch('./__data/news/news.json');
  const news_data = await news_response.json();
  news_data['content'].splice(i, 1);
  try {
    const response = await fetch('/server/admin_dashboard/news_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(news_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateNewsList();
  }
};

/**
 * Submits laywitness form if recaptcha token is valid
 * @return {Promise<void>}
 */
window.submitLaywitnessFormButton = async () => {
  if (!validateLaywitnessForm()) {
    return;
  }
  const button = document.getElementById('laywitness-form-button');
  const status_message = document.getElementById('laywitness-form-status-message');
  const laywitness_form = document.getElementById('laywitness-form');
  submitFormButton(button, status_message, laywitness_form);
};

/**
 * Submits news form if recaptcha token is valid
 * @return {Promise<void>}
 */
window.submitNewsFormButton = async () => {
  if (!validateNewsForm()) {
    return;
  }
  const button = document.getElementById('news-form-button');
  const status_message = document.getElementById('news-form-status-message');
  const news_form = document.getElementById('news-form');
  submitFormButton(button, status_message, news_form);
};

/**
 * Submits paper form if recaptcha token is valid
 * @return {Promise<void>}
 */
window.submitPaperFormButton = async () => {
  if (!validatePaperForm()) {
    return;
  }
  const button = document.getElementById('papers-form-button');
  const status_message = document.getElementById('papers-form-status-message');
  const paper_form = document.getElementById('papers-form');
  submitFormButton(button, status_message, paper_form);
};

/**
 * Submits input form if recaptcha is valid
 * @param {HTMLButtonElement} button
 * @param {HTMLDivElement} status_message
 * @param {HTMLFormElement} form
 * @return {Promise<void>}
 */
function submitFormButton(button, status_message, form) {
  button.disabled = true;
  button.innerText = 'Uploading';
  button.setAttribute('style', 'box-shadow: none;');
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute(public_recaptcha_site_key, {action: 'submit'});
    const recaptcha_check = await verifyRecaptcha(token);
    if (recaptcha_check) {
      form.submit();
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
 * Validates each section in news form
 * @return {boolean} whether form field is valid.
 */
function validateNewsForm() {
  const news_section = document.getElementById('section-news');
  return news_section.validate();
}

/**
 * Validates each section in paper form
 * @return {boolean} whether form field is valid.
 */
function validatePaperForm() {
  const paper_section = document.getElementById('section-papers');
  return paper_section.validate();
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

  const {post_data, new_issue} = processLaywitnessFormData(json_data, laywitness_section_data);

  try {
    const response = await fetch('/server/admin_dashboard/laywitness_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'Data upload succeeded';
      laywitness_section.clearFormData();
      const lay_witness_form = document.getElementById('laywitness-form');
      lay_witness_form.setAttribute('style', 'display: none;');
      const lay_witness_input = document.getElementById('laywitness-file-upload');
      lay_witness_input.value = '';
      uploadLaywitnessFile(new_issue, laywitness_section_data, file);
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
  await updateLaywitnessList();
};

/**
 * Processes laywitness form data
 * @param {json} post_data current json data
 * @param {json} form_data
 * @return {{post_data: json, new_issue: json}} data ready to post to server
 */
function processLaywitnessFormData(post_data, form_data) {
  let submit_volume = undefined;
  for (const volume of post_data['volumes']) {
    if (volume['number'] == form_data['volume']) {
      submit_volume = volume;
      break;
    }
  }
  if (!submit_volume) {
    submit_volume = {
      "number": form_data['volume'],
      "year": 2022 + form_data['volume'] - 40,
      "issues": [],
    };
    post_data['volumes'].push(submit_volume);
  }
  const issues = submit_volume['issues'];
  const new_issue = {
    "number": form_data['issue'],
    "title": form_data['title'],
  };
  if (form_data['addendum']) {
    let max_addendum = 0;
    for (const issue of issues) {
      if (issue['addendum'] && issue['addendum'] > max_addendum) {
        max_addendum = issue['addendum'];
      }
    }
    new_issue['addendum'] = max_addendum + 1;
  }
  else if (form_data['insert']) {
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
  post_data['volumes'].sort((a, b) => {
    if (a['number'] > b['number']) {
      return -1;
    }
    else if (a['number'] < b['number']) {
      return 1;
    }
    return 0;
  });
  return {post_data, new_issue};
}

/**
 * Submits news form to server
 * @return {Promise<void>}
 */
window.submitNewsForm = async () => {
  const status_message = document.getElementById('news-form-status-message');

  const response = await fetch('./__data/news/news.json');
  const json_data = await response.json();
  const news_section = document.getElementById('section-news');
  const news_section_data = news_section.getFormData();
  const new_news = {
    'title': news_section_data['title'],
    'description': news_section_data['description'],
  };
  if (news_section_data['titlelink']) {
    new_news['titlelink'] = news_section_data['titlelink'];
  }
  json_data['content'].unshift(new_news);

  try {
    const response = await fetch('/server/admin_dashboard/news_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'Data upload succeeded';
      news_section.clearFormData();
      const news_form = document.getElementById('news-form');
      news_form.setAttribute('style', 'display: none;');
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = response_json;
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'News upload failed. Please report this bug.';
  }
  
  const button = document.getElementById('news-form-button');
  button.disabled = false;
  button.innerText = 'Upload News';
  button.removeAttribute('style');
  const news_button = document.getElementById('new-news-button');
  news_button.innerText = 'Add News';
  await updateNewsList();
};

/**
 * Submits paper form to server
 * @return {Promise<void>}
 */
window.submitPaperForm = async () => {
  const status_message = document.getElementById('papers-form-status-message');

  const response = await fetch('./__data/papers/papers.json');
  const json_data = await response.json();
  const paper_section = document.getElementById('section-papers');
  const paper_section_data = paper_section.getFormData();
  const paper_input = document.getElementById('papers-file-upload');
  /** @type {File} */
  const file = paper_input.files[0];
  const new_paper = {
    'title': paper_section_data['title'],
    'titlelink': `./__data/articles/${file.name}`,
  };
  if (paper_section_data.description) {
    new_paper['description'] = paper_section_data['description'];
  }
  json_data['content'].unshift(new_paper);

  try {
    const response = await fetch('/server/admin_dashboard/papers_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json_data),
    });
    const response_json = await response.json();
    if (response_json['success']) {
      status_message.setAttribute('style', 'display: block; color: green');
      status_message.innerText = 'Data upload succeeded';
      paper_section.clearFormData();
      const paper_form = document.getElementById('papers-form');
      paper_form.setAttribute('style', 'display: none;');
      uploadPaperFile(file.name, file);
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

  const button = document.getElementById('papers-form-button');
  button.disabled = false;
  button.innerText = 'Upload File';
  button.removeAttribute('style');
};

/**
 * Uploads laywitness file onto server
 * @param {{number:number, title:string, addendum?:boolean, insert?:boolean}} new_issue
 * @param {{volume:number, issue:number, title:string, addendum:boolean, insert:boolean}} laywitness_section_data
 * @param {File} file
 * @return {Promise<void>}
 */
async function uploadLaywitnessFile(new_issue, laywitness_section_data, file) {
  const status_message = document.getElementById('laywitness-form-status-message');
  const laywitness_section = document.getElementById('section-laywitness');
  const filename = laywitnessFilename(laywitness_section_data['volume'], new_issue);

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

/**
 * Processes laywitness pdf filename from issue json
 * @param {number} volume
 * @param {json} issue
 * @return {string} filename
 */
function laywitnessFilename(volume, issue) {
  const filename_extension = issue['addendum'] ? `-Addendum${issue['addendum']}` :
    (issue['insert'] ? `-Insert${issue['insert']}` : '');
  return `/${volume}/${volume}.${issue['number']}-Lay-Witness${filename_extension}.pdf`
}

/**
 * Uploads paper file onto server
 * @param {string} filename
 * @param {File} file
 * @return {Promise<void>}
 */
async function uploadPaperFile(filename, file) {
  const status_message = document.getElementById('papers-form-status-message');
  const paper_section = document.getElementById('section-papers');
  try {
    const response = await fetch('/server/admin_dashboard/papers_file.php', {
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
      paper_section.clearFormData();
      const paper_form = document.getElementById('papers-form');
      paper_form.setAttribute('style', 'display: none;');
      const paper_input = document.getElementById('papers-file-upload');
      paper_input.value = '';
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