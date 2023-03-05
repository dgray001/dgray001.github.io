// @ts-check
'use strict';

const {version} = await import(`/scripts/version.js?v=${Math.floor(Date.now() / 86400000)}`);
const {fetchJson} = await import(`/__data/data_control.js?v=${version}`);

export async function onInit() {
  const title = document.getElementById('papers-title');
  const section = document.getElementById('papers-section');
  if (!title || !section) {
    throw new Error('Missing needed elements');
  }

  const json_data = await fetchJson(`papers/papers.json`);
  title.innerText = json_data['header'] ?? '';
  let content_list = '';
  let not_first = false;
  for (const content of json_data['content']) {
    if (not_first) {
      content_list += '<hr class="element-spacer">';
    }
    content_list += '<div class="content-element"';
    if (content['title']) {
      if (content['titlelink']) {
        content_list += ` class="element-with-title"><div class="element-title"><a href="${content['titlelink']}" target="_blank">${content['title']}</a></div`;
      }
      else {
        content_list += ` class="element-with-title"><div class="element-title">${content['title']}</div`;
      }
    }
    if (content['description']) {
      content_list += `>${content['description']}</div>`
    }
    else {
      content_list += '></div>';
    }
    not_first = true;
  }
  section.innerHTML = content_list;
}
