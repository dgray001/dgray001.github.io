class CufAdminDashboardPapers extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/admin_dashboard/admin_dashboard_papers/admin_dashboard_papers.html');
    shadow.innerHTML = await res.text();
  }
}

customElements.define("cuf-admin-dashboard-papers", CufAdminDashboardPapers);
