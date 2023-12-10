// styles
import './admin.scss';

// dependencies

// initialize
import {initializePage} from '../common';
initializePage('');

// permission
import {hasPermission} from '../../scripts/session';
import {navigate} from '../../scripts/url';

async function checkPermission() {
  if (!await hasPermission('access_site')) {
    navigate('');
  }
}

checkPermission();
