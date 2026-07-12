import { CufForm } from '../../../common/form/form';
import { CufInputText } from '../../../common/form/form_field/input_text/input_text';
import { CufTextArea } from '../../../common/form/form_field/text_area/text_area';
import { JsonDataContent } from '../../../../data/data_control';

import html from './subheader_form.html';

import './subheader_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

export class CufSubheaderForm extends CufForm<JsonDataContent> {
  private subheader_title: CufInputText;
  private subheader_titlelink: CufInputText;
  private subheader_description: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm(['subheader_title', 'subheader_titlelink', 'subheader_description']);
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

  override getData(): JsonDataContent {
    return {
      title: this.subheader_title.getData() || undefined,
      titlelink: this.subheader_titlelink.getData() || undefined,
      description: this.subheader_description.getData() || undefined,
    };
  }

  protected override _setData(data: JsonDataContent): void {
    this.subheader_title.setData(data.title ?? '');
    this.subheader_titlelink.setData(data.titlelink ?? '');
    this.subheader_description.setData(data.description ?? '');
  }
}

customElements.define('cuf-subheader-form', CufSubheaderForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-subheader-form': CufSubheaderForm;
  }
}
