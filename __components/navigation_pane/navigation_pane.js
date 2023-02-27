import {HTMLBaseElement} from '../model/HTML_base_element.js';
import {until, trim} from '../../scripts/util.js';

export class CufNavigationPane extends HTMLBaseElement {
  /**
   * reference to actual form field element
   * @type {boolean}
   */
  hamburger_clicked = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.setup();
  }

  // This should be called when children (and inner text) available
  async childrenAvailableCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/navigation_pane/navigation_pane.html');
    shadow.innerHTML = await res.text();
    const current_path = window.location.pathname;
    const wrapper = shadow.querySelector('.wrapper');
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
    await until(() => {
      return wrapper && wrapper.offsetHeight > 0;
    });
    const navigation_wrapper = shadow.querySelector('.wrapper');
    wrapper.style.setProperty('--button-height', `${navigation_wrapper.offsetHeight}`);
  }

  openHamburgerSidebar(shadow) {
    this.hamburger_clicked = true;
    shadow.querySelector('.background-grayed').setAttribute('style', 'display: block');
    shadow.querySelector('.hamburger-sidebar').setAttribute('style', 'width: ' +
      'calc(max(180px, min(350px, 35vw)))');
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

  /**
   * @param {ShadowRoot} shadow 
   * @param {string} element_id 
   * @param {string} current_path 
   */
  setEventListener(shadow, element_id, current_path) {
    const path = `./${element_id}`;
    /** @type {HTMLButtonElement|null} */
    const element = shadow.querySelector(`#${element_id}`);
    /** @type {HTMLButtonElement|null} */
    const hamburger_element = shadow.querySelector(`#hamburger-${element_id}`);
    if (!element || !hamburger_element) {
      throw new Error(`Setting event listener on ${element_id} failed; can't find element.`)
    }
    if (element_id === trim(current_path, '/')) {
      element.disabled = true;
      hamburger_element.disabled = true;
      element.classList.add('current-element');
      hamburger_element.classList.add('current-element');
    }
    else {
      element.addEventListener('click', () => {
        this.navigateTo(path);
      });
      element.addEventListener('mousedown', (e) => {
        if (e.button == 1) {
          e.preventDefault();
        }
      });
      element.addEventListener('auxclick', (e) => {
        e.preventDefault();
        if (e.button != 1) {
          return;
        }
        this.openNewTab(path);
      });
      hamburger_element.addEventListener('click', () => {
        this.navigateTo(path);
      });
      hamburger_element.addEventListener('mousedown', (e) => {
        if (e.button == 1) {
          e.preventDefault();
        }
      });
      hamburger_element.addEventListener('auxclick', (e) => {
        e.preventDefault();
        if (e.button != 1) {
          return;
        }
        this.openNewTab(path);
      });
    }
  }

  /**
   * @param {string} path 
   */
  navigateTo(path) {
    window.location = path;
  }

  /**
   * @param {string} path 
   */
  openNewTab(path) {
    window.open(path, '_blank');
  }
}

customElements.define("cuf-navigation-pane", CufNavigationPane);