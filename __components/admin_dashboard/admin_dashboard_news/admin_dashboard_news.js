// @ts-nocheck
import {CufFormSectionNews} from "../../model/form_sections/form_section_news/form_section_news.js";
import {CufAdminDashboardSection} from "../admin_dashboard_section.js";
import {until} from "../../../scripts/util.js";

export class CufAdminDashboardNews extends CufAdminDashboardSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.setHTML('admin_dashboard_news', 'News');
  }

  /**
   * @typedef {Object} NewsData
   * @property {string} header
   * @property {Array<NewsPiece>} content
   * 
   * @typedef {Object} NewsPiece
   * @property {string} title
   * @property {string=} titlelink
   * @property {string} description
   * 
   * @typedef {Object} NewsFormData
   * @property {string} title
   * @property {string=} titlelink
   * @property {string} description
   */

  /**
   * Submit the form to add a new piece
   */
  async newFormSubmit() {
    const response = await fetch('/__data/news/news.json');
    /** @type {NewsData} */
    const json_data = await response.json();
    /** @type {NewsFormData} */
    const news_section_data = this.new_form_section.getFormData();
    /** @type {NewsPiece} */
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
        this.status_message.setAttribute('style', 'display: block; color: green');
        this.status_message.innerText = 'Data upload succeeded';
        this.new_form_section.clearFormData();
        this.new_form.setAttribute('style', 'display: none;');
      }
      else {
        this.status_message.setAttribute('style', 'display: block; color: red');
        this.status_message.innerText = response_json;
      }
    } catch(error) {
      console.log(error);
      this.status_message.setAttribute('style', 'display: block; color: red');
      this.status_message.innerText = 'News upload failed. Please report this bug.';
    }
  
    this.submit_button.disabled = false;
    this.submit_button.innerText = 'Upload News';
    this.submit_button.removeAttribute('style');
    this.add_button.innerText = 'New News';
    await this.updateCurrentList();
  }

  /**
   * Updates the current_list div with all current news data
   */
  async updateCurrentList() {
    this.current_list.replaceChildren();
    const response = await fetch('/__data/news/news.json');
    /** @type {NewsData} */
    const news_data = await response.json();
    for (const [i, news] of news_data['content'].entries()) {
      const news_div = document.createElement('div');
      news_div.innerHTML = `
        <div class="line-item">
          <span class="uneditable-content">Title: </span>
          <span class="editable-content">${news['title']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Link: </span>
          <span class="editable-content">${news['titlelink']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Description: </span>
          <span class="editable-content">${news['description']}</span>
        </div>
        <button class="over-piece left" id="edit-news-button-${i}">Edit News</button>
        <button class="over-piece right" id="delete-news-button-${i}">Delete News</button>
      `;
      news_div.classList.add('editable-piece');
      news_div.id = `editable-news-piece-${i}`;
      await until(() => !!news_div.querySelector('button.left'));
      await until(() => !!news_div.querySelector('button.right'));
      news_div.querySelector('button.left')?.addEventListener('click', async () => {
        await this.editNews(i);
      });
      news_div.querySelector('button.right')?.addEventListener('click', async () => {
        await this.deleteNews(i);
      });
      this.current_list.appendChild(news_div);
    }
  }

  /**
   * Edits the news at the input index
   * @param {number} i
   */
  async editNews(i) {
    const piece_div = document.getElementById(`editable-news-piece-${i}`);
    const edit_button = document.getElementById(`edit-news-button-${i}`);
    if (!piece_div || !edit_button) {
      return;
    }
    if (edit_button.classList.contains('editing')) {
      edit_button.innerText = 'Edit News';
      edit_button.classList.remove('editing');
      const news_piece_form = document.getElementById(`news-piece-form-${i}`);
      news_piece_form?.remove();
      return;
    }
    edit_button.innerText = 'Cancel';
    edit_button.classList.add('editing');
    const news_piece_form = document.createElement('form');
    news_piece_form.id = `news-piece-form-${i}`;
    news_piece_form.innerHTML = `
      <cuf-form-section-news id="section-news-${i}"></cuf-form-section-news>
      <button class="form-submit-button" id="news-piece-form-button-${i}" type="button">Update News</button>
    `;
    piece_div.appendChild(news_piece_form);
    const response = await fetch('/__data/news/news.json');
    /** @type {NewsData} */
    const news_data = await response.json();
    const news = news_data['content'][i];
    /** @type {CufFormSectionNews} */
    const news_piece_form_section = document.getElementById(`section-news-${i}`);
    await until(() => news_piece_form_section.form_fields.length == 3);
    news_piece_form_section.setFormData({
      title: news.title,
      titlelink: news.titlelink ?? '',
      description: news.description,
    });
    news_piece_form_section.focusFirst();
    const submit_button = document.getElementById(`news-piece-form-button-${i}`);
    submit_button?.addEventListener('click', async () => {
      if (!this.validateForm(news_piece_form_section)) {
        return;
      }
      await this.submitForm(submit_button, this.status_message, async () => {
        await this.editUpdateNewsPiece(i);
      }, 'Updating');
    });
  }

  /**
   * Edits news piece from edit form data
   * @param {number} i paper index
   */
   async editUpdateNewsPiece(i) {
    const response = await fetch('/__data/news/news.json');
    /** @type {NewsData} */
    const news_data = await response.json();
    /** @type {CufFormSectionNews} */
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
      await this.updateCurrentList();
    }
   }

  /**
   * Edits the news at the input index
   * @param {number} i
   */
  async deleteNews(i) {
    const delete_button = document.getElementById(`delete-news-button-${i}`);
    delete_button.disabled = true;
    delete_button.innerText = 'Deleting';
    const news_response = await fetch('./__data/news/news.json');
    /** @type {NewsData} */
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
      await this.updateCurrentList();
    }
  }
}

customElements.define("cuf-admin-dashboard-news", CufAdminDashboardNews);
