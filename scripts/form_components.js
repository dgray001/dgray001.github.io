export {};

const {version} = await import(`./version.js?v=${Date.now()}`);

await import(`../__components/model/text_area/text_area.js?v=${version}`);

await import(`../__components/model/form_sections/form_section_name/form_section_name.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_address/form_section_address.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_contact/form_section_contact.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_membership_request/form_section_membership_request.js?v=${version}`);

await import(`../__components/model/form_sections/form_section_laywitness/form_section_laywitness.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_paper/form_section_paper.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_news/form_section_news.js?v=${version}`);
await import(`../__components/model/form_sections/form_section_job/form_section_job.js?v=${version}`);