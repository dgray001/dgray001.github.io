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
      shadow.querySelector('.subtitle').innerHTML = this.json_data['category_display']
      const category_data = this.json_data['faith_facts'];
      const faith_fact_list = shadow.querySelector('.faith-fact-list');
      for (const faith_fact of category_data) {
        const faith_fact_div = document.createElement('div');
        const title = document.createElement('button');
        title.classList.add('title');
        title.innerText = faith_fact['title'].toUpperCase();
        faith_fact_div.appendChild(title);
        const content = document.createElement('div');
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
