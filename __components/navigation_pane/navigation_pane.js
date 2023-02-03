export class CufNavigationPane extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/navigation_pane/navigation_pane.html');
    shadow.innerHTML = await res.text();
    const current_path = window.location.pathname;
    const wrapper = shadow.querySelector('.wrapper');
    wrapper.style.setProperty('--button-height', `${wrapper.offsetHeight}`);
    this.setEventListener(shadow.querySelector('#about'), '/about', current_path);
    this.setEventListener(shadow.querySelector('#involvement'), '/involvement', current_path);
    const apostolic_activities = shadow.querySelector('#apostolic_activities');
    apostolic_activities.disabled = true;
    const apostolic_activities_dropdown = shadow.querySelector('#apostolic_activities_dropdown');
    apostolic_activities_dropdown.addEventListener('mouseenter', () =>
      this.headerMouseOver(apostolic_activities_dropdown, apostolic_activities));
    apostolic_activities_dropdown.addEventListener('mouseleave', () =>
      this.headerMouseLeave(apostolic_activities_dropdown, apostolic_activities));
    this.setEventListener(shadow.querySelector('#information_services'), '/information_services', current_path);
    this.setEventListener(shadow.querySelector('#lay_witness'), '/lay_witness', current_path);
    this.setEventListener(shadow.querySelector('#faith_and_life_series'), '/faith_and_life_series', current_path);
    this.setEventListener(shadow.querySelector('#links'), '/links', current_path);
    this.setEventListener(shadow.querySelector('#contact'), '/contact', current_path);
    this.setEventListener(shadow.querySelector('#donate'), '/donate', current_path);
  }

  headerMouseOver(wrapper, header) {
    header.setAttribute('style', 'box-shadow: inset 0 calc(var(--fixed-header-height)) 0 0 var(--navigation-hover-color);');
    wrapper.setAttribute('style', 'height: 400%');
    for (const child of wrapper.getElementsByClassName('dropdown-element')) {
      child.setAttribute('style', 'display: inline-block;');
    }
  }

  headerMouseLeave(wrapper, header) {
    header.setAttribute('style', 'box-shadow: inset 0 0 0 0 var(--navigation-hover-color);');
    wrapper.setAttribute('style', 'height: 100%');
    for (const child of wrapper.getElementsByClassName('dropdown-element')) {
      child.setAttribute('style', 'display: none;');
    }
  }

  setEventListener(element, path, current_path) {
    if (path == current_path) {
      element.disabled = true;
      element.classList.add('current-element');
    }
    else {
      element.addEventListener('click', () => {
        this.navigateTo('.' + path);
      })
    }
  }

  navigateTo(path) {
    console.log(path);
    window.location = path;
  }
}

customElements.define("cuf-navigation-pane", CufNavigationPane);