class CufFaithFactCategory extends HTMLElement {
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
      const res = await fetch('./__components/faith_fact_category/faith_fact_category.html');
      shadow.innerHTML = await res.text();
      if (!this.json_data) {
        const response = await fetch(`./__data/faith_facts/${category_name}.json`);
        this.json_data = await response.json();
      }
      this.shadowRoot.querySelector('.subtitle').innerHTML = this.json_data['category_display']
      const category_data = this.json_data['faith_facts'];
      let faith_facts = '';
      for (const faith_fact of category_data) {
        const question_html = faith_fact['question'] ?
          `<div class="question">
            <div class="label"><em>Question</em>:</div>
            <div class="content">${faith_fact['question']}</div>
          </div>` : '';
        faith_facts += `<div class="faith-fact">
          <div class="title">
            ${faith_fact['title'].toUpperCase()}
          </div>
          ${question_html}
          <div class="summary">
            <div class="label"><em>Summary</em>:</div>
            <div class="content">${faith_fact['summary']}</div>
          </div>
        </div>`;
      }
      this.shadowRoot.querySelector('.faith-fact-list').innerHTML = faith_facts;
      if (this.callback) {
        this.callback(this.json_data);
      }
    }
}

customElements.define("cuf-faith-fact-category", CufFaithFactCategory);
