import {JsonData, JsonDataContent, fetchJson} from '../../../data/data_control';
import {CufElement} from '../../cuf_element';

import html from './content_card.html';

import './content_card.scss';

enum ContentCardType {
  NORMAL,
  FADE_IN,
}

export class CufContentCard extends CufElement {
  private header: HTMLDivElement;
  private header_text: HTMLAnchorElement;
  private img_wrapper: HTMLDivElement;
  private content: HTMLDivElement;

  private content_key = '';
  private card_type: ContentCardType = ContentCardType.NORMAL;

  private json_data: JsonData;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('header');
    this.configureElement('header_text');
    this.configureElement('img_wrapper');
    this.configureElement('content');
  }

  protected override async parsedCallback(): Promise<void> {
    this.content_key = this.attributes.getNamedItem('content-key')?.value ?? '';
    const collapsible = !!(this.attributes.getNamedItem('collapsible')?.value ?? '');
    const start_closed = !!(this.attributes.getNamedItem('start-closed')?.value ?? '');
    const fade_in = !!(this.attributes.getNamedItem('fade-in')?.value ?? '');
    const fixed_height = parseInt(this.attributes.getNamedItem('fixed-height')?.value) ?? 0;
    if (!this.content_key) {
      console.error('Must set content key for content card');
      return;
    }
    if (!!fixed_height) {
      this.classList.add('fixed-height');
      this.style.setProperty('--fixed-height', `${fixed_height}px`);
    }
    this.json_data = await fetchJson<JsonData>(`${this.content_key}/${this.content_key}.json`);
    this.setContent();
    this.setLink();
    if (fade_in) {
      this.card_type = ContentCardType.FADE_IN;
    }
    switch(this.card_type) {
      case ContentCardType.FADE_IN:
        if (fixed_height < 1) {
          console.error('Must set fixed height for fade in content card');
          break;
        }
        this.fadeInLogic(fixed_height);
        break;
      default:
        break;
    }
    if (collapsible) {
      if (start_closed) {
        this.classList.add('closed');
      }
      this.header.addEventListener('click', () => {
        this.classList.toggle('closed');
      });
    } else {
      this.img_wrapper.remove();
    }
  }

  private setContent() {
    this.header_text.innerText = this.json_data.header;
    if (!!this.json_data.headerlink) {
      this.header_text.href = this.json_data.headerlink;
    }
    const contents: JsonDataContent[] = [];
    if (!!this.json_data.subheader) {
      contents.push(this.json_data.subheader);
    }
    contents.push(...this.json_data.content);
    if (contents.length === 0) {
      this.remove();
      return;
    }
    let not_first = false;
    let content_list = '';
    for (const content of contents) {
      if (not_first) {
        content_list += '<hr class="element-spacer">';
      }
      content_list += '<div class="content-element"';
      if (content['title']) {
        if (content['titlelink']) {
          content_list += ` class="element-with-title"><div class="element-title"><a href="${content['titlelink']}" target="_blank" onclick="event.stopPropagation()">${content['title']}</a></div`;
        }
        else {
          content_list += ` class="element-with-title"><div class="element-title">${content['title']}</div`;
        }
      }
      if (content['description']) {
        content_list += `>${content['description']}</div>`
      }
      else {
        content_list += '></div>';
      }
      not_first = true;
    }
    this.content.innerHTML = content_list;
  }

  private setLink() {
    //
  }

  private fadeInLogic(fixed_height: number) {
    let card_fade_image = '';
    switch(this.content_key) {
      case 'involvement':
        card_fade_image = 'paintings/cards/annunciation.jpg';
        break;
      case 'chapters':
        card_fade_image = 'paintings/cards/assumption.jpg';
        break;
      case 'papers':
        card_fade_image = 'paintings/cards/ghent_almighty.jpg';
        break;
      default:
        console.error(`Unrecognized fade in content key: ${this.content_key}`);
        break;
    }
  }
}

customElements.define('cuf-content-card', CufContentCard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-content-card': CufContentCard;
  }
}
