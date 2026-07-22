import { apiPost } from '@core/scripts/api';
import { fetchJson } from '@core/data/data_control';
import { DwgElement } from '@core/components/dwg_element';
import { pageToName } from '../../common/util';
import { page_sections } from '../../../config/page_sections';

import html from './page_content_editor.html';

import './page_content_editor.scss';
import '../preview_dialog/preview_dialog';

/** Keyed by section id (see PageSection.id), not by page */
type PageContentData = Record<string, string>;

export class SjfPageContentEditor extends DwgElement {
  private page_select!: HTMLSelectElement;
  private content_textarea!: HTMLTextAreaElement;
  private preview_button!: HTMLButtonElement;
  private save_button!: HTMLButtonElement;
  private status_message!: HTMLDivElement;

  private page_content: PageContentData = {};
  private current_section_id = '';

  constructor() {
    super();
    this.htmlString = html;
    this.configureElements(
      'page_select',
      'content_textarea',
      'preview_button',
      'save_button',
      'status_message'
    );
  }

  protected override async parsedCallback(): Promise<void> {
    this.page_content = await fetchJson<PageContentData>('page_content/page_content.json');
    for (const section of page_sections) {
      const option = document.createElement('option');
      option.value = section.id;
      option.innerText = `${pageToName(section.page)}: ${section.label}`;
      this.page_select.appendChild(option);
    }
    this.setCurrentSection(page_sections[0].id);
    this.page_select.addEventListener('change', () => {
      this.setCurrentSection(this.page_select.value);
    });
    this.content_textarea.addEventListener('input', () => {
      this.page_content[this.current_section_id] = this.content_textarea.value;
    });
    this.preview_button.addEventListener('click', () => {
      const dialog = document.createElement('sjf-preview-dialog');
      dialog.setData({ html: this.content_textarea.value });
      this.appendChild(dialog);
    });
    this.save_button.addEventListener('click', async () => {
      this.page_content[this.current_section_id] = this.content_textarea.value;
      const res = await apiPost('admin_dashboard/page_content_data', this.page_content);
      if (res.success) {
        this.successStatus('Page content saved');
      } else {
        this.errorStatus(
          res.error_message ?? 'An unknown error occurred trying to save page content'
        );
      }
    });
  }

  private setCurrentSection(section_id: string) {
    this.current_section_id = section_id;
    this.page_select.value = section_id;
    this.content_textarea.value = this.page_content[section_id] ?? '';
  }

  private messageStatus(message: string): void {
    if (message) {
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
}

customElements.define('sjf-page-content-editor', SjfPageContentEditor);

declare global {
  interface HTMLElementTagNameMap {
    'sjf-page-content-editor': SjfPageContentEditor;
  }
}
