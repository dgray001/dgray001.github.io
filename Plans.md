v0.8n: Hamburger working
 p: Verify all styling
  - Ensure works for 50% - 150% scaling
  - Verify mobile styles for all pages (except admin dashboard)
  - Add little highlight css when navigating to page section
  - Fix checkbox styling when multiline
 q-z: Base admin page
  - laywitness add / edit / delete
  - news add / edit / delete
  - papers add / edit / delete
  - jobs add / edit / delete
  - chapters add / edit / delete => chapters changed in page
  - involvement data add / edit / delete => ?? is news just part of it ??
  - faith facts add / edit / delete

P1 Needs:
 - Config and users table in prod (verify paths)

Plans:
 - All places where it says 'please report this bug' the 'report this bug' text is a link
    => clicking will open send email thing to webadmin@cuf.org (don't want button since then bots can spam it)

 - check-auth@verifier.port25.com to check spam report
    => Maybe remove HTML from it as that can do it
    => Ensure all headers are set properly

 - Add ability to link to any section title by name

 - Add / edit / delete faith facts in admin dashboard
 - When clicking faith fact category it should show a loading icon or something and disable clicking other categories
 - Every custom component needs to extend CufHtmlElement which has a flag for when it is fully parsed
 - Have someone break website
 - Harden site by not relying on cookies for login (return login info when you login and save it alternatively)

Bugs:
 - Chrome still has horizontal scrolling on all pages (grr!)
 - Have display version of country returned
   => Implement setFormData() and getDisplayableData() for all classes that extend FormField

Admin Dashboard:
 - Changelog on server including time stamps and who changed it
 - Don't upload position paper if it already exists
 - Faith facts via dashboard (also faith facts in db with pdfs)

Form Fields:
 - Country is autofilled from IP address (use an API) but again can be changed
 - Phone number custom form field
 - Country can modify phone number and state/province fields

Content Cards:
 - For news and position papers: only show 3 and expand to see more (3 more at a time)

Faith Facts:
 - Have faith facts either on separate page or fix embedded links
 - Category list button needs to remove ripple if page unfocused

Pages:
 - Add meta descriptions up to 270 characters (verify?)
 - ID tags for scrolling on all section-titles / section-subtitles
 - Leadership + staff info
 - Eventually can dynamically load section titles / subtitles into left side panel for navigation
 - Use <article> / <section> / <aside> tags in each page
