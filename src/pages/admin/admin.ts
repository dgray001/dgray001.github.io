// styles
import './admin.scss';

// dependencies

// initialize
import {initializePage} from '../common';
initializePage('');

// permission
import {hasPermission} from '../../scripts/session';
import {navigate} from '../../scripts/url';
import {getCookie} from '../../scripts/cookies';

async function checkPermission() {
  if (!hasPermission(getCookie('role'), 'access_site')) {
    navigate('');
  }
}

checkPermission();
