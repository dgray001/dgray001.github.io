/**
 * Frontend recaptcha api returning whether the token is valid
 * @param {string} token
 * @return {Promise<boolean>} recaptcha validation
 * @todo for ReCaptcha values close to failure add manual check (is this needed?)
 */
async function verifyRecaptcha(token) {
  try {
    const response = await fetch('/server/recaptcha.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token),
    });
    const response_json = await response.json();
    return response_json['success'];
  } catch(error) {
    console.log(error);
  }
  return false;
}
