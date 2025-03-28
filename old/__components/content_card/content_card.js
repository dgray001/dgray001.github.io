// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {scrollOverDuration} = await import(`/scripts/util.js?v=${version}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);

export class CufContentCard extends HTMLElement {
  content_key = '';
  collapsible = true;
  json_data;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.content_key = this.attributes.content_key?.value || this.content_key;
    this.collapsible = this.attributes.collapsible ? this.attributes.collapsible.value === 'true' : this.collapsible;
    let start_closed = this.attributes.start_closed ? this.attributes.start_closed.value === 'true' : false;
    if (this.content_key === 'prayer') {
      start_closed = true;
    }
    let fixed_height = parseInt(this.attributes.fixed_height?.value || '0');
    /** @type {string} */
    const card_rotation_image = this.attributes.card_rotation_image?.value ?? '';
    /** @type {string} */
    let card_fade_image = this.attributes.card_fade_image?.value ?? '';
    if (this.content_key !== 'prayer') {
      this.collapsible = false;
      fixed_height = 462; // 330 * 1.4
    }
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
        card_fade_image = '';
        break;
    }
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/content_card/content_card.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/content_card/content_card.css?v=${version}`);
    shadow.appendChild(stylesheet);
    await this.setContent();
    const card = this.shadowRoot.querySelector('.card');
    const headerText = this.shadowRoot.querySelector('.headerText');
    switch(this.content_key) {
      case 'news':
        headerText.href = '/news';
        break;
      case 'papers':
        headerText.href = '/position_papers';
        break;
      case 'jobs_available':
        headerText.href = '/jobs_available';
        break;
      case 'involvement':
        headerText.href = '/involvement';
        break;
      case 'chapters':
      case 'prayer':
      default:
        console.log(`No page exists for content card: ${this.content_key}`)
        break;
    }
    const image_plus_element = this.shadowRoot.querySelector('.arrow-image.plus');
    const image_minus_element = this.shadowRoot.querySelector('.arrow-image.minus');
    if (this.collapsible === true) {
      const header = this.shadowRoot.querySelector('.header');
      header.addEventListener('click', this.collapseHeader.bind(null, this, headerText));
      if (start_closed) {
        const content_element = this.shadowRoot.querySelector('.content');
        card.style['border-bottom-left-radius'] = '0px';
        card.style['border-bottom-right-radius'] = '0px';
        content_element.setAttribute('style', 'display: none;');
        image_minus_element.setAttribute('style', 'display: none;');
      }
      else {
        image_plus_element.setAttribute('style', 'display: none;');
      }
    }
    else {
      image_plus_element.setAttribute('style', 'display: none;');
      image_minus_element.setAttribute('style', 'display: none;');
      headerText.setAttribute('style', 'max-width: calc(100% - 0.3rem);')
    }
    if (card_rotation_image) {
      if (!fixed_height) {
        throw new Error('Need to set fixed height when card_rotation_image set.');
      }
      const image = document.createElement('img');
      image.src = card_rotation_image.endsWith('.jpg') ?
        `__images/${card_rotation_image}` :
        `__images/${card_rotation_image}.png`;
      image.classList.add('rotation-image');
      card.remove();
      const card_wrapper = document.createElement('div');
      card_wrapper.classList.add('card-wrapper');
      const card_rotater = document.createElement('div');
      card_rotater.classList.add('card-rotater');
      this.shadowRoot.appendChild(card_wrapper);
      card_wrapper.appendChild(card_rotater);
      card_rotater.appendChild(card);
      card_rotater.appendChild(image);
      let fixed_width = 2 * fixed_height; // calculated from fixed height
      if (1.1 * fixed_width > window.innerWidth) {
        fixed_width = window.innerWidth / 1.1;
        fixed_height = fixed_width / 2.0;
      }
      card.setAttribute('style', `box-shadow: 0 0 0px var(--card-box-shadow-color); transform: rotateX(-90deg) scale(0.9) translateZ(${0.5 * fixed_height}px); height: 100%; overflow-y: scroll; overflow-x: hidden;`);
      image.setAttribute('style', `transform: scale(0.9) translateZ(${0.5 * fixed_height}px);`);
      card_wrapper.setAttribute('style', `height: ${fixed_height}px;
        min-height: ${fixed_height}px; max-height: ${fixed_height}px;
        min-width: ${fixed_width}px; max-width: ${fixed_width}px;
        perspective: ${5 * fixed_height}px; width: ${fixed_width}px;`);
      let last_scroll_top = 0;
      card_wrapper.classList.add('showing-image');
      if ('ontouchstart' in window) {
        // Touchscreen event listeners
        card_wrapper.addEventListener('touchstart', (e) => {
          const touch = e.touches[0] || e.changedTouches[0];
          const scroll_start_x = touch.clientX + card_wrapper.scrollLeft;
          const scroll_start_y = touch.clientY + card_wrapper.scrollTop;
          card_wrapper.setAttribute('touchscroll-start-x', scroll_start_x.toString());
          card_wrapper.setAttribute('touchscroll-start-y', scroll_start_y.toString());
        });
        card_wrapper.addEventListener('touchend', (e) => {
          const touch = e.touches[0] || e.changedTouches[0];
          const scroll_end_x = touch.clientX + card_wrapper.scrollLeft;
          const scroll_end_y = touch.clientY + card_wrapper.scrollTop;
          const scroll_start_x = parseInt(card_wrapper.getAttribute('touchscroll-start-x'));
          const scroll_start_y = parseInt(card_wrapper.getAttribute('touchscroll-start-y'));
          if (!scroll_start_x || !scroll_start_y) {
            return;
          }
          const cutoff_distance = 2;
          if (Math.abs(scroll_end_x - scroll_start_x) > cutoff_distance ||
            Math.abs(scroll_end_y - scroll_start_y) > cutoff_distance) {
              return;
            }
          if (card_rotater.getAttribute('style') && card_rotater.getAttribute('style').includes('rotateX(90deg)')) {
            card_wrapper.classList.add('showing-image');
            last_scroll_top = card_wrapper.scrollTop;
            card_rotater.setAttribute('style', 'transform: rotateX(0deg);');
            scrollOverDuration(card_wrapper, 0, 200);
          }
          else {
            card_wrapper.classList.remove('showing-image');
            card_rotater.setAttribute('style', 'transform: rotateX(90deg);');
            scrollOverDuration(card_wrapper, last_scroll_top, 200);
          }
        });
        card_wrapper.addEventListener('touchstart', (e) => {
          if (card_wrapper.classList.contains('showing-image')) {
            return;
          }
          e.preventDefault();
          const touch = e.touches[0] || e.changedTouches[0];
          const scroll_start = touch.clientY + card.scrollTop;
          card.setAttribute('touchscroll-start', scroll_start.toString());
        });
        card_wrapper.addEventListener('touchend', (e) => {
          if (card_wrapper.classList.contains('showing-image')) {
            return;
          }
          e.preventDefault();
          card.removeAttribute('touchscroll-start');
        });
        card_wrapper.addEventListener('touchmove', (e) => {
          if (card_wrapper.classList.contains('showing-image')) {
            return;
          }
          const scroll_start = card.getAttribute('touchscroll-start');
          if (!scroll_start) {
            return;
          }
          e.preventDefault();
          const touch = e.touches[0] || e.changedTouches[0];
          card.scrollTop = parseInt(scroll_start) - touch.clientY;
        });
      }
      // Mouse event listeners
      card_wrapper.addEventListener('mouseenter', () => {
        card_wrapper.classList.remove('showing-image');
        card_rotater.setAttribute('style', 'transform: rotateX(90deg);');
        scrollOverDuration(card_wrapper, last_scroll_top, 200);
      });
      card_wrapper.addEventListener('mouseleave', () => {
        card_wrapper.classList.add('showing-image');
        last_scroll_top = card_wrapper.scrollTop;
        card_rotater.setAttribute('style', 'transform: rotateX(0deg);');
        scrollOverDuration(card_wrapper, 0, 200);
      });
      card_wrapper.addEventListener('wheel', (e) => {
        if (card_wrapper.classList.contains('showing-image')) {
          return;
        }
        e.preventDefault();
        card.scrollTop += 0.3 * e.deltaY;
      });
    }
    else if (card_fade_image) {
      if (!fixed_height) {
        throw new Error('Need to set fixed height when card_fade_image set.');
      }
      const image = document.createElement('img');
      image.src = card_fade_image.endsWith('.jpg') ?
        `__images/${card_fade_image}` :
        `__images/${card_fade_image}.png`;
      image.classList.add('fade-image');
      card.remove();
      card.setAttribute('style', `height: ${fixed_height}px; min-height: ${fixed_height}px; max-height: ${fixed_height}px; overflow-y: scroll;`);
      const image_wrapper = document.createElement('div');
      image_wrapper.classList.add('image-wrapper');
      const card_wrapper = document.createElement('div');
      card_wrapper.classList.add('card-fade-wrapper');
      this.shadowRoot.appendChild(card_wrapper);
      card_wrapper.appendChild(card);
      card_wrapper.appendChild(image_wrapper);
      image_wrapper.appendChild(image);
      const card_name = document.createElement('div');
      card_name.classList.add('card-name');
      card_name.innerText = this.json_data['header'] ?? '';
      image_wrapper.appendChild(card_name);
      image_wrapper.addEventListener('click', () => {
        image_wrapper.setAttribute('style', 'opacity: 0;');
        setTimeout(() => {
          image_wrapper.setAttribute('style', 'display: none;');
        }, 400);
      });
    }
    else if (fixed_height) {
      card.setAttribute('style', `height: ${fixed_height}px; min-height: ${fixed_height}px; max-height: ${fixed_height}px; overflow-y: scroll;`);
    }
  }

  /**
   * @typedef {Object} ContentCardData
   * @property {string} title
   * @property {string} titlelink
   * @property {string} description
   */
  async setContent() {
    try {
      this.json_data = await fetchJson(`${this.content_key}/${this.content_key}.json`);
      this.shadowRoot.querySelector('.headerText').innerHTML = this.json_data['header'];
      let content_list = '';
      /** @type {Array<ContentCardData>} */
      const contents = [];
      if (this.json_data['subheader']) {
        contents.push(this.json_data['subheader']);
      }
      contents.push(...this.json_data['content']);
      let not_first = false;
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
      this.shadowRoot.querySelector('.content').innerHTML = content_list;
    } catch(error) {
      throw new Error(`Error setting content for ${this.content_key}: ${error.toString()}.`);
    }
  }
  
  collapseHeader(source, headerText, evt) {
    if (evt.explicitOriginalTarget === headerText) { // if click header text
      return;
    }
    const card = source.shadowRoot.querySelector('.card');
    const content_element = source.shadowRoot.querySelector('.content');
    const image_plus_element = source.shadowRoot.querySelector('.arrow-image.plus');
    const image_minus_element = source.shadowRoot.querySelector('.arrow-image.minus');
    const content_style = window.getComputedStyle(content_element);
    if (content_style.display === 'block') {
      card.setAttribute('style', 'border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;');
      content_element.setAttribute('style', 'display: none;');
      image_plus_element.setAttribute('style', 'display: block;');
      image_minus_element.setAttribute('style', 'display: none;');
    }
    else {
      card.removeAttribute('style');
      content_element.setAttribute('style', 'display: block;');
      image_plus_element.setAttribute('style', 'display: none;');
      image_minus_element.setAttribute('style', 'display: block;');
    }
  }
}

customElements.define("cuf-content-card", CufContentCard);
