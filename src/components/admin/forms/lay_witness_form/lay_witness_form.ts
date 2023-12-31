import {CufForm} from '../../../common/form/form';

import html from './lay_witness_form.html';

import './lay_witness_form.scss';

/** Data captured in a laywitness form */
export declare interface LayWitnessFormData {
  //
}

export class CufLayWitnessForm extends CufForm<LayWitnessFormData> {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  override getData(): LayWitnessFormData {
    return {
      //
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
