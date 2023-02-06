window.onload = async () => {
  const response = await fetch('./__data/lay_witness/lay_witness.json');
  const json_data = await response.json();
  const newsletter_list = document.getElementById('newsletter-list');
  for (const volume of json_data['volumes']) {
    const volume_element = document.createElement('div');
    volume_element.classList.add('section-content');
    volume_element.id = `volume-${volume['number']}`;
    const paragraph_element = document.createElement('p');
    const volume_title = document.createElement('strong');
    volume_title.innerText = `Vol. ${volume['number']} (${volume['year']})`;
    paragraph_element.appendChild(volume_title);
    const issues = document.createElement('ul');
    issues.classList.add('no-list-style');
    issues.role = 'list';
    for (const issue of volume['issues']) {
      const issue_element = document.createElement('li');
      const issue_link = document.createElement('a');
      issue_link.innerText = `Issue ${issue['number']} — ${issue['title']}`;
      issue_link.target = '_blank';
      issue_link.href = `./__data/lay_witness/${volume['number']}/` +
        `${volume['number']}.${issue['number']}-Lay-Witness`;
      if (issue['addendum']) {
        issue_link.href += `-Addendum${issue['addendum']}`;
      }
      else if (issue['insert']) {
        issue_link.href += `-Insert${issue['insert']}`;
        issue_link.innerText = issue['title'];
      }
      issue_link.href += '.pdf';
      issue_element.appendChild(issue_link);
      issues.appendChild(issue_element);
    }
    paragraph_element.appendChild(issues);
    volume_element.appendChild(paragraph_element);
    newsletter_list.appendChild(volume_element);
  }
};