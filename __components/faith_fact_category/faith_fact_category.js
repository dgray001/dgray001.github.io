class CufFaithFactCategory extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const category_name = this.attributes.category?.value || '';
        const shadow = this.attachShadow({mode: 'open'});
        const res = await fetch('./__components/faith_fact_category/faith_fact_category.html');
        shadow.innerHTML = await res.text();
        const response = await fetch('./__data/faith_facts/faith_facts.json');
        const json_data = await response.json();
        let category_data = [];
        for (const category of json_data['faith_fact_categories']) {
            if (category['category'] === category_name) {
                this.shadowRoot.querySelector('.subtitle').innerHTML = category['category_display']
                category_data = category['faith_facts'];
                break;
            }
        }
        let faith_facts = '';
        for (const faith_fact of category_data) {
            faith_facts += `<div class="faith-fact">
                <div class="faith-fact-title">
                    ${faith_fact['title']}
                </div>
                <div class="faith-fact-question">
                    ${faith_fact['question']}
                </div>
                <div class="faith-fact-summary">
                    ${faith_fact['summary']}
                </div>
            </div>`;
        }
        this.shadowRoot.querySelector('.faith-fact-list').innerHTML = faith_facts;
    }
}

customElements.define("cuf-faith-fact-category", CufFaithFactCategory);
