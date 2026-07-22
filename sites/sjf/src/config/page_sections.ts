/** A single admin-editable content area; a page may have one section (covering everything but
 * the header) or several. The section id must match the id used in that page's markup. */
export interface PageSection {
  page: string;
  id: string;
  label: string;
}

/** SJF pages and their editable sections; each page's actual markup must contain a matching id */
export const page_sections: PageSection[] = [
  { page: 'home', id: 'home-content', label: 'Home' },
  { page: 'about', id: 'about-content', label: 'About Us' },
  { page: 'christifidelis', id: 'christifidelis-content', label: 'Christifidelis' },
  { page: 'articles_opinions', id: 'articles-opinions-content', label: 'Articles, Opinions' },
  { page: 'priests', id: 'priests-content', label: 'Priests' },
  { page: 'parishes', id: 'parishes-content', label: 'Parishes and Churches' },
  { page: 'news', id: 'news-content', label: 'News (Main)' },
  { page: 'news', id: 'news-sidebar', label: 'News (Sidebar)' },
  { page: 'contact', id: 'contact-content', label: 'Contact' },
];
