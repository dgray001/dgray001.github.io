import {CufForm} from '../../../common/form/form';

import html from './position_papers_form.html';

import './position_papers_form.scss';

/** Data captured in a position papers form */
export declare interface PositionPapersFormData {
  //
}

export class CufPositionPapersForm extends CufForm<PositionPapersFormData> {
  private example: HTMLDivElement;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('example');
  }

  override getData(): PositionPapersFormData {
    return {
      //
    };
  }

  override setData(data: PositionPapersFormData): void {
    console.error('Not implemented');
  }
}

customElements.define('cuf-position-papers-form', CufPositionPapersForm);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-position-papers-form': CufPositionPapersForm;
  }
}
