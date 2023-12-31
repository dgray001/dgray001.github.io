import {CufElement} from '../../cuf_element';
import {JsonData, fetchJson} from '../../../data/data_control';
import {LaywitnessData, LaywitnessIssueData, LaywitnessVolumeData} from '../../common/laywitness_list/laywitness_list';
import {FaithFactsData} from '../../common/faith_fact_category_list/faith_fact_category_list';
import {CufNewsForm} from '../forms/news_form/news_form';
import {recaptchaCallback} from '../../../scripts/recaptcha';
import {apiPost} from '../../../scripts/api';
import {CufPositionPapersForm} from '../forms/position_papers_form/position_papers_form';
import {CufJobsAvailableForm} from '../forms/jobs_available_form/jobs_available_form';
import {renameFile} from '../../../scripts/util';
import {LayWitnessFormData} from '../forms/lay_witness_form/lay_witness_form';

import html from './dashboard_section.html';
import {getListJsonData, getListLaywitnessData} from './util';

import './dashboard_section.scss';
import '../forms/jobs_available_form/jobs_available_form';
import '../forms/lay_witness_form/lay_witness_form';
import '../forms/news_form/news_form';
import '../forms/position_papers_form/position_papers_form';

type AdminFormType = CufNewsForm | CufPositionPapersForm | CufJobsAvailableForm;

type DashboardSectionData = JsonData|LaywitnessData|FaithFactsData;

export class CufDashboardSection extends CufElement {
  private section_title: HTMLButtonElement;
  private section_body: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private new_button_container: HTMLDivElement;
  private current_list: HTMLDivElement;
  private new_form: HTMLFormElement;
  private status_message: HTMLDivElement;

  private section_key = '';
  private tag_key = '';
  private json_key = '';
  private body_open = false;
  private new_form_open = false;
  private new_form_button: HTMLButtonElement;
  private new_form_el: AdminFormType;
  private current_data: DashboardSectionData;
  private file_input: HTMLInputElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('section_title');
    this.configureElement('section_body');
    this.configureElement('edit_button');
    this.configureElement('new_button_container');
    this.configureElement('current_list');
    this.configureElement('new_form');
    this.configureElement('status_message');
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('section');
    this.section_key = this.getAttribute('section');
    this.tag_key = this.section_key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    this.json_key = this.section_key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
    this.section_title.innerText = this.sectionTitle();
    this.edit_button.innerText = `Edit ${this.sectionTitle()} [Not implemented]`;
    this.edit_button.disabled = true;
    this.setNewForm();
    this.setNewButton();
    await this.setCurrentList();
    if (['faithFacts'].includes(this.section_key)) {
      this.section_title.disabled = true;
    } else {
      this.section_title.addEventListener('click', () => {
        this.setBodyOpen(!this.body_open);
      });
    }
  }

  private sectionTitle() {
    switch(this.section_key) {
      case 'layWitness':
        return 'Lay Witness';
      case 'positionPapers':
        return 'Position Papers';
      case 'news':
        return 'News';
      case 'faithFacts':
        return 'Faith Facts [not implemented]';
      case 'jobsAvailable':
        return 'Jobs Available';
      default:
        return 'Unknown';
    }
  }

  private setNewButton() {
    if (['news', 'jobsAvailable'].includes(this.section_key)) {
      this.new_form_button = document.createElement('button');
      this.new_form_button.addEventListener('click', () => {
        this.toggleNewForm(!this.new_form_open);
      });
      this.new_button_container.appendChild(this.new_form_button);
    } else if (['layWitness', 'positionPapers'].includes(this.section_key)) {
      this.file_input = document.createElement('input');
      this.file_input.id = 'file-input';
      this.file_input.setAttribute('type', 'file');
      this.file_input.setAttribute('accept', 'application/pdf');
      const file_label = document.createElement('label');
      file_label.innerText = `Upload New ${this.sectionTitle()}`;
      file_label.setAttribute('for', 'file-input');
      this.new_form_button = document.createElement('button');
      this.new_form_button.classList.add('hide');
      this.file_input.addEventListener('change', () => {
        const file = this.file_input.files[0];
        if (file.type !== 'application/pdf' || !file.name) {
          return;
        }
        this.toggleNewForm(true);
        this.new_form_button.classList.remove('hide');
        this.file_input.classList.add('hide');
        file_label.innerText = file.name;
      });
      this.new_form_button.addEventListener('click', () => {
        this.toggleNewForm(false);
        this.new_form_button.classList.add('hide');
        this.file_input.value = '';
        this.file_input.classList.remove('hide');
        file_label.innerText = `Upload New ${this.sectionTitle()}`;
      });
      this.new_button_container.appendChild(file_label);
      this.new_button_container.appendChild(this.file_input);
      this.new_button_container.appendChild(this.new_form_button);
    } else {
      // TODO: implement for faith facts
    }
    this.toggleNewForm(false);
  }

  private setNewForm() {
    this.new_form_el = document.createElement(`cuf-${this.tag_key}-form`) as AdminFormType;
    this.new_form_el.setSubmitCallback(async () => {
      if (!this.new_form_el.validate()) {
        this.errorStatus('Please fix the validation errors');
        return;
      }
      await recaptchaCallback(async () => {
        const form_data = this.new_form_el.getData() as LayWitnessFormData;
        const {new_data, data_added} = this.addNewData(form_data);
        if (!new_data) {
          return;
        }
        if (['layWitness', 'positionPapers'].includes(this.section_key)) {
          let file = this.file_input.files[0];
          if (this.section_key === 'layWitness') {
            let new_name = `${form_data.volume}/${form_data.volume}.${form_data.issue}-Lay-Witness`;
            if (form_data.addendum) {
              new_name += `-Addendum${data_added.addendum}`;
            } else if (form_data.insert) {
              new_name += `-Insert${data_added.insert}`;
            }
            new_name += '.pdf';
            file = renameFile(file, new_name);
          }
          const r = await apiPost(`admin_dashboard/${this.json_key}_file`, file);
          if (!r.success) {
            this.errorStatus(r.error_message ?? 'An unknown error occurred trying to upload the file');
            return;
          }
        }
        this.current_data = new_data;
        const r = await apiPost(`admin_dashboard/${this.json_key}_data`, this.current_data);
        if (r.success) {
          this.successStatus(`Successfully added a new ${this.sectionTitle().toLowerCase()}`);
          this.toggleNewForm(false);
        } else {
          this.errorStatus(r.error_message ?? 'An unknown error has occurrred');
        }
      }, this.new_form_el.getSubmitButton(), this.status_message, 'Uploading');
    });
    this.new_form.appendChild(this.new_form_el);
  }

  private addNewData(new_data: any): {new_data: DashboardSectionData|undefined, data_added?: any} {
    if (['news', 'jobs_available', 'position_papers'].includes(this.json_key)) {
      const d = this.current_data as JsonData;
      if (this.json_key === 'position_papers') {
        new_data.titlelink = `/data/position_papers/${this.file_input.files[0].name}`;
      }
      d.content.unshift(new_data);
      return {new_data: d};
    } else if (this.json_key === 'lay_witness') {
      const d = this.current_data as LaywitnessData;
      for (const volume of d.volumes) {
        if (volume.number === new_data.volume) {
          let found_issue = false;
          for (const issue of volume.issues) {
            if (issue.number === new_data.issue) {
              found_issue = true;
              break;
            }
          }
          const new_issue: LaywitnessIssueData = {
            number: new_data.issue,
            title: new_data.title,
          };
          if (found_issue) {
            if (new_data.addendum) {
              new_issue.addendum = 1;
              for (const addendum of volume.issues.filter(a => a.number === new_data.issue && !!a.addendum)) {
                new_issue.addendum = Math.max(1, addendum.addendum + 1);
              }
            } else if (new_data.insert) {
              new_issue.insert = 1;
              for (const insert of volume.issues.filter(a => a.number === new_data.issue && !!a.insert)) {
                new_issue.insert = Math.max(1, insert.insert + 1);
              }
            } else {
              this.errorStatus('This issue already exists');
              return {new_data: undefined};
            }
          } else {
            if (new_data.addendum) {
              new_issue.addendum = 1;
            } else if (new_data.insert) {
              new_issue.insert = 1;
            }
          }
          volume.issues.push(new_issue);
          volume.issues.sort((a, b) => {
            if (a.number !== b.number) {
              return a.number - b.number;
            } else if (a.addendum !== b.addendum) {
              return a.addendum - b.addendum;
            }
            return a.insert - b.insert;
          });
          return {new_data: d, data_added: new_issue};
        }
      }
      const new_issue: LaywitnessIssueData = {
        number: new_data.issue,
        title: new_data.title,
      };
      if (new_data.addendum) {
        new_issue.addendum = 1;
      } else if (new_data.insert) {
        new_issue.insert = 1;
      }
      const new_volume: LaywitnessVolumeData = {
        number: new_data.volume,
        year: new_data.volume + 2022 - 40,
        issues: [new_issue],
      };
      d.volumes.push(new_volume);
      d.volumes.sort((a, b) => a.number - b.number);
      return {new_data: d, data_added: new_issue};
    }
    console.error('Not implemented');
    return {new_data: this.current_data};
  }

  private messageStatus(message: string): void {
    if (!!message) {
      this.status_message.innerHTML = message;
      this.status_message.classList.remove('hide');
    } else {
      this.status_message.classList.add('hide');
    }
    this.status_message.classList.remove('error');
    this.status_message.classList.remove('success');
  }

  private successStatus(message: string): void {
    this.messageStatus(message);
    this.status_message.classList.add('success');
  }

  private errorStatus(message: string): void {
    this.messageStatus(message);
    this.status_message.classList.add('error');
  }

  private async setCurrentList() {
    this.current_data = await fetchJson<DashboardSectionData>(`${this.json_key}/${this.json_key}.json`);
    if (['jobs_available', 'news', 'position_papers'].includes(this.json_key)) {
      this.current_list.replaceChildren(...getListJsonData(this.current_data as JsonData));
    } else if (this.json_key === 'lay_witness') {
      this.current_list.replaceChildren(...getListLaywitnessData(this.current_data as LaywitnessData));
    } else if (this.json_key === 'faith_facts') {
      // TODO: implement
    }
  }

  private setBodyOpen(body_open: boolean) {
    this.body_open = body_open;
    this.section_body.classList.toggle('show', body_open);
  }

  private toggleNewForm(new_form_open: boolean) {
    this.new_form_open = new_form_open;
    this.new_form.classList.toggle('show', new_form_open);
    this.new_form_button.classList.toggle('open', new_form_open);
    this.new_form_button.innerText = new_form_open ? 'Cancel' : `New ${this.sectionTitle()}`;
    if (new_form_open) {
      // TODO: close edit list
    } else {
      this.new_form_el.clearData();
    }
  }
}

customElements.define('cuf-dashboard-section', CufDashboardSection);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-dashboard-section': CufDashboardSection;
  }
}
