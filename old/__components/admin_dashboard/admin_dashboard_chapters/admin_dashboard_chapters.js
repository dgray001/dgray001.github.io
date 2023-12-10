// @ts-nocheck
const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {CufFormSectionChapter} = await import(`../../model/form_sections/form_section_chapter/form_section_chapter.js?v=${version}`);
const {CufAdminDashboardSection} = await import(`../admin_dashboard_section.js?v=${version}`);

export class CufAdminDashboardChapters extends CufAdminDashboardSection {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.setHTML('admin_dashboard_chapters', 'CUF Chapters');
  }
}

customElements.define("cuf-admin-dashboard-chapters", CufAdminDashboardChapters);
