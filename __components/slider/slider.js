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

    const wrapper = this.shadow.querySelector('.wrapper');
    if (!wrapper) {
      throw new Error('Missing required elements');
    }

    wrapper.addEventListener('mousemove', () => {
      this.stop_moving = true;
      clearTimeout(this.last_stop_moving_timeout);
      this.last_stop_moving_timeout = setTimeout(() => {
        this.stop_moving = false;
      }, 3000);
    });
    wrapper.addEventListener('click', this.nextImage.bind(this, true));

    let i = 0;
    for (const page in data) {
      i++;
      const container = document.createElement('div');
      container.classList.add('container');
      container.id = `img-${i}`;
      const img = document.createElement('img');
      img.src = `/__images/paintings/${data[page]['image']}.jpg`;
      container.appendChild(img);
      const text = document.createElement('a');
      text.href = `/${page}`;
      text.innerHTML = data[page]['text'];
      text.tabIndex = -1;
      container.appendChild(text);
      if (i == 1) {
        this.current_index = 1;
        container.setAttribute('style', 'left: 0px');
        setInterval(this.nextImage.bind(this, false), 5000);
      }
      wrapper.appendChild(container);
    }
    this.max_index = i;
    const dots = document.createElement('div');
    dots.classList.add('dots');
    for (let i = 1; i <= this.max_index; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.id = `dot-${i}`;
      dot.tabIndex = 1;
      if (i == 1) {
        dot.classList.add('current');
      }
      dot.addEventListener('click', () => {
        this.setImage(this.current_index, i);
      });
      dots.appendChild(dot);
    }
    wrapper.appendChild(dots);
  }

  nextImage(force = false) {
    if (!force && (this.max_index < 1 || this.stop_moving)) {
      return;
    }
    const last_index = this.current_index;
    const next_index = this.current_index >= this.max_index ? 1 : this.current_index + 1;
    this.setImage(last_index, next_index);
  }

  /**
   * Sets the current image if not currently in a transition
   * @param {number} last_index 
   * @param {number} next_index 
   */
  setImage(last_index, next_index) {
    if (this.in_transition) {
      return;
    }

    const old_image = this.shadow.querySelector(`#img-${last_index}`);
    const old_dot = this.shadow.querySelector(`#dot-${last_index}`);
    const new_image = this.shadow.querySelector(`#img-${next_index}`);
    const new_dot = this.shadow.querySelector(`#dot-${next_index}`);
    if (!old_image || !old_dot || !new_image || !new_dot) {
      throw new Error(`Missing img element: ${this.current_index}`);
    }
    this.current_index = next_index;

    old_dot.classList.remove('current');
    new_dot.classList.add('current');
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
