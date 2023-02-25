// @ts-check
import {CufFormSectionPaper} from "../../model/form_sections/form_section_paper/form_section_paper.js";
import {CufAdminDashboardSection} from "../admin_dashboard_section.js";
import {until} from "../../../scripts/util.js";

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
