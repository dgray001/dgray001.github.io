class CufFaithFactCategoryList extends HTMLElement {
  hovered = false;
  scrolling = false;
  current_category = '';
  loading = false;
  loaded_json_data = new Map();

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    const res = await fetch('./__components/faith_fact_category_list/faith_fact_category_list.html');
    shadow.innerHTML = await res.text();
    const response = await fetch('./__data/faith_facts/faith_facts.json');
    const json_data = await response.json();
    let category_html = '';
    for (const category of json_data['faith_fact_categories']) {
      category_html +=
        `<div class="category-link" id="${category['category']}">` +
          '<div class="ripple-container"></div>' +
          `<div class="title-container" id="${category['category']}">${category['category_display']}</div>` +
        '</div>';
    }
    const category_list = shadow.querySelector('.faith-fact-category-list')
    category_list.innerHTML = category_html;
    for (const category_link of shadow.querySelectorAll('.category-link')) {
      category_link.addEventListener('mousedown', this.createRipple.bind(this));
      category_link.addEventListener('click', this.setCategory.bind(this));
    }
    document.addEventListener('mouseup', this.removeRipples.bind(null, this));
    category_list.addEventListener('mouseover', function() {
      this.hovered = true;
      document.body.style.overflow = 'hidden';
    });
    category_list.addEventListener('mouseout', function() {
      this.hovered = false;
      document.body.style.overflow = 'auto';
    });
    category_list.addEventListener('wheel',//this.scrollCategories.bind(category_list));
      (evt) => {
        evt.preventDefault();
        category_list.scrollLeft += 0.5 * evt.deltaY;
      });
  }

  async setCategory(evt) {
    if (this.loading) {
      return;
    }
    const category = evt.target.id;
    if (category === this.current_category) {
      this.scrollToCategories();
      return;
    }
    this.current_category = category;
    this.loading = true;

    for (const category_link of this.shadowRoot.querySelectorAll('.category-link')) {
      if (category_link.id === category) {
        category_link.classList.add('current-category');
      }
      else {
        category_link.classList.remove('current-category');
      }
    }

    const new_category_element = document.createElement('cuf-faith-fact-category');
    new_category_element.setAttribute('category', category);
    
    const container = this.shadowRoot.querySelector('.category-container');
    const previous_children = [];
    for (const child of container.children) {
      previous_children.push(child);
    }
    if (this.loaded_json_data.has(category)) {
      new_category_element.json_data = this.loaded_json_data[category];
    }
    new_category_element.callback = this.renderChildCallback.bind(this, () => {
      for (const child of previous_children) {
        container.removeChild(child);
      }
    });
    container.appendChild(new_category_element);
  }

  renderChildCallback(remove_previous_child, json_data) {
    if (remove_previous_child) {
      remove_previous_child();
    }
    if (json_data) {
      this.loaded_json_data.set(json_data['category'], json_data);
    }
    this.scrollToCategories();
    this.loading = false;
  }

  scrollToCategories() {
    const elementPosition = this.offsetTop;
    const fixed_header_size = 15 + 2 * Math.max(0.02 * window.innerHeight, 15);
    window.scrollTo({
      top: elementPosition - fixed_header_size,
      behavior: "smooth"
    });
  }
  
  createRipple(evt) {
    if (!evt.which || evt.which !== 1) {
      return;
    }

    const button_wrapper = evt.currentTarget;
    const scroll_element = this.shadowRoot.querySelector('.faith-fact-category-list');
  
    const circle = document.createElement('span');
    const diameter = Math.max(button_wrapper.clientWidth, button_wrapper.clientHeight);
    const radius = diameter / 2.0;
  
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${evt.clientX + scroll_element.scrollLeft - button_wrapper.offsetLeft - radius}px`;
    circle.style.top = `${evt.clientY + window.scrollY - button_wrapper.offsetTop - radius}px`;
    circle.classList.add("ripple");
  
    const ripple_container = button_wrapper.getElementsByClassName("ripple-container")[0];
  
    if (ripple_container) {
      for (const previous_ripple of ripple_container.getElementsByClassName("ripple")) {
        previous_ripple.remove();
      }
      ripple_container.appendChild(circle);
    }
  }

  removeRipples(source) {
    for (const ripple of source.shadowRoot.querySelectorAll('.ripple')) {
      ripple.remove();
    }
  }

  scrollCategories(evt) {
    if (!this.hovered) {
      return;
    }
    
    this.scrollBy({top: 0, left: 3 * evt.deltaY, behavior: 'smooth'});
  }
}

customElements.define("cuf-faith-fact-category-list", CufFaithFactCategoryList);