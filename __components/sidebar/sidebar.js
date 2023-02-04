import { panelsToIncludeFrom } from '../../scripts/datalists.js';

class CufSidebar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/sidebar/sidebar.html');
    shadow.innerHTML = await res.text();
    try {
      const panels_data = this.attributes.panels?.value || '[]';
      const panels_to_include = panelsToIncludeFrom(panels_data);
      const content = this.shadowRoot.querySelector('.content');
      const start_closed = window.innerWidth < 600;
      let content_string = '';
      for (const panel_to_include of panels_to_include) {
        const response = await fetch(`./__data/${panel_to_include}/${panel_to_include}.json`);
        const json_data = await response.json();
        if (!json_data['content'] || json_data['content'].length === 0) {
            continue;
        }
        content_string += `<div class="content-card"><cuf-content-card content_key="${panel_to_include}"
          collapsible="true" start_closed="${start_closed}"></cuf-content-card></div>`;
      }
      content.innerHTML = content_string;
    } catch(e) {
      throw new Error('Error setting content for sidebar with data:' + this.attributes.panels + 'and error' + e)
    }
  }
}

customElements.define("cuf-sidebar", CufSidebar);
