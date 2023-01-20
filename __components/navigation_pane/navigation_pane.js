export class CufNavigationPane extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/navigation_pane/navigation_pane.html');
    shadow.innerHTML = await res.text();
  }
}

customElements.define("cuf-navigation-pane", CufNavigationPane);
