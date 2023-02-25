import {scrollOverDuration} from "../../scripts/util.js";

class CufContentCard extends HTMLElement {
  content_key = '';
  collapsible = true;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.content_key = this.attributes.content_key?.value || this.content_key;
    this.collapsible = this.attributes.collapsible ? this.attributes.collapsible.value === 'true' : this.collapsible;
    const start_closed = this.attributes.start_closed ? this.attributes.start_closed.value === 'true' : false;
    let fixed_height = parseInt(this.attributes.fixed_height?.value || '0');
    const card_rotation_image = this.attributes.card_rotation_image?.value || '';
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/content_card/content_card.html');
    const content = await res.text();
    shadow.innerHTML = content;
    this.setContent();
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
      case 'prayer':
      default:
        console.log(`No page exists for content card: ${this.content_key}`)
        break;
    }
    if (this.collapsible === true) {
      const header = this.shadowRoot.querySelector('.header');
      header.addEventListener('click', this.collapseHeader.bind(null, this, headerText));
      if (start_closed) {
        const content_element = this.shadowRoot.querySelector('.content');
        const image_element = this.shadowRoot.querySelector('.arrow-image');
        content_element.setAttribute('style', 'display: none;');
        image_element.setAttribute('style', 'transform: rotate(90deg)');
      }
    }
    else {
      const image_element = this.shadowRoot.querySelector('.arrow-image');
      image_element.setAttribute('style', 'display: none;');
      headerText.setAttribute('style', 'max-width: calc(100% - 0.3rem);')
    }
    if (card_rotation_image) {
      if (!fixed_height) {
        throw new Error('Need to set fixed height when card_rotation_image set.');
      }
      const image = document.createElement('img');
      image.src = `__images/${card_rotation_image}.png`;
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
      card.setAttribute('style', `box-shadow: 0 0 0px var(--card-box-shadow-color); transform: rotateX(-90deg) scale(0.9) translateZ(${0.5 * fixed_height}px); height: 100%;`);
      image.setAttribute('style', `transform: scale(0.9) translateZ(${0.5 * fixed_height}px);`);
      card_wrapper.setAttribute('style', `height: ${fixed_height}px;
        min-height: ${fixed_height}px; max-height: ${fixed_height}px;
        min-width: ${fixed_width}px; max-width: ${fixed_width}px;
        perspective: ${5 * fixed_height}px; width: ${fixed_width}px;`);
      let last_scroll_top = 0;
      card_wrapper.classList.add('showing-image');
      if ('ontouchstart' in window) {
        card_wrapper.addEventListener('click', () => {
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
      }
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
        e.preventDefault();
        console.log(e.deltaY, card.offsetHeight, card_wrapper.offsetHeight);
        card_wrapper.scrollTop += e.deltaY;
        card_rotater.scrollTop += e.deltaY;
        card.scrollTop += e.deltaY;
      });
    }
    else if (fixed_height) {
      card.setAttribute('style', `height: ${fixed_height}px; min-height: ${fixed_height}px; max-height: ${fixed_height}px; overflow-y: scroll;`);
    }
  }

  async setContent() {
    try {
      const response = await fetch(`./__data/${this.content_key}/${this.content_key}.json`);
      const json_data = await response.json();
      this.shadowRoot.querySelector('.headerText').innerHTML = json_data['header'];
      let content_list = '';
      let not_first = false;
      for (const content of json_data['content']) {
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
      throw new Error('Error setting content for: ' + this.content_key);
    }
  }
  
  collapseHeader(source, headerText, evt) {
    if (evt.explicitOriginalTarget === headerText) { // if click header text
      return;
    }
    const content_element = source.shadowRoot.querySelector('.content');
    const image_element = source.shadowRoot.querySelector('img.arrow-image');
    const content_style = window.getComputedStyle(content_element);
    if (content_style.display === 'block') {
      content_element.setAttribute('style', 'display: none;');
      image_element.setAttribute('style', 'animation: closeRotate 300ms forwards');
    }
    else {
      content_element.setAttribute('style', 'display: block;');
      image_element.setAttribute('style', 'animation: openRotate 300ms forwards');
      //source.scrollIntoView({behavior: "smooth", block: "center"});
    }
  }
}

customElements.define("cuf-content-card", CufContentCard);