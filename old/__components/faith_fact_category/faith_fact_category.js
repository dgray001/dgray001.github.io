// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);

export class CufFaithFactCategory extends HTMLElement {
    // Callback function from host called when connectedCallback is complete
    callback;
    // Preloaded data if this element has been loaded before
    json_data;

    constructor() {
        super();
    }

    async connectedCallback() {
      const category_name = this.attributes.category?.value || '';
      const shadow = this.attachShadow({mode: 'open'});
      const res = await fetch(`/__components/faith_fact_category/faith_fact_category.html?v=${version}`);
      shadow.innerHTML = await res.text();
      const stylesheet = document.createElement('link');
      stylesheet.setAttribute('rel', 'stylesheet');
      stylesheet.setAttribute('href', `/__components/faith_fact_category/faith_fact_category.css?v=${version}`);
      shadow.appendChild(stylesheet);
      if (!this.json_data) {
        this.json_data = await fetchJson(`faith_facts/${category_name}.json`);
      }
      shadow.querySelector('.subtitle').innerHTML = this.json_data['category_display']
      const category_data = this.json_data['faith_facts'];
      const faith_fact_list = shadow.querySelector('.faith-fact-list');
      for (const faith_fact of category_data) {
        const faith_fact_div = document.createElement('div');
        const title = document.createElement('button');
        title.classList.add('title');
        title.innerHTML = faith_fact['title'].toUpperCase();
        faith_fact_div.appendChild(title);
        const content = document.createElement('div');
        content.classList.add('all-content');
        content.setAttribute('style', 'display: none;');
        const question_html = faith_fact['question'] ?
          `<div class="question">
            <div class="label"><em>Question</em>:</div>
            <div class="content">${faith_fact['question']}</div>
          </div>` : '';
        content.innerHTML = `
          ${question_html}
          <div class="summary">
            <div class="label"><em>Summary</em>:</div>
            <div class="content">${faith_fact['summary']}</div>
          </div>`;
        faith_fact_div.appendChild(content);
        title.addEventListener('click', () => {
          if (content.hasAttribute('style')) {
            content.removeAttribute('style');
            return;
          }
          content.setAttribute('style', 'display: none;');
        });
        faith_fact_div.classList.add('faith-fact');
        faith_fact_list?.appendChild(faith_fact_div);
      }
      if (this.callback) {
        this.callback(this.json_data);
      }
    }
}

customElements.define("cuf-faith-fact-category", CufFaithFactCategory);
