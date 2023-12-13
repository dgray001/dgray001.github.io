import {CufElement} from '../../cuf_element';
import {until} from '../../../scripts/util';

import html from './slider.html';

import './slider.scss';
import { CufHeaderHome } from '../header_home/header_home';

export class CufSlider extends CufElement {
  private wrapper: HTMLDivElement;

  private imgs = new Map<string, HTMLImageElement>();
  private last_scale_used = 0;
  private stop_moving = true;
  private stop_moving_timeout: NodeJS.Timeout|undefined = undefined;
  private current_index = 0;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('wrapper');
  }

  protected override parsedCallback(): void {
    const pictures: string[] = [
      'information_services',
      'faith_facts',
      'lay_witness',
      'faith_and_life_series',
    ];
    for (const [i, picture] of pictures.entries()) {
      const container = document.createElement('div');
      container.classList.add('container');
      container.id = `img-${i}`;
      const img = document.createElement('img');
      container.appendChild(img);
      this.imgs.set(this.imageName(picture), img);
      const text = document.createElement('a');
      text.href = `/${picture}`;
      text.innerHTML = this.imageText(picture);
      text.tabIndex = -1;
      if (picture === 'faith_facts') {
        text.classList.add('ff');
      }
      if (i === this.current_index) {
        container.setAttribute('style', 'left: 0px');
      }
      container.appendChild(text);
      this.wrapper.appendChild(container);
    }
    this.wrapper.addEventListener('mousemove', () => {
      this.stop_moving = true;
      clearTimeout(this.stop_moving_timeout);
      this.stop_moving_timeout = setTimeout(() => {
        this.stop_moving = false;
      }, 3000);
    });
    this.wrapper.addEventListener('click', this.nextImage.bind(this, true));
    setInterval(this.nextImage.bind(this, false), 5000);
    this.updateImageSrcs();
    window.addEventListener('resize', this.updateImageSrcs.bind(this));
  }

  private imageName(image: string): string {
    switch(image) {
      case 'information_services':
        return 'calling_of_apostles';
      case 'faith_facts':
        return 'birth_st_mary';
      case 'lay_witness':
        return 'last_supper';
      case 'faith_and_life_series':
        return 'mystique';
      default:
        return '';
    }
  }

  private imageText(image: string): string {
    switch(image) {
      case 'information_services':
        return 'Information\nServices';
      case 'faith_facts':
        return 'Faith\nFacts';
      case 'lay_witness':
        return 'Lay\nWitness';
      case 'faith_and_life_series':
        return 'Faith and\nLife Series';
      default:
        return '';
    }
  }

  private nextImage(force: boolean) {
    //
  }

  async updateImageSrcs() {
    const available_scales = [10, 13.333, 16.666, 20, 23.333, 26.666];
    const header = document.getElementsByTagName('cuf-header-home')[0];
    await until(() => !!header && header.fully_parsed);
    let remaining_height = window.innerHeight - header.offsetHeight;
    if (remaining_height < 1) {
      remaining_height = 1;
    }
    const ratio = 10 * window.innerWidth / remaining_height;
    for (const [i, scale] of available_scales.entries()) {
      if (i < available_scales.length - 1 && ratio > scale) {
        continue;
      }
      if (this.last_scale_used === scale) {
        break;
      }
      const scale_invert = 10 / scale;
      this.wrapper.style.setProperty('--scale', scale_invert.toString());
      const display_scale = Math.floor(scale);
      for (const [painting_name, img] of this.imgs.entries()) {
        img.src = `/images/paintings/slider/${painting_name}_${display_scale}.jpg`;
      }
      break;
    }
  }
}

customElements.define('cuf-slider', CufSlider);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-slider': CufSlider;
  }
}
