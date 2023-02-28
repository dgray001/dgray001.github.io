// @ts-check
'use strict';
export {};

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);

const stylesheet = document.createElement('link');
stylesheet.setAttribute('rel', 'stylesheet');
stylesheet.setAttribute('href', `/login/login.css?v=${version}`);
document.head.appendChild(stylesheet);

const logo = document.createElement('link');
logo.setAttribute('rel', 'icon');
logo.setAttribute('type', 'image/png');
logo.setAttribute('href', `/__images/logo_square.png?v=${version}`);
document.head.appendChild(logo);

await import(`./login.js?v=${version}`);
await import(`/scripts/page_layout_components.js?v=${version}`);
await import(`/scripts/form_components.js?v=${version}`);