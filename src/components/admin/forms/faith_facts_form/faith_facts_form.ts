import { CufForm } from '../../../common/form/form';
import { CufInputText } from '../../../common/form/form_field/input_text/input_text';
import { CufTextArea } from '../../../common/form/form_field/text_area/text_area';

import html from './faith_facts_form.html';

import './faith_facts_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

/** Data captured in a faith fact form */
export declare interface FaithFactsFormData {
  title: string;
  question: string;
  summary: string;
}

export class CufFaithFactsForm extends CufForm<FaithFactsFormData> {
  private ff_title: CufInputText;
  private ff_question: CufInputText;
  private ff_summary: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['ff_title', 'ff_question', 'ff_summary']);
    this.configureElement('submit_button');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.submit_button.addEventListener('click', this.submit_callback);
  }

  setSubmitCallback(submit_callback: () => Promise<void>) {
    this.submit_callback = submit_callback;
  }

  getSubmitButton(): HTMLButtonElement {
    return this.submit_button;
  }

  override getData(): FaithFactsFormData {
    return {
      title: this.ff_title.getData() || undefined,
      question: this.ff_question.getData() || undefined,
      summary: this.ff_summary.getData() || undefined,
    };
  }

  protected override _setData(data: FaithFactsFormData): void {
    this.ff_title.setData(data.title ?? '');
    this.ff_question.setData(data.question ?? '');
    this.ff_summary.setData(data.summary ?? '');
  }
}

customElements.define('cuf-faith-facts-form', CufFaithFactsForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-faith-facts-form': CufFaithFactsForm;
  }
}
