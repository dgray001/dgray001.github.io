class CufFaithFactCategoryList extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const current_category = this.attributes.category?.value || 'none';
        const shadow = this.attachShadow({mode: 'open'});
        const res = await fetch('./__components/faith_fact_category_list/faith_fact_category_list.html');
        shadow.innerHTML = await res.text();
        const response = await fetch('./__data/faith_facts/faith_facts.json');
        const json_data = await response.json();
        let category_html = '';
        for (const category of json_data['faith_fact_categories']) {
            if (category['category'] === current_category) {
                category_html += `<div class="category-link current-category">${category['category_display']}</div>`;
            }
            else {
                category_html += `<div class="category-link" onclick="window.location='faith_facts/${category['category']}'">${category['category_display']}</div>`;
            }
        }
        shadow.querySelector('#faith-fact-categories').innerHTML = category_html;
    }
}

customElements.define("cuf-faith-fact-category-list", CufFaithFactCategoryList);