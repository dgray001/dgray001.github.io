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
    case 'apostolic_activities':
      return 'Apostolic Activities';
    case 'information_services':
      return 'Information Services';
    case 'lay_witness':
      return 'Lay Witness';
    case 'faith_and_life_series':
      return 'Faith and Life Series';
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
