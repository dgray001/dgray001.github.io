// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);
const {panelsToIncludeFrom} = await import(`/scripts/datalists.js?v=${version}`);

export class CufSidebar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/sidebar/sidebar.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/sidebar/sidebar.css?v=${version}`);
    shadow.appendChild(stylesheet);
    try {
      const panels_data = this.attributes.panels?.value || '[]';
      const panels_to_include = panelsToIncludeFrom(panels_data);
      const content = this.shadowRoot.querySelector('.content');
      const start_closed = window.innerWidth < 600;
      let content_string = '';
      for (const panel_to_include of panels_to_include) {
        const json_data = await fetchJson(`${panel_to_include}/${panel_to_include}.json`);
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
