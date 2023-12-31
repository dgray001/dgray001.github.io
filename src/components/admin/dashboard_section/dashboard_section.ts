import {CufElement} from '../../cuf_element';

import html from './dashboard_section.html';

import './dashboard_section.scss';
import '../forms/jobs_available_form/jobs_available_form';
import '../forms/lay_witness_form/lay_witness_form';
import '../forms/news_form/news_form';
import '../forms/position_papers_form/position_papers_form';

export class CufDashboardSection extends CufElement {
  private section_title: HTMLButtonElement;
  private section_body: HTMLDivElement;
  private edit_button: HTMLButtonElement;
  private new_button_container: HTMLDivElement;
  private new_form: HTMLFormElement;

  private section_key = '';
  private body_open = false;
  private new_form_open = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('section_title');
    this.configureElement('section_body');
    this.configureElement('edit_button');
    this.configureElement('new_button_container');
    this.configureElement('new_form');
  }

  protected override parsedCallback(): void {
    this.classList.add('section');
    this.section_key = this.getAttribute('section');
    this.section_title.innerText = this.sectionTitle();
    this.edit_button.innerText = `Edit ${this.sectionTitle()} [Not implemented]`;
    this.edit_button.disabled = true;
    this.setNewButton();
    this.setNewForm();
    this.section_title.addEventListener('click', () => {
      this.setBodyOpen(!this.body_open);
    });
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
        return 'Faith Facts';
      case 'jobsAvailable':
        return 'Jobs Available';
      default:
        return 'Unknown';
    }
  }

  private setNewButton() {
    if (['news', 'jobsAvailable'].includes(this.section_key)) {
      const button = document.createElement('button');
      button.innerText = `New ${this.sectionTitle()}`;
      button.addEventListener('click', () => {
        this.toggleNewForm(!this.new_form_open);
      });
      this.new_button_container.appendChild(button);
    } else if (['layWitness', 'positionPapers'].includes(this.section_key)) {
      const file_input = document.createElement('input');
      file_input.id = 'file-input';
      file_input.setAttribute('type', 'file');
      file_input.setAttribute('accept', 'application/pdf');
      const file_label = document.createElement('label');
      file_label.innerText = `Upload New ${this.sectionTitle()}`;
      file_label.setAttribute('for', 'file-input');
      file_input.addEventListener('change', () => {
        //
      });
      this.new_button_container.appendChild(file_label);
      this.new_button_container.appendChild(file_input);
    } else {
      // not implemented
    }
  }

  private setNewForm() {
    const form_tag = this.section_key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    console.log(form_tag);
    const t = document.createElement('cuf-news-form');
    const form = document.createElement(`cuf-${form_tag}-form`);
    this.new_form.appendChild(form);
  }

  private setBodyOpen(body_open: boolean) {
    this.body_open = body_open;
    this.section_body.classList.toggle('show', body_open);
  }

  private toggleNewForm(new_form_open: boolean) {
    this.new_form_open = new_form_open;
    this.new_form.classList.toggle('show', new_form_open);
    if (new_form_open) {
      //
    } else {
      //
    }
  }
}

customElements.define('cuf-dashboard-section', CufDashboardSection);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-dashboard-section': CufDashboardSection;
  }
}
