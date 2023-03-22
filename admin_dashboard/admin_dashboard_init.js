// @ts-check
'use strict';
export {};

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {until} = await import(`/scripts/util.js?v=${version}`);
const {public_recaptcha_site_key} = await import(`/scripts/recaptcha.js?v=${version}`);

const styles = document.createElement('link');
styles.setAttribute('rel', 'stylesheet');
styles.setAttribute('href', `./styles.css?v=${version}`);
document.head.appendChild(styles);

const stylesheet = document.createElement('link');
stylesheet.setAttribute('rel', 'stylesheet');
stylesheet.setAttribute('href', `./admin_dashboard/admin_dashboard.css?v=${version}`);
document.head.appendChild(stylesheet);

const logo = document.createElement('link');
logo.setAttribute('rel', 'icon');
logo.setAttribute('type', 'image/png');
logo.setAttribute('href', `/__images/logo_square.png?v=${version}`);
document.head.appendChild(logo);

const recaptcha = document.createElement('script');
recaptcha.setAttribute('src', `https://www.google.com/recaptcha/api.js?render=${public_recaptcha_site_key}`);
document.head.appendChild(recaptcha);

await import(`/scripts/page_layout_components.js?v=${version}`);
await import(`/scripts/form_components.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_laywitness/admin_dashboard_laywitness.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_news/admin_dashboard_news.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_faith_facts/admin_dashboard_faith_facts.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_papers/admin_dashboard_papers.js?v=${version}`);
await import(`/__components/admin_dashboard/admin_dashboard_jobs/admin_dashboard_jobs.js?v=${version}`);
const {onInit} = await import(`./admin_dashboard.js?v=${version}`);
await until(() => document.readyState === 'complete');
onInit();
