export class CufNavigationPane extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/navigation_pane/navigation_pane.html');
    shadow.innerHTML = await res.text();
    const about = shadow.querySelector('#about');
    about.addEventListener('click', () => {
      this.navigateTo('./about');
    });
    const involvement = shadow.querySelector('#involvement');
    involvement.addEventListener('click', () => {
      this.navigateTo('./involvement');
    });
    const apostolic_activities = shadow.querySelector('#apostolic_activities');
    apostolic_activities.disabled = true;
    const apostolic_activities_dropdown = shadow.querySelector('#apostolic_activities_dropdown');
    apostolic_activities_dropdown.addEventListener('mouseover', (e) => {
      apostolic_activities.setAttribute('style', 'box-shadow: inset 0 calc(2 * var(--fixed-header-height)) 0 0 var(--margin-color);');
      apostolic_activities_dropdown.setAttribute('style', 'height: 400%');
      for (const child of apostolic_activities_dropdown.getElementsByClassName('dropdown-element')) {
        child.setAttribute('style', 'display: block;');
      }
    })
    apostolic_activities_dropdown.addEventListener('mouseleave', (e) => {
      apostolic_activities.setAttribute('style', 'box-shadow: inset 0 0 0 0 var(--margin-color);');
      apostolic_activities_dropdown.setAttribute('style', 'height: 100%');
      for (const child of apostolic_activities_dropdown.getElementsByClassName('dropdown-element')) {
        child.setAttribute('style', 'display: none;');
      }
    })
    const information_services = shadow.querySelector('#information_services');
    information_services.addEventListener('click', () => {
      this.navigateTo('./information_services');
    });
    const lay_witness = shadow.querySelector('#lay_witness');
    lay_witness.addEventListener('click', () => {
      this.navigateTo('./lay_witness');
    });
    const faith_and_life_series = shadow.querySelector('#faith_and_life_series');
    faith_and_life_series.addEventListener('click', () => {
      this.navigateTo('./faith_and_life_series');
    });
    const contact = shadow.querySelector('#contact');
    contact.addEventListener('click', () => {
      this.navigateTo('./contact');
    });
    const donate = shadow.querySelector('#donate');
    donate.addEventListener('click', () => {
      this.navigateTo('./donate');
    });
  }

  navigateTo(path) {
    console.log(path);
    window.location = path;
  }
}

customElements.define("cuf-navigation-pane", CufNavigationPane);