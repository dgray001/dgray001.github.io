import { apiGetFile } from '../../../scripts/api';
import { getCookie } from '../../../scripts/cookies';
import { hasPermission } from '../../../scripts/session';
import { downloadBlob } from '../../../scripts/util';
import { CufElement } from '../../cuf_element';
import { FaithFactData } from '../faith_fact_category/faith_fact_category';

import html from './faith_fact.html';

import './faith_fact.scss';

export class CufFaithFact extends CufElement {
  private title_el: HTMLButtonElement;
  private content_el: HTMLDivElement;
  private question: HTMLDivElement;
  private question_text: HTMLDivElement;
  private summary_text: HTMLDivElement;
  private download: HTMLButtonElement;

  private faith_fact: FaithFactData;
  private category_name: string;
  private showing = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('title_el');
    this.configureElement('content_el');
    this.configureElement('question');
    this.configureElement('question_text');
    this.configureElement('summary_text');
    this.configureElement('download');
  }

  protected override parsedCallback(): void {
    if (!this.faith_fact || !this.category_name) {
      console.error('Need to set faith fact before attaching to dom');
      return;
    }
    this.title_el.innerText = this.faith_fact.title.toUpperCase();
    if (this.faith_fact.question) {
      this.question_text.innerText = this.faith_fact.question;
    } else {
      this.question.remove();
    }
    this.summary_text.innerText = this.faith_fact.summary;
    this.title_el.addEventListener('click', () => {
      this.showing = !this.showing;
      this.content_el.classList.toggle('showing', this.showing);
    });
    const role = getCookie('role');
    if (hasPermission(role, 'downloadFaithFacts')) {
      this.download.addEventListener('click', async () => {
        let filename = this.faith_fact.title
          .toLowerCase()
          .trim()
          .replaceAll(' ', '_')
          .replaceAll('-', '_');
        for (const c of [':', '?', ',', "'", '"', '.', '’', '“', '”', '!']) {
          filename = filename.replaceAll(c, '');
        }
        filename = filename.trim();
        const blob = await apiGetFile('download_faith_fact', {
          category: this.category_name.toLowerCase().replaceAll(' ', '_').trim(),
          filename,
        });
        downloadBlob(blob, `${filename}.pdf`);
      });
    } else {
      this.download.remove();
    }
  }

  setFaithFact(faith_fact: FaithFactData, category_name: string) {
    this.faith_fact = faith_fact;
    this.category_name = category_name;
  }
}

customElements.define('cuf-faith-fact', CufFaithFact);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-faith-fact': CufFaithFact;
  }
}
