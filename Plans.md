v1.1.1: Add mass send email api
 - Faith facts in admin dashboard

Questions:
 - Should we add chapters to chapters sidebar?
 - How should sidebars handle scrolling? Show all the papers in scroll? Or just some with button?
 - Do you need to be able to add/edit/delete the faith fact categories themselves
 - Which permissions should the employee role have?

Plans:
 - All places where it says 'please report this bug' the 'report this bug' text is a link to email webadmin@cuf.org
 - Add ability to link to any section title by name
 - Harden site by not relying on cookies for login (return login info when you login and save it alternatively)

Bugs:

Admin Dashboard:
 - Changelog on server including time stamps and who changed it
 - Don't upload position paper if it already exists

Content Cards:
 - For news and position papers: only show 3 and expand to see more (3 more at a time)

Faith Facts:
 - Category list button needs to remove ripple if page unfocused

Pages:
 - Add meta descriptions up to 270 characters (verify?)
 - ID tags for scrolling on all section-titles / section-subtitles
 - Eventually can dynamically load section titles / subtitles into left side panel for navigation
 - Use <article> / <section> / <aside> tags in each page
