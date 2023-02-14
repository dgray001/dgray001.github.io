import {DEV} from "./util.js";

// reCaptcha public site key
export const public_recaptcha_site_key = DEV ?
  '6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1' :
  '6LcNpAskAAAAAKc6tm_rQ8FpJo-j6ftEVaWPu8Gk';

/**
 * Frontend recaptcha api returning whether the token is valid
 * @param {string} token
 * @return {Promise<boolean>} recaptcha validation
 * @todo for reCaptcha values close to failure add manual check (is this needed?)
 */
export async function verifyRecaptcha(token) {
  try {
    const response = await fetch('/server/recaptcha.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token),
    });
    const response_json = await response.json();
    return !!response_json['success'];
  } catch(error) {
    console.log(error);
  }
  return false;
}
