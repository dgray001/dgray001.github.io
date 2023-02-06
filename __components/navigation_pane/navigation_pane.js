export class CufNavigationPane extends HTMLElement {
  /**
   * reference to actual form field element
   * @type {boolean}
   */
  hamburger_clicked = false;

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
    this.setEventListener(shadow, 'about', current_path);
    this.setEventListener(shadow, 'involvement', current_path);
    const apostolic_activities = shadow.querySelector('#apostolic_activities');
    apostolic_activities.disabled = true;
    const apostolic_activities_dropdown = shadow.querySelector('#apostolic_activities_dropdown');
    apostolic_activities_dropdown.addEventListener('mouseenter', () =>
      this.headerMouseOver(apostolic_activities_dropdown, apostolic_activities));
    apostolic_activities_dropdown.addEventListener('mouseleave', () =>
      this.headerMouseLeave(apostolic_activities_dropdown, apostolic_activities));
    this.setEventListener(shadow, 'information_services', current_path);
    this.setEventListener(shadow, 'lay_witness', current_path);
    this.setEventListener(shadow, 'faith_and_life_series', current_path);
    this.setEventListener(shadow, 'links', current_path);
    this.setEventListener(shadow, 'contact', current_path);
    this.setEventListener(shadow, 'donate', current_path);
    shadow.querySelector('.hamburger').addEventListener('click', () => {
      if (this.hamburger_clicked) {
        this.closeHamburgerSidebar(shadow);
      }
      else {
        this.openHamburgerSidebar(shadow);
      }
    });
    shadow.querySelector('.background-grayed').addEventListener('click', () => {
      this.closeHamburgerSidebar(shadow);
    });
  }

  openHamburgerSidebar(shadow) {
    this.hamburger_clicked = true;
    shadow.querySelector('.background-grayed').setAttribute('style', 'display: block');
    shadow.querySelector('.hamburger-sidebar').setAttribute('style', 'width: 180px');
    document.body.style.overflow = 'hidden';
  }

  closeHamburgerSidebar(shadow) {
    this.hamburger_clicked = false;
    shadow.querySelector('.background-grayed').setAttribute('style', 'display: none');
    shadow.querySelector('.hamburger-sidebar').setAttribute('style', 'width: 0px');
    document.body.style.overflow = 'auto';
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

  setEventListener(shadow, element_id, current_path) {
    const path = `./${element_id}`;
    const element = shadow.querySelector(`#${element_id}`);
    const hamburger_element = shadow.querySelector(`#hamburger-${element_id}`);
    if (path == current_path) {
      element.disabled = true;
      hamburger_element = true;
      element.classList.add('current-element');
      hamburger_element.classList.add('hamburger-current-element');
    }
    else {
      element.addEventListener('click', () => {
        this.navigateTo(path);
      });
      hamburger_element.addEventListener('click', () => {
        this.navigateTo(path);
      });
    }
  }

  navigateTo(path) {
    window.location = path;
  }
}

customElements.define("cuf-navigation-pane", CufNavigationPane);