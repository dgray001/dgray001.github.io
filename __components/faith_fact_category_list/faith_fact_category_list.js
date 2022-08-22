function createRipple(evt) {
    const button = evt.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${evt.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${evt.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}


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
        for (const category_link of shadow.querySelectorAll('.category-link')) {
            category_link.addEventListener("mousedown", createRipple);
        }
        document.addEventListener("mouseup", this.removeRipples.bind(null, this));
    }

    removeRipples(source) {
        for (const ripple of source.shadowRoot.querySelectorAll('.ripple')) {
            ripple.remove();
        }
    }
}

customElements.define("cuf-faith-fact-category-list", CufFaithFactCategoryList);