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
            case 'faith_and_life_series':
                this.page_name = 'Faith and Life Series';
                break;
            case 'information_services':
                this.page_name = 'Information Services';
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

const LeftPanelLinks = [new PageLink('about'), new PageLink('involvement'), new PageLink('links'), new PageLink('contact')];
const RightPanelLinks = [new PageLink('information_services'), new PageLink('lay_witness'), new PageLink('faith_and_life_series')];

function loadPage() {
    let leftPanelString = '<div class="panel-list">';
    for (const i of LeftPanelLinks) {
        leftPanelString += `<div class="left-panel list-element"><a href="${i.page_url}">${i.page_name}</a></div>`;
    }
    leftPanelString += "</div>";
    document.getElementById("leftPanelLinks").innerHTML = leftPanelString;

    let rightPanelString = '<div class="panel-list"><div class="right-panel list-element"><div class="right-panel-list-header">Apostolic Activities:</div></div>';
    for (const i of RightPanelLinks) {
        rightPanelString += `<div class="right-panel list-element"><a href="${i.page_url}">${i.page_name}</a></div>`;
    }
    rightPanelString += "</div>";
    document.getElementById("rightPanelLinks").innerHTML = rightPanelString;
}