// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {CufFormSectionLaywitness} = await import(`../../model/form_sections/form_section_laywitness/form_section_laywitness.js?v=${version}`);
const {CufAdminDashboardSection} = await import(`../admin_dashboard_section.js?v=${version}`);

export class CufAdminDashboardLaywitness extends CufAdminDashboardSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.setHTML('admin_dashboard_laywitness', 'Lay Witness');
  }

  /**
   * @typedef {Object} LaywitnessData
   * @property {Array<LaywitnessVolume>} volumes
   * 
   * @typedef {Object} LaywitnessVolume
   * @property {number} number
   * @property {number} year
   * @property {Array<LaywitnessIssue>} issues
   * 
   * @typedef {Object} LaywitnessIssue
   * @property {number} number
   * @property {string} title
   * @property {number=} addendum
   * @property {number=} insert
   * 
   * @typedef {Object} LaywitnessFormData
   * @property {number} volume
   * @property {number} issue
   * @property {string} title
   * @property {boolean} addendum
   * @property {boolean} insert
   */

  /**
   * Submit the form to add a new piece
   */
  async newFormSubmit() {
    const response = await fetch('/__data/lay_witness/lay_witness.json');
    /** @type {LaywitnessData} */
    const json_data = await response.json();
    /** @type {LaywitnessFormData} */
    const laywitness_section_data = this.new_form_section.getFormData();
    const file = this.file_input.files[0];
  
    const {post_data, new_issue} = this.processLaywitnessFormData(json_data, laywitness_section_data);

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
        this.status_message.setAttribute('style', 'display: block; color: green');
        this.status_message.innerText = 'Data upload succeeded';
        await this.uploadLaywitnessFile(new_issue, laywitness_section_data, file, this.status_message);
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
   * Updates the current_list div with all current Lay Witness data
   */
  async updateCurrentList() {
    this.current_list.replaceChildren();
    const laywitness_response = await fetch('/__data/lay_witness/lay_witness.json');
    /** @type {LaywitnessData} */
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
          <button class="over-piece left" id="edit-laywitness-button-${i}-${j}">Edit Issue</button>
          <button class="over-piece right" id="delete-laywitness-button-${i}-${j}">Delete Issue</button>
        `;
        issue_div.classList.add('editable-subpiece');
        issue_div.id = `editable-laywitness-piece-${i}-${j}`;
        await until(() => !!issue_div.querySelector('button.left'));
        await until(() => !!issue_div.querySelector('button.right'));
        issue_div.querySelector('button.left')?.addEventListener('click', async () => {
          await this.editLaywitnessPiece(i, j);
        });
        issue_div.querySelector('button.right')?.addEventListener('click', async () => {
          await this.deleteLaywitnessPiece(i, j);
        });
        issue_wrapper.appendChild(issue_div);
      }
      volume_div.classList.add('editable-piece');
      volume_div.id = `editable-laywitness-volume-piece-${i}`;
      this.current_list.appendChild(volume_div);
    }
  }

  /**
   * Edits the laywitness issue at the input index
   * @param {number} i volume index
   * @param {number} j issue index
   */
  async editLaywitnessPiece(i, j) {
    const piece_div = document.getElementById(`editable-laywitness-piece-${i}-${j}`);
    const edit_button = document.getElementById(`edit-laywitness-button-${i}-${j}`);
    if (!piece_div || !edit_button) {
      return;
    }
    if (edit_button.classList.contains('editing')) {
      edit_button.innerText = 'Edit Issue';
      edit_button.classList.remove('editing');
      const laywitness_piece_form = document.getElementById(`laywitness-piece-form-${i}-${j}`);
      laywitness_piece_form?.remove();
      return;
    }
    edit_button.innerText = 'Cancel';
    edit_button.classList.add('editing');
    const lay_witness_piece_form = document.createElement('form');
    lay_witness_piece_form.id = `laywitness-piece-form-${i}-${j}`;
    lay_witness_piece_form.innerHTML = `
      <br><label for="laywitness-file-upload-${i}-${j}">Update Lay Witness PDF:</label><br>
      <input id="laywitness-file-upload-${i}-${j}" type="file" accept="application/pdf">
      <cuf-form-section-laywitness id="section-laywitness-${i}-${j}"></cuf-form-section-laywitness>
      <button class="form-submit-button" id="laywitness-piece-form-button-${i}-${j}" type="button">Update Laywitness</button>
    `;
    piece_div.appendChild(lay_witness_piece_form);
    const response = await fetch('/__data/lay_witness/lay_witness.json');
    /** @type {LaywitnessData} */
    const laywitness_data = await response.json();
    const volume = laywitness_data['volumes'][i]['number'];
    const issue = laywitness_data['volumes'][i]['issues'][j];
    /** @type {CufFormSectionLaywitness} */
    const laywitness_piece_form_section = document.getElementById(`section-laywitness-${i}-${j}`);
    await until(() => laywitness_piece_form_section.form_fields.length == 5);
    laywitness_piece_form_section.setFormData({
      volume: volume,
      issue: issue.number,
      title: issue.title,
      addendum: !!issue.addendum,
      insert: !!issue.insert,
    });
    laywitness_piece_form_section.focusFirst();
    const submit_button = document.getElementById(`laywitness-piece-form-button-${i}-${j}`);
    submit_button?.addEventListener('click', async () => {
      if (!this.validateForm(laywitness_piece_form_section)) {
        return;
      }
      await this.submitForm(submit_button, this.status_message, async () => {
        await this.editUpdateLaywitnessPiece(i, j);
      }, 'Updating');
    });
  }

  /**
   * Edits laywitness piece from edit form data
   * @param {number} i volume index
   * @param {number} j issue index
   */
   async editUpdateLaywitnessPiece(i, j) {
    const laywitness_response = await fetch('/__data/lay_witness/lay_witness.json');
    /** @type {LaywitnessData} */
    const laywitness_data = await laywitness_response.json();
    const volume = laywitness_data['volumes'][i]['number'];
    const issue = laywitness_data['volumes'][i]['issues'][j];
    // first remove current issue since it could have been changed
    laywitness_data['volumes'][i]['issues'].splice(j, 1);
    if (!laywitness_data['volumes'][i]['issues'].length) {
      laywitness_data['volumes'].splice(i, 1);
    }
    // get new file
    const filename = this.laywitnessFilename(volume, issue);
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
    // add new issue data
    /** @type {CufFormSectionLaywitness} */
    const laywitness_piece_form_section = document.getElementById(`section-laywitness-${i}-${j}`);
    const laywitness_section_data = laywitness_piece_form_section.getFormData();
    const {post_data, new_issue} = this.processLaywitnessFormData(laywitness_data, laywitness_section_data);
    const new_filename = this.laywitnessFilename(laywitness_section_data['volume'], new_issue);
  
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
      await this.updateCurrentList();
    }
  }

  /**
   * Delete laywitness issue at the input index
   * @param {number} i volume index
   * @param {number} j issue index
   */
  async deleteLaywitnessPiece(i, j) {
    const delete_button = document.getElementById(`delete-laywitness-button-${i}-${j}`);
    delete_button.disabled = true;
    delete_button.innerText = 'Deleting';
    const lay_witness_response = await fetch('./__data/lay_witness/lay_witness.json');
    /** @type {LaywitnessData} */
    const lay_witness_data = await lay_witness_response.json();
    const volume = lay_witness_data['volumes'][i]['number'];
    const issue = lay_witness_data['volumes'][i]['issues'][j];
    const filename = this.laywitnessFilename(volume, issue);
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
      await this.updateCurrentList();
    }
  }

  /**
   * Processes laywitness form data
   * @param {LaywitnessData} json_data current json data
   * @param {LaywitnessFormData} form_data
   * @return {{post_data: LaywitnessData, new_issue: LaywitnessIssue}} data ready to post to server
   */
  processLaywitnessFormData(json_data, form_data) {
    let submit_volume = undefined;
    for (const volume of json_data['volumes']) {
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
      json_data['volumes'].push(submit_volume);
    }
    const issues = submit_volume['issues'];
    /** @type {LaywitnessIssue} */
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
    json_data['volumes'].sort((a, b) => {
      if (a['number'] > b['number']) {
        return -1;
      }
      else if (a['number'] < b['number']) {
        return 1;
      }
      return 0;
    });
    return {post_data: json_data, new_issue};
  }

  /**
   * Uploads laywitness file onto server
   * @param {LaywitnessIssue} new_issue
   * @param {LaywitnessFormData} laywitness_section_data
   * @param {File} file
   * @param {HTMLDivElement} status_message
   */
  async uploadLaywitnessFile(new_issue, laywitness_section_data, file, status_message) {
    const filename = this.laywitnessFilename(laywitness_section_data['volume'], new_issue);
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
   * @param {LaywitnessIssue} issue
   * @return {string} filename
   */
  laywitnessFilename(volume, issue) {
    const filename_extension = issue['addendum'] ? `-Addendum${issue['addendum']}` :
      (issue['insert'] ? `-Insert${issue['insert']}` : '');
    return `/${volume}/${volume}.${issue['number']}-Lay-Witness${filename_extension}.pdf`;
  }
}

customElements.define("cuf-admin-dashboard-laywitness", CufAdminDashboardLaywitness);