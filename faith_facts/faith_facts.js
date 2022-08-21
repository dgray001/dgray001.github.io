async function loadPage() {
    const response = await fetch('./__data/faith_facts/faith_facts.json');
    const json_data = await response.json();
    let category_html = '';
    for (const category of json_data['faith_fact_categories']) {
        category_html += `<div class="category-div"><a class="category-link" href="faith_facts/${category['category']}">${category['category_display']}</a></div>`;
    }
    document.getElementById('faith-fact-categories').innerHTML = category_html;
}