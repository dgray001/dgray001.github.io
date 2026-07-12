import { CufForm } from '../../../common/form/form';
import { CufInputText } from '../../../common/form/form_field/input_text/input_text';
import { CufTextArea } from '../../../common/form/form_field/text_area/text_area';

import html from './position_papers_form.html';

import './position_papers_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

/** Data captured in a position papers form */
export declare interface PositionPapersFormData {
  title: string;
  description?: string;
}

export class CufPositionPapersForm extends CufForm<PositionPapersFormData> {
  private paper_title: CufInputText;
  private paper_description: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['paper_title', 'paper_description']);
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

  override getData(): PositionPapersFormData {
    return {
      title: this.paper_title.getData() || undefined,
      description: this.paper_description.getData() || undefined,
    };
  }

  protected override _setData(data: PositionPapersFormData): void {
    this.paper_title.setData(data.title ?? '');
    this.paper_description.setData(data.description ?? '');
  }
}

customElements.define('cuf-position-papers-form', CufPositionPapersForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-position-papers-form': CufPositionPapersForm;
  }
}
