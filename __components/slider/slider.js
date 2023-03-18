// @ts-check
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);

export class CufSlider extends HTMLElement {
  /** @type {ShadowRoot} */
  shadow;

  current_index = 0;
  max_index = 0;
  stop_moving = false;
  last_stop_moving_timeout = 0;
  in_transition = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch(`/__components/slider/slider.html?v=${version}`);
    this.shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/slider/slider.css?v=${version}`);
    this.shadow.appendChild(stylesheet);

    const data = {
      'information_services': {
        'image': 'calling_of_apostles',
        'text': 'Information\nServices',
      },
      'faith_facts': {
        'image': 'birth_st_mary',
        'text': 'Faith\nFacts',
      },
      'lay_witness': {
        'image': 'last_supper',
        'text': 'Lay\nWitness',
      },
      'faith_and_life_series': {
        'image': 'mystique',
        'text': 'Faith and\nLife Series',
      },
    };

    const container = this.shadow.querySelector('.container');
    const imgs = this.shadow.querySelector('.images');
    const dots = this.shadow.querySelector('.dots');
    const texts = this.shadow.querySelector('.texts');
    if (!container || !imgs || !dots || !texts) {
      throw new Error('Missing required elements');
    }

    container.addEventListener('mousemove', () => {
      this.stop_moving = true;
      clearTimeout(this.last_stop_moving_timeout);
      this.last_stop_moving_timeout = setTimeout(() => {
        this.stop_moving = false;
      }, 1200);
    });
    container.addEventListener('click', this.nextImage.bind(this, true));

    let i = 0;
    for (const page in data) {
      i++;
      const img = document.createElement('img');
      img.src = `/__images/paintings/${data[page]['image']}.jpg`;
      img.id = `img-${i}`;
      if (i == 1) {
        this.current_index = 1;
        img.setAttribute('style', 'left: 0px');
        setInterval(this.nextImage.bind(this, false), 3000);
      }
      imgs.appendChild(img);
    }
    this.max_index = i;
  }

  nextImage(force = false) {
    if (!force && (this.max_index < 1 || this.stop_moving)) {
      return;
    }
    if (this.in_transition) {
      return;
    }

    const old_image = this.shadow.querySelector(`#img-${this.current_index}`);
    this.current_index++;
    if (this.current_index > this.max_index) {
      this.current_index = 1;
    }
    const new_image = this.shadow.querySelector(`#img-${this.current_index}`);
    if (!old_image || !new_image) {
      throw new Error(`Missing img element: ${this.current_index}`);
    }

    old_image.setAttribute('style', 'left: -100vw; transition: left 0.5s ease;');
    new_image.setAttribute('style', 'left: 0px; transition: left 0.5s ease;');
    this.in_transition = true;
    setTimeout(() => {
      old_image.removeAttribute('style');
      this.in_transition = false;
    }, 500);
  }
}

customElements.define("cuf-slider", CufSlider);
