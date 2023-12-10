import {DEV, STAGING} from './util';

// reCaptcha public site key
export const public_recaptcha_site_key = (DEV || STAGING) ?
  '6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1' :
  '6LcNpAskAAAAAKc6tm_rQ8FpJo-j6ftEVaWPu8Gk';
