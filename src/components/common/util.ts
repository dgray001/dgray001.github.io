import {DEV, STAGING} from '../../scripts/util';

/** Converts page url to readable title */
export function pageToName(page: string): string {
  switch(page) {
    case 'about':
      return 'About CUF';
    case 'apostolic_activities':
      return 'Apostolic Activities';
    case 'contact':
      return 'Contact';
    case 'donate':
      return 'Donate';
    case 'donate/receipt':
      return 'Thank You';
    case 'faith_and_life_series':
      return 'Faith and Life Series';
    case 'faith_and_life_series':
      return 'Jobs Available';
    case 'information_services':
      return 'Information Services';
    case 'involvement':
      return 'Involvement';
    case 'lay_witness':
      return 'Lay Witness';
    case 'links':
      return 'Links';
    case 'login':
      return 'Login';
    case 'login/activate':
      return 'Activate Account';
    case 'login/reset_password':
      return 'Reset Password';
    case 'news':
      return 'CUF News';
    case 'position_papers':
      return 'Position Papers';
    case 'profile':
      return 'Profile';
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
