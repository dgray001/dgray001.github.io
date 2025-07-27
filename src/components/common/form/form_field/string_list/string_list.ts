import { CufFormField } from '../form_field';

import html from './string_list.html';

import './string_list.scss';

export class CufStringList extends CufFormField<HTMLDivElement, string[]> {
  private add_line: HTMLButtonElement;

  constructor() {
    super();
    this.htmlString += html;
    this.configureElement('add_line');
  }

  protected override async _parsedCallback(): Promise<void> {
    this.add_line.addEventListener('click', () => {
      this.addLine('');
    });
  }

  private addLine(initial: string) {
    const remove = document.createElement('button');
    remove.innerText = 'Remove';
    remove.classList.add('remove');
    const line = document.createElement('input');
    line.value = initial;
    line.classList.add('line');
    remove.addEventListener('click', () => {
      remove.remove();
      line.remove();
    });
    this.form_field.appendChild(remove);
    this.form_field.appendChild(line);
  }

  private getLineEls(): HTMLInputElement[] {
    return [...this.form_field.querySelectorAll<HTMLInputElement>('input.line')];
  }

  private getRemoveButtons(): HTMLButtonElement[] {
    return [...this.form_field.querySelectorAll<HTMLButtonElement>('button.remove')];
  }

  protected _enable(): void {
    this.add_line.disabled = false;
    for (const el of this.getLineEls()) {
      el.disabled = false;
    }
    for (const el of this.getRemoveButtons()) {
      el.disabled = false;
    }
  }

  protected _disable(): void {
    this.add_line.disabled = true;
    for (const el of this.getLineEls()) {
      el.disabled = true;
    }
    for (const el of this.getRemoveButtons()) {
      el.disabled = true;
    }
  }

  override getData(): string[] {
    return this.getLineEls().map((el) => el.value);
  }

  override getStringData(): string {
    return JSON.stringify(this.getData());
  }

  override _setData(data: string[]): void {
    data.forEach((d) => {
      this.addLine(d);
    });
  }

  override clearData(): void {
    this.form_field.replaceChildren();
  }

  override setTestData(): void {
    this.addLine('test line 1');
    this.addLine('test line 2');
  }
}

customElements.define('cuf-string-list', CufStringList);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-string-list': CufStringList;
  }
}
