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
    const fixed_height = parseInt(this.attributes.fixed_height?.value || '0');
    const card_rotation_image = this.attributes.card_rotation_image?.value || '';
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/content_card/content_card.html');
    const content = await res.text();
    shadow.innerHTML = content;
    this.setContent();
    const card = this.shadowRoot.querySelector('.card');
    const headerText = this.shadowRoot.querySelector('.headerText');
    headerText.addEventListener('click', this.clickHeaderText.bind(null, this.content_key));
    if (this.collapsible === true) {
      const header = this.shadowRoot.querySelector('.header');
      header.addEventListener('click', this.collapseHeader.bind(null, this, headerText));
      if (start_closed) {
        const content_element = this.shadowRoot.querySelector('.content');
        const image_element = this.shadowRoot.querySelector('.image');
        content_element.setAttribute('style', 'display: none;');
        image_element.setAttribute('style', 'transform: rotate(90deg)');
      }
    }
    else {
      const image_element = this.shadowRoot.querySelector('.image');
      image_element.setAttribute('style', 'display: none;');
      headerText.setAttribute('style', 'max-width: calc(100% - 0.3rem);')
    }
    if (card_rotation_image) {
      if (!fixed_height) {
        throw new Error('Need to set fixed height when card_rotaiton_image set.');
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
      card.setAttribute('style', `box-shadow: 0 0 0px var(--card-box-shadow-color); transform: rotateX(-90deg) scale(0.9) translateZ(${0.5 * fixed_height}px); height: 100%;`);
      image.setAttribute('style', `transform: scale(0.9) translateZ(${0.5 * fixed_height}px);`);
      card_wrapper.setAttribute('style', `height: ${fixed_height}px; min-height: ${fixed_height}px; max-height: ${fixed_height}px; perspective: ${5 * fixed_height}px`);
      card_wrapper.addEventListener('mouseover', () => {
        card_rotater.setAttribute('style', 'transform: rotateX(90deg);');
      });
      card_wrapper.addEventListener('mouseleave', () => {
        card_rotater.setAttribute('style', 'transform: rotateX(0deg);');
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
            content_list += ` class="element-with-title"><div class="element-title"><a href="${content['titlelink']}" target="_blank">${content['title']}</a></div`;
          }
          else {
            content_list += ` class="element-with-title"><div class="element-title">${content['title']}</div`;
          }
        }
        if (content['textfile']) {
          const element_response = await fetch(`./__data/${this.content_key}/${content['textfile']}.txt`);
          const element_data = await element_response.text();
          content_list += `>${element_data}</div>`
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
    const image_element = source.shadowRoot.querySelector('.image');
    const content_style = window.getComputedStyle(content_element);
    if (content_style.display === 'block') {
      content_element.setAttribute('style', 'display: none;');
      image_element.setAttribute('style', 'animation: closeRotate 300ms forwards');
    }
    else {
      content_element.setAttribute('style', 'display: block;');
      image_element.setAttribute('style', 'animation: openRotate 300ms forwards');
      source.scrollIntoView({behavior: "smooth"});
    }
  }

  clickHeaderText(content_key) {
    switch(content_key) {
      case 'news':
      case 'papers':
      case 'prayer':
      case 'jobs_available':
      default:
        console.log(`No content card exists yet for: ${content_key}`)
        break;
    }
  }
}

customElements.define("cuf-content-card", CufContentCard);