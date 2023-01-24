class PageLink {
  page_url = '';
  page_name = '';
  constructor(page_url) {
    this.page_url = page_url;
    switch(page_url) {
      case 'home':
      case '':
        this.page_url = '';
        this.page_name = 'Home';
        break;
      case 'about':
        this.page_name = 'About CUF';
        break;
      case 'contact':
        this.page_name = 'Contact Us';
        break;
      case 'donate':
        this.page_name = 'Donate';
        break;
      case 'faith_and_life_series':
        this.page_name = 'Faith and Life Series';
        break;
      case 'information_services':
        this.page_name = 'Information Services';
        break;
      case 'faith_facts':
        this.page_name = 'FAITH FACTS';
        break;
      case 'involvement':
        this.page_name = 'Involvement';
        break;
      case 'lay_witness':
        this.page_name = 'Lay Witness';
        break;
      case 'links':
        this.page_name = 'Links';
        break;
      default:
        throw new Error('Page not found: ' + page_url);
    }
  }
}

const LeftPanelLinks = [
  new PageLink('about'),
  new PageLink('involvement'),
  new PageLink('links'),
  new PageLink('contact'),
  new PageLink('donate')];
const RightPanelLinks = [
  new PageLink('information_services'),
  new PageLink('faith_facts'),
  new PageLink('lay_witness'),
  new PageLink('faith_and_life_series')];

function loadPage() {
  let leftPanelString = '<div class="panel-list">';
  for (const i of LeftPanelLinks) {
    leftPanelString += `<div class="left-panel list-element" id="${i.page_url}"><a href="${i.page_url}">${i.page_name}</a></div>`;
  }
  leftPanelString += "</div>";
  document.getElementById("leftPanelLinks").innerHTML = leftPanelString;

  let rightPanelString = '<div class="panel-list"><div class="right-panel list-element right-panel-list-header"><div>Apostolic Activities:</div></div>';
  for (const i of RightPanelLinks) {
    rightPanelString += `<div class="right-panel list-element" id="${i.page_url}"><a href="${i.page_url}">${i.page_name}</a></div>`;
  }
  rightPanelString += "</div>";
  document.getElementById("rightPanelLinks").innerHTML = rightPanelString;
}