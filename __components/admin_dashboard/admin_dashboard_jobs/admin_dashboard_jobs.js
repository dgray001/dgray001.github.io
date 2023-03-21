// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {CufFormSectionJob} = await import(`../../model/form_sections/form_section_job/form_section_job.js?v=${version}`);
const {CufAdminDashboardSection} = await import(`../admin_dashboard_section.js?v=${version}`);

export class CufAdminDashboardJobs extends CufAdminDashboardSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.setHTML('admin_dashboard_jobs', 'Job');
  }

  /**
   * @typedef {Object} JobsData
   * @property {string} header
   * @property {Array<JobsPiece>} content
   * 
   * @typedef {Object} JobsPiece
   * @property {string} title
   * @property {string} description
   * 
   * @typedef {Object} JobsFormData
   * @property {string} title
   * @property {string} description
   */

  /**
   * Submit the form to add a new piece
   */
  async newFormSubmit() {
    const response = await fetchJson('/__data/jobs_available/jobs_available.json');
    /** @type {JobsData} */
    const json_data = await response.json();
    /** @type {JobsFormData} */
    const jobs_section_data = this.new_form_section.getFormData();
    /** @type {JobsPiece} */
    const new_jobs = {
      'title': jobs_section_data['title'],
      'description': jobs_section_data['description'],
    };
    json_data['content'].unshift(new_jobs);

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
        this.status_message.setAttribute('style', 'display: block; color: green');
        this.status_message.innerText = 'Data upload succeeded';
        this.new_form_section.clearFormData();
        this.new_form.setAttribute('style', 'display: none;');
      }
      else {
        this.status_message.setAttribute('style', 'display: block; color: red');
        this.status_message.innerText = JSON.stringify(response_json);
      }
    } catch(error) {
      console.log(error.toString());
      this.status_message.setAttribute('style', 'display: block; color: red');
      this.status_message.innerText = 'Jobs upload failed. Please report this bug.';
    }
  
    this.submit_button.disabled = false;
    this.submit_button.innerText = 'Upload Job';
    this.submit_button.removeAttribute('style');
    this.add_button.innerText = 'New Job';
    await this.updateCurrentList();
  }

  /**
   * Updates the current_list div with all current jobs data
   */
  async updateCurrentList() {
    this.current_list.replaceChildren();
    /** @type {JobsData} */
    const jobs_data = await fetchJson('jobs_available/jobs_available.json');
    for (const [i, jobs] of jobs_data['content'].entries()) {
      const jobs_div = document.createElement('div');
      jobs_div.innerHTML = `
        <div class="line-item">
          <span class="uneditable-content">Title: </span>
          <span class="editable-content">${jobs['title']}</span>
        </div>
        <div class="line-item">
          <span class="uneditable-content">Description: </span>
          <span class="editable-content">${jobs['description']}</span>
        </div>
        <button class="over-piece left" id="edit-jobs-button-${i}">Edit jobs</button>
        <button class="over-piece right" id="delete-jobs-button-${i}">Delete jobs</button>
      `;
      jobs_div.classList.add('editable-piece');
      jobs_div.id = `editable-jobs-piece-${i}`;
      await until(() => !!jobs_div.querySelector('button.left'));
      await until(() => !!jobs_div.querySelector('button.right'));
      jobs_div.querySelector('button.left')?.addEventListener('click', async () => {
        await this.editJob(i);
      });
      jobs_div.querySelector('button.right')?.addEventListener('click', async () => {
        await this.deleteJob(i);
      });
      this.current_list.appendChild(jobs_div);
    }
  }

  /**
   * Edits the jobs at the input index
   * @param {number} i
   */
  async editJob(i) {
    const piece_div = document.getElementById(`editable-jobs-piece-${i}`);
    const edit_button = document.getElementById(`edit-jobs-button-${i}`);
    if (!piece_div || !edit_button) {
      return;
    }
    if (edit_button.classList.contains('editing')) {
      edit_button.innerText = 'Edit jobs';
      edit_button.classList.remove('editing');
      const jobs_piece_form = document.getElementById(`jobs-piece-form-${i}`);
      jobs_piece_form?.remove();
      return;
    }
    edit_button.innerText = 'Cancel';
    edit_button.classList.add('editing');
    const jobs_piece_form = document.createElement('form');
    jobs_piece_form.id = `jobs-piece-form-${i}`;
    jobs_piece_form.innerHTML = `
      <cuf-form-section-job id="section-jobs-${i}"></cuf-form-section-job>
      <button class="form-submit-button" id="jobs-piece-form-button-${i}" type="button">Update jobs</button>
    `;
    piece_div.appendChild(jobs_piece_form);
    /** @type {JobsData} */
    const jobs_data = await fetchJson('jobs_available/jobs_available.json');
    const jobs = jobs_data['content'][i];
    /** @type {CufFormSectionJob} */
    const jobs_piece_form_section = document.getElementById(`section-jobs-${i}`);
    await until(() => jobs_piece_form_section.form_fields.length == 2);
    await until(() => !!paper_piece_form_section.form_fields[1].form_field);
    jobs_piece_form_section.setFormData({
      title: jobs.title,
      description: jobs.description,
    });
    jobs_piece_form_section.focusFirst();
    const submit_button = document.getElementById(`jobs-piece-form-button-${i}`);
    submit_button?.addEventListener('click', async () => {
      if (!this.validateForm(jobs_piece_form_section)) {
        return;
      }
      await this.submitForm(submit_button, this.status_message, async () => {
        await this.editUpdateJobPiece(i);
      }, 'Updating');
    });
  }

  /**
   * Edits jobs piece from edit form data
   * @param {number} i paper index
   */
   async editUpdateJobPiece(i) {
    /** @type {JobsData} */
    const jobs_data = await fetchJson('jobs_available/jobs_available.json');
    /** @type {CufFormSectionJob} */
    const jobs_piece_form_section = document.getElementById(`section-jobs-${i}`);
    const jobs_section_data = jobs_piece_form_section.getFormData();
    const new_jobs = {
      'title': jobs_section_data['title'],
      'description': jobs_section_data['description'],
    };
    jobs_data['content'][i] = new_jobs;
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
      console.log(error.toString());
    } finally {
      await this.updateCurrentList();
    }
   }

  /**
   * Edits the jobs at the input index
   * @param {number} i
   */
  async deleteJob(i) {
    const delete_button = document.getElementById(`delete-jobs-button-${i}`);
    delete_button.disabled = true;
    delete_button.innerText = 'Deleting';
    /** @type {JobsData} */
    const jobs_data = await fetchJson('jobs_available/jobs_available.json');
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
      console.log(error.toString());
    } finally {
      await this.updateCurrentList();
    }
  }
}

customElements.define("cuf-admin-dashboard-jobs", CufAdminDashboardJobs);
