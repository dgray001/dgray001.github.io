import { until } from '../scripts/util';

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
  private els_metadata: ElementMetadata[] = [];

  async connectedCallback() {
    this.classList.add('cuf-element');
    this.innerHTML = this.htmlString;
    await until(this.elementsParsed.bind(this));
    await this.parsedCallback();
    this.classList.add('parsed');
    this.fully_parsed = true;
    this.fullyParsedCallback();
  }

  protected elementsParsed(): boolean {
    let parsed = true;
    for (const el_metadata of this.els_metadata) {
      // @ts-ignore -> check value in subclass
      let el: HTMLElement | null = el_metadata.found_element ? this[el_metadata.name] : null;
      if (!el_metadata.found_element) {
        el = this.querySelector(`#${el_metadata.element_id}`);
        if (el) {
          // @ts-ignore -> set value in subclass
          this[el_metadata.name] = el;
          el_metadata.found_element = true;
        }
      }
      if (!el_metadata.found_element) {
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

  protected parsedCallback(): void | Promise<void> {}
  protected fullyParsedCallback(): void | Promise<void> {}

  protected configureElement(name: string, element_id?: string) {
    if (!element_id) {
      element_id = name.replace(/_/g, '-');
    }
    this.els_metadata.push({ element_id, name } as ElementMetadata);
  }

  protected configureElements(...names: string[]) {
    for (const name of names) {
      this.configureElement(name);
    }
  }
}
