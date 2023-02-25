class CufAdminDashboardJobs extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({mode: 'closed'});
    const res = await fetch('./__components/admin_dashboard/admin_dashboard_jobs/admin_dashboard_jobs.html');
    shadow.innerHTML = await res.text();
  }
}

customElements.define("cuf-admin-dashboard-jobs", CufAdminDashboardJobs);
