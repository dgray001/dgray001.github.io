// styles
import './home.scss';

// html
import html from './home.html';

// dependencies
import '../../components/home/homepage/homepage';
import '../../components/common/footer/footer';

// initialize
import { initializePage } from '@core/scripts/page_init';
initializePage(html);
