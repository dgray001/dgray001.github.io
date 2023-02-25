'use strict';

window.onload = async () => {
  const response = await fetch(`./__data/jobs_available/jobs_available.json`);
  const json_data = await response.json();
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