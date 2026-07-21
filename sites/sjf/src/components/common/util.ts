/** Converts page url to readable title */
export function pageToName(page: string): string {
  switch (page) {
    case 'about':
      return 'About Us';
    case 'christifidelis':
      return 'Christifidelis';
    case 'articles_opinions':
      return 'Articles, Opinions';
    case 'priests':
      return 'Priests';
    case 'parishes':
      return 'Parishes and Churches';
    case 'news':
      return 'News';
    case 'contact':
      return 'Contact';
    case 'donate':
      return 'Donate';
    case 'login':
      return 'Log In';
    default:
      console.error(`Uknown page: ${page}`);
      return '';
  }
}

/** Returns title text based on current environment */
export function titleText(): string {
  if (DEV) {
    return '|-SJF DEVELOPMENT SITE-|';
  } else if (STAGING) {
    return '|---SJF STAGING SITE---|';
  } else {
    return 'The St. Joseph Foundation';
  }
}

/** Returns mission statement text shown in the banner */
export function missionText(): string {
  return 'Assisting the faithful in vindicating their rights under Catholic Canon Law';
}
