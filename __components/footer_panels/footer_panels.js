import { panelsToIncludeFrom } from '../../scripts/datalists.js';

class CufFooterPanels extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/footer_panels/footer_panels.html');
    shadow.innerHTML = await res.text();
    try {
      const panels_data = this.attributes.panels?.value || '[]';
      const panels_to_include = panelsToIncludeFrom(panels_data);
      const content = this.shadowRoot.querySelector('.content');
      let content_string = '';
      for (const panel_to_include of panels_to_include) {
        const response = await fetch(`./__data/${panel_to_include}/${panel_to_include}.json`);
        const json_data = await response.json();
        if (!json_data['content'] || json_data['content'].length === 0) {
          continue;
        }
        content_string += `<span class="content-card"><cuf-content-card content_key="${panel_to_include}" collapsible="false" start_closed="false" fixed_height="300" card_rotation_image="test_image"></cuf-content-card></span>`;
      }
      content.innerHTML = content_string;
    } catch(e) {
      throw new Error('Error setting content for panels with data: ' + this.attributes.panels);
    }
  }
}

customElements.define("cuf-footer-panels", CufFooterPanels);