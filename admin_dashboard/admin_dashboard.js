// @ts-nocheck
'use strict';

import '../__components/admin_dashboard/admin_dashboard_laywitness/admin_dashboard_laywitness.js';

import {verifyRecaptcha, public_recaptcha_site_key} from '../scripts/recaptcha.js';
import {until} from '../scripts/util.js';

window.onload = async () => {
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
  const jobs_section = document.getElementById('jobsAvailable');
  if (jobs_section) {
    const jobs_title = jobs_section.querySelector('.section-title');
    const jobs_body = jobs_section.querySelector('.jobs-body');
    jobs_title.addEventListener('click', () => {
      if (jobs_body.hasAttribute('style')) {
        jobs_body.removeAttribute('style');
      }
      else {
        jobs_body.setAttribute('style', 'display: none;');
      }
    });
    const add_jobs_button = document.getElementById('new-jobs-button');
    const jobs_form = document.getElementById('jobs-form');
    jobs_form.setAttribute('style', 'display: none; visibility: visible;');
    add_jobs_button.addEventListener('click', () => {
      const jobs_form = document.getElementById('jobs-form');
      if (jobs_form.getAttribute('style').includes('display: block')) {
        jobs_form.setAttribute('style', 'display: none; visibility: visible;');
        add_jobs_button.innerText = 'Add Job';
        return;
      }
      add_jobs_button.innerText = 'Cancel';
      const status_message = document.getElementById('jobs-form-status-message');
      jobs_form.setAttribute('style', 'display: block; visibility: visible;');
      status_message.setAttribute('style', 'display: none;');
      document.getElementById('section-jobs').focusFirst();
    });
    await updateJobsList();
    const jobs_list = document.getElementById('current-jobs');
    const edit_jobs_button = document.getElementById('edit-jobs-button');
    edit_jobs_button.addEventListener('click', () => {
      if (jobs_list.getAttribute('style').includes('display: block')) {
        jobs_list.setAttribute('style', 'display: none; visibility: visible;');
        edit_jobs_button.innerText = 'Edit Jobs';
        return;
      }
      edit_jobs_button.innerText = 'Cancel';
      jobs_list.setAttribute('style', 'display: block; visibility: visible;');
    });
  }
};

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
 * Updates current jobs list
 * @return {Promise<void>}
 */
window.updateJobsList = async () => {
  const jobs_list = document.getElementById('current-jobs');
  jobs_list.replaceChildren();
  const jobs_response = await fetch('./__data/jobs_available/jobs_available.json');
  const jobs_data = await jobs_response.json();
  for (const [i, jobs_piece] of jobs_data['content'].entries()) {
    const jobs_div = document.createElement('div');
    jobs_div.innerHTML = `
      <div class="line-item">
        <span class="uneditable-content">Title: </span>
        <span class="editable-content">${jobs_piece['title']}</span>
      </div>
      <div class="line-item">
        <span class="uneditable-content">Description: </span>
        <span class="editable-content">${jobs_piece['description']}</span>
      </div>
      <button class="over-piece left" id="edit-jobs-button-${i}"
        onclick="editJobsPiece(${i})">Edit Job</button>
      <button class="over-piece right" id="delete-jobs-button-${i}"
        onclick="deleteJobsPiece(${i})">Delete Job</button>
    `;
    jobs_div.classList.add('editable-piece');
    jobs_div.id = `editable-jobs-piece-${i}`;
    jobs_list.appendChild(jobs_div);
  }
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
 * Edits the jobs piece at the input index
 * @param {number} i index of job to edit
 * @return {Promise<void>}
 */
window.editJobsPiece = async (i) => {
  const piece_div = document.getElementById(`editable-jobs-piece-${i}`);
  const edit_button = document.getElementById(`edit-jobs-button-${i}`);
  if (edit_button.classList.contains('editing')) {
    edit_button.innerText = 'Edit Job';
    edit_button.classList.remove('editing');
    const jobs_piece_form = document.getElementById(`jobs-piece-form-${i}`);
    jobs_piece_form.remove();
    return;
  }
  edit_button.innerText = 'Cancel';
  edit_button.classList.add('editing');
  piece_div.innerHTML += `
    <form id="jobs-piece-form-${i}" action="javascript:editUpdateJobPiece(${i})">
      <cuf-form-section-job id="section-jobs-${i}"></cuf-form-section-job>
      <button class="form-submit-button" id="jobs-piece-form-button-${i}" type="submit">Update Job</button>
    </form>
  `;
  const jobs_response = await fetch('./__data/jobs_available/jobs_available.json');
  const jobs_data = await jobs_response.json();
  const jobs_piece_form_section = document.getElementById(`section-jobs-${i}`);
  await until(() => jobs_piece_form_section.form_fields.length == 2);
  jobs_piece_form_section.setFormData(jobs_data['content'][i]);
  jobs_piece_form_section.focusFirst();
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
    if (!response_json['success']) {
      throw new Error('Update news data failed');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateNewsList();
  }
};

/**
 * Edits jobs piece from edit form data
 * @param {number} i index of job to edit
 * @return {Promise<void>}
 */
window.editUpdateJobPiece = async (i) => {
  const edit_button = document.getElementById(`jobs-piece-form-button-${i}`);
  edit_button.disabled = true;
  edit_button.innerText = 'Editing';
  const jobs_response = await fetch('./__data/jobs_available/jobs_available.json');
  const jobs_data = await jobs_response.json();
  const jobs_piece_form_section = document.getElementById(`section-jobs-${i}`);
  const jobs_section_data = jobs_piece_form_section.getFormData();
  const new_job = {
    'title': jobs_section_data['title'],
    'description': jobs_section_data['description'],
  };
  jobs_data['content'][i] = new_job;
  try {
    const response = await fetch('/server/admin_dashboard/jobs_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobs_data),
    });
    const response_json = await response.json();
    if (!response_json['success']) {
      throw new Error('Update jobs data failed');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateJobsList();
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
    if (!response_json['success']) {
      throw new Error('Failed to delete news');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateNewsList();
  }
};

/**
 * Deletes the jobs piece at the input index
 * @param {number} i index of job to delete
 * @return {Promise<void>}
 */
window.deleteJobsPiece = async (i) => {
  const delete_button = document.getElementById(`delete-jobs-button-${i}`);
  delete_button.disabled = true;
  delete_button.innerText = 'Deleting';
  const jobs_response = await fetch('./__data/jobs_available/jobs_available.json');
  const jobs_data = await jobs_response.json();
  jobs_data['content'].splice(i, 1);
  try {
    const response = await fetch('/server/admin_dashboard/jobs_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobs_data),
    });
    const response_json = await response.json();
    if (!response_json['success']) {
      throw new Error('Failed to delete job');
    }
  } catch(error) {
    console.log(error);
  } finally {
    await updateJobsList();
  }
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
 * Submits jobs form if recaptcha token is valid
 * @return {Promise<void>}
 */
window.submitJobsFormButton = async () => {
  if (!validateJobsForm()) {
    return;
  }
  const button = document.getElementById('jobs-form-button');
  const status_message = document.getElementById('jobs-form-status-message');
  const jobs_form = document.getElementById('jobs-form');
  submitFormButton(button, status_message, jobs_form);
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
 * Validates each section in news form
 * @return {boolean} whether form is valid.
 */
function validateNewsForm() {
  const news_section = document.getElementById('section-news');
  return news_section.validate();
}

/**
 * Validates each section in paper form
 * @return {boolean} whether form is valid.
 */
function validatePaperForm() {
  const paper_section = document.getElementById('section-papers');
  return paper_section.validate();
}

/**
 * Validates each section in jobs form
 * @return {boolean} whether form is valid.
 */
function validateJobsForm() {
  const jobs_section = document.getElementById('section-jobs');
  return jobs_section.validate();
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
 * Submits jobs form to server
 * @return {Promise<void>}
 */
window.submitJobsForm = async () => {
  const status_message = document.getElementById('jobs-form-status-message');

  const response = await fetch('./__data/jobs_available/jobs_available.json');
  const json_data = await response.json();
  const jobs_section = document.getElementById('section-jobs');
  const jobs_section_data = jobs_section.getFormData();
  const new_job = {
    'title': jobs_section_data['title'],
    'description': jobs_section_data['description'],
  };
  json_data['content'].unshift(new_job);

  try {
    const response = await fetch('/server/admin_dashboard/jobs_data.php', {
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
      jobs_section.clearFormData();
      const jobs_form = document.getElementById('jobs-form');
      jobs_form.setAttribute('style', 'display: none;');
    }
    else {
      status_message.setAttribute('style', 'display: block; color: red');
      status_message.innerText = response_json;
    }
  } catch(error) {
    console.log(error);
    status_message.setAttribute('style', 'display: block; color: red');
    status_message.innerText = 'Job upload failed. Please report this bug.';
  }
  
  const button = document.getElementById('jobs-form-button');
  button.disabled = false;
  button.innerText = 'Upload News';
  button.removeAttribute('style');
  const jobs_button = document.getElementById('new-jobs-button');
  jobs_button.innerText = 'Add Job';
  await updateJobsList();
};

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