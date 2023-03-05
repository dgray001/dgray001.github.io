// @ts-check

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {DEV} = await import(`/scripts/util.js?v=${version}`);

/**
 * This function fetches and returns the input json using version control
 * @param {string} path relative path to json (from __data folder)
 */
export async function fetchJson(path) {
  const data_control_res = await fetch(`/__data/data_control.json?v=${Date.now()}`);
  const data_control = await data_control_res.json();
  let timestamp = '';
  if (data_control[path]) {
    timestamp = data_control[path];
  }
  else if (!DEV) {
    data_control[path] = '';
    const post_response = await fetch('/server/data_control.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data_control),
    });
    const post_response_json = await post_response.json();
    if (!post_response_json || !post_response_json['success']) {
      throw new Error('Posting to data_control.php failed.');
    }
  }
  const json_response = await fetch(`/__data/${path}?v=${timestamp}`);
  return json_response.json();
}
