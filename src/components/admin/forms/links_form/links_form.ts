import {CufForm} from '../../../common/form/form';
import {CufInputText} from '../../../common/form/form_field/input_text/input_text';
import {CufTextArea} from '../../../common/form/form_field/text_area/text_area';

import html from './links_form.html';

import './links_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/text_area/text_area';

/** Data captured in a links form */
export declare interface LinksFormData {
  group: string;
  title: string;
  titlelink: string;
  description?: string;
}

export class CufLinksForm extends CufForm<LinksFormData> {
  private links_group: CufInputText;
  private links_title: CufInputText;
  private links_titlelink: CufInputText;
  private links_description: CufTextArea;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'links_group',
      'links_title',
      'links_titlelink',
      'links_description',
    ]);
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

  override getData(): LinksFormData {
    return {
      group: this.links_group.getData() || undefined,
      title: this.links_title.getData() || undefined,
      titlelink: this.links_titlelink.getData() || undefined,
      description: this.links_description.getData() || undefined,
    };
  }

  protected override _setData(data: LinksFormData): void {
    this.links_group.setData(data.group ?? '');
    this.links_title.setData(data.title ?? '');
    this.links_titlelink.setData(data.titlelink ?? '');
    this.links_description.setData(data.description ?? '');
  }
}

customElements.define('cuf-links-form', CufLinksForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-links-form': CufLinksForm;
  }
}
