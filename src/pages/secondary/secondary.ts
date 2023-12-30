// styles
import './secondary.scss';

// html
import html from './secondary.html';

// dependencies
import '../../components/secondary/secondary_page/secondary_page';

// initialize
import {initializePage} from '../common';
initializePage(html);

// permission
import {loggedInSync} from '../../scripts/session';
import {getPage, navigate} from '../../scripts/url';
import {trim} from '../../scripts/util';

const page = trim(getPage(), '/');
if (['profile'].includes(page) && !loggedInSync()) {
  navigate(`/login?redirect=${page}`);
}
