'use strict';
export {};

const {version} = await import(`/scripts/version.js?v=${Date.now()}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);

window.onload = async () => {
  const json_data = await fetchJson(`jobs_available/jobs_available.json`);
  const title = document.getElementById('jobs-title');
  title.innerText = json_data['header'] ?? '';
  let content_list = '';
  let not_first = false;
  for (const content of json_data['content']) {
    if (not_first) {
      content_list += '<hr class="element-spacer">';
    }
    content_list += '<div class="content-element"';
    if (content['title']) {
      content_list += ` class="element-with-title"><div class="element-title">${content['title']}</div`;
    }
    if (content['description']) {
      content_list += `>${content['description']}</div>`
    }
    else {
      content_list += '></div>';
    }
    not_first = true;
  }
  document.getElementById('jobs-section').innerHTML = content_list;
};