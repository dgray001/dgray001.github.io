// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {CufFormSectionFaithFact} = await import(`../../model/form_sections/form_section_faith_fact/form_section_faith_fact.js?v=${version}`);
const {CufAdminDashboardSection} = await import(`../admin_dashboard_section.js?v=${version}`);

class CufAdminDashboardFaithFacts extends CufAdminDashboardSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.setHTML('admin_dashboard_faith_facts', 'Faith Facts');
  }

  /**
   * @typedef {Object} FaithFactsData
   * @property {Map<string, FaithFactCategoryData>} content
   * 
   * @typedef {Object} FaithFactCategoryData
   * @property {string} category
   * @property {string} category_display
   * @property {Array<FaithFact>} faith_facts
   * 
   * @typedef {Object} FaithFact
   * @property {string} title
   * @property {string=} question
   * @property {string} summary
   * 
   * @typedef {Object} PaperFormData
   * @property {string} title
   * @property {string=} question
   * @property {string} summary
   */

  /**
   * Submit the form to add a new piece
   */
  async newFormSubmit() {
    /** @type {FaithFactsData} */
    const json_data = await fetchJson('papers/papers.json');
    /** @type {PaperFormData} */
    const paper_section_data = this.new_form_section.getFormData();
    const file = this.file_input.files[0];
    /** @type {PositionPaper} */
    const new_paper = {
      'title': paper_section_data['title'],
      'titlelink': `/__data/papers/${file.name}`,
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
        this.status_message.setAttribute('style', 'display: block; color: green');
        this.status_message.innerText = 'Data upload succeeded';
        await this.uploadPaperFile(file.name, file, this.status_message);
        this.new_form_section.clearFormData();
        this.new_form.setAttribute('style', 'display: none;');
        this.file_input.value = '';
      }
      else {
        this.status_message.setAttribute('style', 'display: block; color: red');
        this.status_message.innerText = response_json;
      }
    } catch(error) {
      console.log(error);
      this.status_message.setAttribute('style', 'display: block; color: red');
      this.status_message.innerText = 'File upload failed. Please report this bug.';
    }

    this.submit_button.disabled = false;
    this.submit_button.innerText = 'Upload File';
    this.submit_button.removeAttribute('style');
    await this.updateCurrentList();
  }

  /**
   * Updates the current_list div with all current position paper data
   */
  async updateCurrentList() {
    this.current_list.replaceChildren();
    /** @type {PapersData} */
    const papers_data = await fetchJson('papers/papers.json');
    for (const [i, paper] of papers_data['content'].entries()) {
      const paper_div = document.createElement('div');
      paper_div.innerHTML = `
        <div class="line-item">
          <span class="uneditable-content">Title: </span>
          <span class="editable-content">${paper['title']}</span>
        </div>
        <div class="line-item">
          <span class="editable-content">
            <a target="_blank" href="${paper['titlelink']}">Paper PDF</a>
          </span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Description: </span>
          <span class="editable-content">${paper['description']}</span>
        </div>
        <button class="over-piece left" id="edit-paper-button-${i}">Edit Paper</button>
        <button class="over-piece right" id="delete-paper-button-${i}">Delete Paper</button>
      `;
      paper_div.classList.add('editable-piece');
      paper_div.id = `editable-paper-piece-${i}`;
      await until(() => !!paper_div.querySelector('button.left'));
      await until(() => !!paper_div.querySelector('button.right'));
      paper_div.querySelector('button.left')?.addEventListener('click', async () => {
        await this.editPaper(i);
      });
      paper_div.querySelector('button.right')?.addEventListener('click', async () => {
        await this.deletePaper(i);
      });
      this.current_list.appendChild(paper_div);
    }
  }

  /**
   * Edits the paper at the input index
   * @param {number} i
   */
  async editPaper(i) {
    const piece_div = document.getElementById(`editable-paper-piece-${i}`);
    const edit_button = document.getElementById(`edit-paper-button-${i}`);
    if (!piece_div || !edit_button) {
      return;
    }
    if (edit_button.classList.contains('editing')) {
      edit_button.innerText = 'Edit Paper';
      edit_button.classList.remove('editing');
      const paper_piece_form = document.getElementById(`paper-piece-form-${i}`);
      paper_piece_form?.remove();
      return;
    }
    edit_button.innerText = 'Cancel';
    edit_button.classList.add('editing');
    const paper_piece_form = document.createElement('form');
    paper_piece_form.id = `paper-piece-form-${i}`;
    paper_piece_form.innerHTML = `
      <br><label for="paper-file-upload-${i}">Update Position Paper PDF:</label><br>
      <input id="paper-file-upload-${i}" type="file" accept="application/pdf">
      <cuf-form-section-paper id="section-paper-${i}"></cuf-form-section-paper>
      <button class="form-submit-button" id="paper-piece-form-button-${i}" type="button">Update Position Paper</button>
    `;
    piece_div.appendChild(paper_piece_form);
    /** @type {PapersData} */
    const papers_data = await fetchJson('papers/papers.json');
    const paper = papers_data['content'][i];
    /** @type {CufFormSectionPaper} */
    const paper_piece_form_section = document.getElementById(`section-paper-${i}`);
    await until(() => paper_piece_form_section.form_fields.length == 2);
    await until(() => !!paper_piece_form_section.form_fields[1].form_field);
    paper_piece_form_section.setFormData({
      title: paper.title,
      description: paper.description,
    });
    paper_piece_form_section.focusFirst();
    const submit_button = document.getElementById(`paper-piece-form-button-${i}`);
    submit_button?.addEventListener('click', async () => {
      if (!this.validateForm(paper_piece_form_section)) {
        return;
      }
      await this.submitForm(submit_button, this.status_message, async () => {
        await this.editUpdatePaperPiece(i);
      }, 'Updating');
    });
  }

  /**
   * Edits paper piece from edit form data
   * @param {number} i paper index
   */
   async editUpdatePaperPiece(i) {
    /** @type {PapersData} */
    const papers_data = await fetchJson('papers/papers.json');
    const paper_piece_input = document.getElementById(`paper-file-upload-${i}`);
    /** @type {File=} */
    const paper_pdf = paper_piece_input.files[0];
    const filename = paper_pdf ? paper_pdf.name : papers_data['content'][i].titlelink;
    const old_filename = papers_data['content'][i].titlelink;
    const delete_old_file = !!paper_pdf;
    /** @type {CufFormSectionPaper} */
    const paper_piece_form_section = document.getElementById(`section-paper-${i}`);
    const paper_section_data = paper_piece_form_section.getFormData();
    const new_paper = {
      'title': paper_section_data['title'],
      'titlelink': delete_old_file ? `/__data/papers/${filename}` : old_filename,
    };
    if (paper_section_data.description) {
      new_paper['description'] = paper_section_data['description'];
    }
    papers_data['content'][i] = new_paper;
  
    try {
      if (delete_old_file) {
        // Delete old file
        const delete_response = await fetch('/server/admin_dashboard/papers_file_delete.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: old_filename,
          }),
        });
        const delete_response_json = await delete_response.json();
        if (!delete_response_json['success']) {
          throw new Error('Delete old file failed');
        }
        // Upload new file
        const file_response = await fetch('/server/admin_dashboard/papers_file.php', {
          method: 'POST',
          headers: {
            'Content-Type': paper_pdf.type,
            'X-File-Name': filename,
          },
          body: paper_pdf,
        });
        const file_response_json = await file_response.json();
        if (!file_response_json['success']) {
          throw new Error('Update file failed');
        }
      }
      // Update json data
      const data_response = await fetch('/server/admin_dashboard/papers_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(papers_data),
      });
      const data_response_json = await data_response.json();
      if (!data_response_json['success']) {
        throw new Error('Update papers data failed');
      }
    } catch(error) {
      console.log(error);
    } finally {
      await this.updateCurrentList();
    }
   }

   /**
    * Deletes the paper at the input index
    * @param {number} i paper index
    */
    async deletePaper(i) {
      const delete_button = document.getElementById(`delete-paper-button-${i}`);
      delete_button.disabled = true;
      delete_button.innerText = 'Deleting';
      /** @type {PapersData} */
      const papers_data = await fetchJson('papers/papers.json');
      const filename = paper_data['content'][i].titlelink;
      paper_data['content'].splice(i, 1);
      try {
        // Update data
        const response = await fetch('/server/admin_dashboard/papers_data.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paper_data),
        });
        const response_json = await response.json();
        if (!response_json['success']) {
          throw new Error('Updating papers data failed');
        }
        // Delete file
        const delete_response = await fetch('/server/admin_dashboard/papers_file_delete.php', {
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
          throw new Error('Delete paper file failed');
        }
      } catch(error) {
        console.log(error);
      } finally {
        await this.updateCurrentList();
      }
    }

  /**
   * Uploads position paper file onto server
   * @param {string} filename
   * @param {File} file
   * @param {HTMLDivElement} status_message
   */
  async uploadPaperFile(filename, file, status_message) {
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
}

customElements.define("cuf-admin-dashboard-papers", CufAdminDashboardPapers);
