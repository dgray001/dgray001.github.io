// reCaptcha public site key (test key for dev/staging, live key for prod)
export const public_recaptcha_site_key =
  DEV || STAGING
    ? '6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1'
    : '6LcNpAskAAAAAKc6tm_rQ8FpJo-j6ftEVaWPu8Gk';
