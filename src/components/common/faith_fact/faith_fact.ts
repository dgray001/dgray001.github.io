import {CufElement} from '../../cuf_element';
import {FaithFactData} from '../faith_fact_category/faith_fact_category';

import html from './faith_fact.html';

import './faith_fact.scss';

export class CufFaithFact extends CufElement {
  private title_el: HTMLButtonElement;
  private content_el: HTMLDivElement;
  private question: HTMLDivElement;
  private question_text: HTMLDivElement;
  private summary_text: HTMLDivElement;

  private faith_fact: FaithFactData;
  private showing = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('title_el');
    this.configureElement('content_el');
    this.configureElement('question');
    this.configureElement('question_text');
    this.configureElement('summary_text');
  }

  protected override parsedCallback(): void {
    if (!this.faith_fact) {
      console.error('Need to set faith fact before attaching to dom');
      return;
    }
    this.title_el.innerText = this.faith_fact.title.toUpperCase();
    if (!!this.faith_fact.question) {
      this.question_text.innerText = this.faith_fact.question;
    } else {
      this.question.remove();
    }
    this.summary_text.innerText = this.faith_fact.summary;
    this.title_el.addEventListener('click', () => {
      this.showing = !this.showing;
      this.content_el.classList.toggle('showing', this.showing);
    });
  }

  setFaithFact(faith_fact: FaithFactData) {
    this.faith_fact = faith_fact;
  }
}

customElements.define('cuf-faith-fact', CufFaithFact);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-faith-fact': CufFaithFact;
  }
}
