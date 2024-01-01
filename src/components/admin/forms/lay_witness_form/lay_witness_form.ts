import {CufForm} from '../../../common/form/form';
import {CufInputText} from '../../../common/form/form_field/input_text/input_text';
import {CufCheckbox} from '../../../common/form/form_field/checkbox/checkbox';

import html from './lay_witness_form.html';

import './lay_witness_form.scss';
import '../../../common/form/form_field/input_text/input_text';
import '../../../common/form/form_field/checkbox/checkbox';

/** Data captured in a laywitness form */
export declare interface LayWitnessFormData {
  volume: number;
  issue: number;
  title: string;
  addendum: boolean;
  insert: boolean;
}

export class CufLayWitnessForm extends CufForm<LayWitnessFormData> {
  private laywitness_volume: CufInputText;
  private laywitness_issue: CufInputText;
  private laywitness_title: CufInputText;
  private checkbox_addendum: CufCheckbox;
  private checkbox_insert: CufCheckbox;
  private submit_button: HTMLButtonElement;

  private submit_callback: () => Promise<void> = async () => {
    console.error('not implemented');
  };

  constructor() {
    super();
    this.htmlString = html;
    this.configureForm([
      'laywitness_volume',
      'laywitness_issue',
      'laywitness_title',
      'checkbox_addendum',
      'checkbox_insert',
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

  override getData(): LayWitnessFormData {
    return {
      volume: parseInt(this.laywitness_volume.getData().trim()),
      issue: parseInt(this.laywitness_issue.getData().trim()),
      title: this.laywitness_title.getData(),
      addendum: this.checkbox_addendum.getData(),
      insert: this.checkbox_insert.getData(),
    };
  }

  override setData(data: LayWitnessFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-lay-witness-form', CufLayWitnessForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-lay-witness-form': CufLayWitnessForm;
  }
}
