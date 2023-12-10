// Script run by all pages

// global style
import '../styles.scss';

// dependencies
// import '../components/header/header';
// import '../components/footer/footer';

import {public_recaptcha_site_key} from '../scripts/recaptcha';

export function initializePage() {
  const recaptcha = document.createElement('script');
  recaptcha.setAttribute('src',
    `https://www.google.com/recaptcha/api.js?render=${public_recaptcha_site_key}`);
  document.head.appendChild(recaptcha);
}
