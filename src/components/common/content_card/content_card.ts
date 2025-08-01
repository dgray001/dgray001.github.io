import { JsonData, JsonDataContent, fetchJson } from '../../../data/data_control';
import { until } from '../../../scripts/util';
import { CufElement } from '../../cuf_element';

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

  private json_data: JsonData<JsonDataContent>;
  private collapsible = false;
  private start_closed = false;
  private fade_in = false;
  private fixed_height = 0;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('header');
    this.configureElement('header_text');
    this.configureElement('img_wrapper');
    this.configureElement('content');
  }

  protected override async parsedCallback(): Promise<void> {
    this.classList.add('hidden');
    this.content_key = this.attributes.getNamedItem('content-key')?.value ?? '';
    this.collapsible = !!(this.attributes.getNamedItem('collapsible')?.value ?? '');
    this.start_closed = !!(this.attributes.getNamedItem('start-closed')?.value ?? '');
    this.fade_in = !!(this.attributes.getNamedItem('fade-in')?.value ?? '');
    this.fixed_height = parseFloat(this.attributes.getNamedItem('fixed-height')?.value) ?? 0;
    if (!this.content_key) {
      console.error('Must set content key for content card');
      return;
    }
    if (this.fixed_height) {
      this.classList.add('fixed-height');
      this.style.setProperty('--fixed-height', this.fixed_height.toString());
    }
    if (!!this.fixed_height || this.start_closed) {
      this.fetchAndSetContent();
    } else {
      await this.fetchAndSetContent();
    }
  }

  private async fetchAndSetContent(): Promise<void> {
    this.json_data = await fetchJson<JsonData<JsonDataContent>>(
      `${this.content_key}/${this.content_key}.json`
    );
    this.setContent();
    if (this.fade_in) {
      this.card_type = ContentCardType.FADE_IN;
    }
    switch (this.card_type) {
      case ContentCardType.FADE_IN:
        if (this.fixed_height < 1) {
          console.error('Must set fixed height for fade in content card');
          break;
        }
        this.fadeInLogic();
        break;
      default:
        break;
    }
    if (this.collapsible) {
      if (this.start_closed) {
        this.classList.add('closed');
      }
      this.header.addEventListener('click', () => {
        this.classList.toggle('closed');
      });
    } else {
      this.img_wrapper.remove();
    }
  }

  protected override async fullyParsedCallback(): Promise<void> {
    await until(() => this.clientWidth > 0);
    this.style.setProperty('--width', `${this.clientWidth.toString()}px`);
    this.classList.remove('hidden');
  }

  private setContent() {
    this.header_text.innerText = this.json_data.header;
    if (this.json_data.headerlink) {
      this.header_text.href = this.json_data.headerlink;
    }
    const contents: JsonDataContent[] = [];
    if (this.json_data.subheader) {
      contents.push(this.json_data.subheader);
    }
    if (this.content_key !== 'chapters') {
      contents.push(...this.json_data.content);
    }
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
          content_list += ` class="element-with-title"><div class="element-title"><a href="${content['titlelink']}" onclick="event.stopPropagation()">${content['title']}</a></div`;
        } else {
          content_list += ` class="element-with-title"><div class="element-title">${content['title']}</div`;
        }
      }
      if (content['description']) {
        content_list += `>${content['description']}</div>`;
      } else {
        content_list += '></div>';
      }
      not_first = true;
    }
    this.content.innerHTML = content_list;
  }

  private fadeInLogic() {
    this.classList.add('fade-in');
    const fade_time = 450;
    let card_fade_src = '';
    switch (this.content_key) {
      case 'involvement':
        card_fade_src = '/images/paintings/cards/annunciation.jpg';
        break;
      case 'chapters':
        card_fade_src = '/images/paintings/cards/assumption.jpg';
        break;
      case 'position_papers':
        card_fade_src = '/images/paintings/cards/ghent_almighty.jpg';
        break;
      case 'jobs_available':
        card_fade_src = '/images/paintings/cards/ghent_mary.jpg';
        break;
      default:
        console.error(`Unrecognized fade in content key: ${this.content_key}`);
        break;
    }
    const img_el = document.createElement('img');
    img_el.src = card_fade_src;
    img_el.id = 'fade-image';
    img_el.draggable = false;
    const card_name = document.createElement('div');
    card_name.id = 'card-name';
    card_name.innerText = this.json_data.header;
    const img_wrap_el = document.createElement('div');
    img_wrap_el.id = 'fade-image-wrapper';
    img_wrap_el.style.setProperty('transition', `opacity ${fade_time}ms`);
    img_wrap_el.addEventListener('click', () => {
      img_wrap_el.style.setProperty('opacity', '0');
      setTimeout(() => {
        img_wrap_el.setAttribute('style', 'display: none;');
      }, fade_time);
    });
    img_wrap_el.appendChild(img_el);
    img_wrap_el.appendChild(card_name);
    this.appendChild(img_wrap_el);
  }
}

customElements.define('cuf-content-card', CufContentCard);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-content-card': CufContentCard;
  }
}
