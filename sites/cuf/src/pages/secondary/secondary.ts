// styles
import './secondary.scss';

// html
import html from './secondary.html';

// dependencies
import '../../components/secondary/secondary_page/secondary_page';
import '../../components/common/footer/footer';

// initialize
import { initializePage } from '@core/scripts/page_init';
initializePage(html);

// permission
import { loggedInSync } from '@core/scripts/session';
import { getPage, navigate } from '@core/scripts/url';
import { trim } from '@core/scripts/util';

const page = trim(getPage(), '/');
if (['profile'].includes(page) && !loggedInSync()) {
  navigate(`/login?redirect=${page}`);
}
