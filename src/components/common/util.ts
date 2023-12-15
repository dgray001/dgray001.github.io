import {DEV, STAGING} from '../../scripts/util';

/** Converts page url to readable title */
export function pageToName(page: string): string {
  switch(page) {
    case 'about':
      return 'About CUF';
    case 'news':
      return 'CUF News';
    case 'contact':
      return 'Contact';
    case 'donate':
      return 'Donate';
    default:
      console.error(`Uknown page: ${page}`);
      return '';
  }
}

/** Returns title text based on current environment */
export function titleText(): string {
  if (DEV) {
    return '|--CUF DEVELOPMENT SITE--|';
  } else if (STAGING) {
    return '|---CUF STAGING SITE---|';
  } else {
    return 'Catholics United for the Faith';
  }
}
