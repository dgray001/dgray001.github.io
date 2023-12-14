import {CufElement} from '../../cuf_element';
import {until} from '../../../scripts/util';

import html from './slider.html';

import './slider.scss';

export class CufSlider extends CufElement {
  private wrapper: HTMLDivElement;
  private dots: HTMLDivElement;

  private imgs: HTMLDivElement[] = [];
  private dot_els: HTMLButtonElement[] = [];
  private img_map = new Map<string, HTMLImageElement>();
  private last_scale_used = 0;
  private stop_moving = false;
  private stop_moving_timeout: NodeJS.Timeout|undefined = undefined;
  private current_index = 0;
  private in_transition = false;

  constructor() {
    super();
    this.htmlString = html;
    this.configureElement('wrapper');
    this.configureElement('dots');
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
      img.draggable = false;
      img.alt = this.imageName(picture);
      container.appendChild(img);
      this.imgs.push(container);
      this.img_map.set(this.imageName(picture), img);
      const text = document.createElement('a');
      text.href = `/${picture}`;
      text.innerHTML = this.imageText(picture);
      text.tabIndex = -1;
      if (picture === 'faith_facts') {
        text.classList.add('ff');
      }
      container.appendChild(text);
      this.wrapper.appendChild(container);
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.id = `dot-${i}`;
      dot.tabIndex = 1;
      dot.addEventListener('click', () => {
        this.setImage(this.current_index, i);
      });
      this.dot_els.push(dot);
      this.dots.appendChild(dot);
      if (i === this.current_index) {
        container.setAttribute('style', 'left: 0px');
        dot.classList.add('current');
      }
    }
    this.wrapper.addEventListener('mousemove', this.stopMoving.bind(this));
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
      for (const [painting_name, img] of this.img_map.entries()) {
        img.src = `/images/paintings/slider/${painting_name}_${display_scale}.jpg`;
      }
      break;
    }
  }

  private nextImage(force: boolean) {
    if (!force && (this.imgs.length < 1 || this.stop_moving)) {
      return;
    }
    const last_index = this.current_index;
    const next_index = (this.current_index + 1) >= this.imgs.length ? 0 : this.current_index + 1;
    this.setImage(last_index, next_index);
  }

  private setImage(last_index: number, next_index: number) {
    if (this.in_transition) {
      return;
    }
    this.current_index = next_index;
    this.dot_els[last_index].classList.remove('current');
    this.dot_els[next_index].classList.add('current');
    this.imgs[last_index].setAttribute('style', 'left: -100vw; transition: left 0.5s ease;');
    this.imgs[next_index].setAttribute('style', 'left: 0px; transition: left 0.5s ease;');
    this.in_transition = true;
    setTimeout(() => {
      this.imgs[last_index].removeAttribute('style');
      this.in_transition = false;
    }, 500);
    this.stopMoving();
  }

  private stopMoving() {
    this.stop_moving = true;
    clearTimeout(this.stop_moving_timeout);
    this.stop_moving_timeout = setTimeout(() => {
      this.stop_moving = false;
    }, 3000);
  }
}

customElements.define('cuf-slider', CufSlider);

declare global {
  interface HTMLElementTagNameMap {
    'cuf-slider': CufSlider;
  }
}
