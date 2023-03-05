// @ts-check
'use strict';
export {};

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);

const stylesheet = document.createElement('link');
stylesheet.setAttribute('rel', 'stylesheet');
stylesheet.setAttribute('href', `./profile/verify_email/verify_email.css?v=${version}`);
document.head.appendChild(stylesheet);

const logo = document.createElement('link');
logo.setAttribute('rel', 'icon');
logo.setAttribute('type', 'image/png');
logo.setAttribute('href', `/__images/logo_square.png?v=${version}`);
document.head.appendChild(logo);

await import(`/scripts/page_layout_components.js?v=${version}`);
await import(`./verify_email.js?v=${version}`);
