import {until} from '../scripts/util';

import './cuf_element.scss';

/** Describes an html element used by DwgElements */
interface ElementMetadata {
  element_id: string;
  name: string;
  found_element: boolean;
}

export abstract class CufElement extends HTMLElement {
  protected htmlString: string;
  fully_parsed = false;
  private elsMetadata: ElementMetadata[] = [];

  async connectedCallback() {
    this.classList.add('cuf-element');
    this.innerHTML = this.htmlString;
    await until(this.elementsParsed.bind(this));
    this.parsedCallback();
    this.classList.add('parsed');
    this.fully_parsed = true;
    this.fullyParsedCallback();
  }

  private elementsParsed(): boolean {
    let parsed = true;
    for (const elMetadata of this.elsMetadata) {
      // @ts-ignore -> check value in subclass
      let el: HTMLElement|null = elMetadata.found_element ? this[elMetadata.name] : null;
      if (!elMetadata.found_element) {
        el = this.querySelector(`#${elMetadata.element_id}`);
        if (!!el) {
          // @ts-ignore -> set value in subclass
          this[elMetadata.name] = el;
          elMetadata.found_element = true;
        }
      }
      if (!elMetadata.found_element) {
        parsed = false;
        continue;
      }
      if (el instanceof CufElement) {
        if (!el.fully_parsed) {
          parsed = false;
        }
      }
    }
    return parsed;
  }

  protected parsedCallback() {}
  protected fullyParsedCallback() {}

  protected configureElement(name: string, element_id?: string) {
    if (!element_id) {
      element_id = name.replace(/_/g, '-');
    }
    this.elsMetadata.push({element_id, name} as ElementMetadata);
  }

  protected configureElements(...names: string[]) {
    for (const name of names) {
      this.configureElement(name);
    }
  }
}
