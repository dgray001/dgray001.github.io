// @ts-check
'use strict';
export {};

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {until} = await import(`/scripts/util.js?v=${version}`);

const styles = document.createElement('link');
styles.setAttribute('rel', 'stylesheet');
styles.setAttribute('href', `./styles.css?v=${version}`);
document.head.appendChild(styles);

const stylesheet = document.createElement('link');
stylesheet.setAttribute('rel', 'stylesheet');
stylesheet.setAttribute('href', `./lay_witness/lay_witness.css?v=${version}`);
document.head.appendChild(stylesheet);

const logo = document.createElement('link');
logo.setAttribute('rel', 'icon');
logo.setAttribute('type', 'image/png');
logo.setAttribute('href', `/__images/logo_square.png?v=${version}`);
document.head.appendChild(logo);

const recaptcha = document.createElement('script');
recaptcha.setAttribute('src', 'https://www.google.com/recaptcha/api.js');
document.head.appendChild(recaptcha);

await import(`/scripts/page_layout_components.js?v=${version}`);
const {onInit} = await import(`./lay_witness.js?v=${version}`);
await until(() => document.readyState === 'complete');
onInit();
