// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);
const {panelsToIncludeFrom} = await import(`/scripts/datalists.js?v=${version}`);

export class CufFooterPanels extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch(`/__components/footer_panels/footer_panels.html?v=${version}`);
    shadow.innerHTML = await res.text();
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `/__components/footer_panels/footer_panels.css?v=${version}`);
    shadow.appendChild(stylesheet);
    try {
      const panels_data = this.attributes.panels?.value || '[]';
      const panels_to_include = panelsToIncludeFrom(panels_data);
      const content = this.shadowRoot.querySelector('.content');
      let content_string = '';
      const panel_to_image = new Map([
        ['news', 'people_feasting'],
        ['papers', 'keys_to_st_peter'],
        ['prayer', 'annunciation']
      ]);
      for (const panel_to_include of panels_to_include) {
        const json_data = await fetchJson(`${panel_to_include}/${panel_to_include}.json`);
        if (!json_data['content'] || json_data['content'].length === 0) {
          continue;
        }
        content_string += `<span class="content-card"><cuf-content-card
          content_key="${panel_to_include}" collapsible="false"
          start_closed="false" fixed_height="270" card_rotation_image=
          "paintings/${panel_to_image.get(panel_to_include)}.jpg">
          </cuf-content-card></span>`;
      }
      content.innerHTML = content_string;
    } catch(e) {
      throw new Error('Error setting content for panels with data: ' + this.attributes.panels);
    }
  }
}

customElements.define("cuf-footer-panels", CufFooterPanels);
