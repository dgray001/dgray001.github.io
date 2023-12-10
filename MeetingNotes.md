



2023 03 24

Discussion:
 - Logo on all pages (should it shrink like it did before?)



2023 03 17

Demo:
 - Staging site finished
 - Activate account, profile page, reset password, forgot password

Discussion:
 - Can launch?



2023 03 06

Demo:
 - Admin dashboard fully functional
 - Staging site fully functional

Discussion:
 - Can launch?
 - User login:
   => Need to export users table of MS Access db
   => Need to standardize how we are going to edit said users table (now we have 2 sources of truth)
   => Can associates even make an account on website? What's the purpose of it?
   => Can members even make an account? Or do we add the user row and they just activate it?
   => I will need all the faith_fact pdfs



2023 02 25

Demo:
 - Login / logout system (with roles / permissions)
 - Admin dashboard (Lay Witness, News, Position Papers)
 - Lay Witness page
 - Faith fact styling
 - Mobile navigation / styling
 - Testing module (incomplete and flaky right now)

Discussion Points:
 - Faith fact styling (good for now)
 - Footer alignment => maybe left align elements ? (good)
 - Will create db of faith facts + way to add / edit faith facts on dashboard
 - Launch on March 11th still ? What exactly needs to be done?
     => Finish mobile styling (esp on homepage)
     => Faith fact descriptions
     => Updated page contents
     => Images (logo + homepage images)
     => Edit laywitness (admin dashboard)
     => Add / updating faith fact (admin dashboard)
     => Add / update jobs available (admin dashboard)
     => Job opening page (for all positions email admin assistant)
     => Staging instance on lnz.cuf.fyi for testing
     => authorize.net api creds

meet morning of march 6th (or afternoon of 7th)



2023 02 03
p0:
 - homepage:
    - title much bigger (~28)
    - mission statement ~1/2 italics / quotes
    - links ~2/3
    - content cards a little shorter
    - center footer
    - FAITH_FACTS a little smaller font and "Faith Facts"

 - Title and navigation font larger
    - title ~10 pixels when width is 1635px
 - subtitle in quotes / italics

 center address / contact info centered to actual content (contact under address)
 sitemap centered to left sidebar

recaptcha legal notice above copyright

p1:
 - position papers
 - login / initial admin dashboard
    - permission system

Dad:
 - pictures
 - summary / dates position papers
 - faith facts summaries
 - content of pages (can include images)

Demo for next time:
 - Donate page works
 - Form field style
 - Form validation

Mock for next time:
 - New header + navigation
 - Mobile friendly styling / navigation
 - Left panel navigation for articles (section title / subtitle)
 - Position papers ~> articles (with Stebbins article + all newsletter articles searchable)
 - Mention there is an api for customer profile, which is what we need for recurring donation
    => this isn't very feasible until we have user profile

Points for next time:
 - Position papers should be renamed => "articles" or "articles and opinions"
   => should include other articles like the one about Stebbins
   => should have text content (downloadable pdf as well? not necessary with newsletter content card?)
 - Newsletter content card?
 - Go through user stories and assign priority
 - Job openings page?
 - Donate receipt page?
 - Do we want navigation to open subheaders to navigate to embedded links?
 - Email address for footer?
 - Website favicon? Also need high-res logo image

Outstanding from last meeting:
 Followup email:
  1. Contact form receipt message indicating length before a response will happen
  2. Donate receipt email
  3. Contact form receipt email ?
  4. Validation in forms, which fields required?
  5. Current staff + information on job openings
  6. Position papers from newsletters?
  7. My cuf.org email
  8. Broken links to CUF chapter websites
  9. Footer message regarding CUF's non-profit status

 My tasks:
  - Implement donate page h osted form + receipt page
  - Reorganize home page + header
  - Form validation + formatting
  - Implement mobile-friendly CSS + navigation pane

 Other:
  - Need reorganization / update of content for all pages





2023 01 20

My issues with the current navigation:
1. Links page is on homepage but nowhere else to be found
  - Can put in footer? In header? In header dropdown?
2. Faith facts inside information services but what if user doesn't know?
3. No donate page on homepage (I can add in header or replace links page)

Which donate paradigm?
1. Hosted form on authorize.net =>>
2. Hosted form via iframe
3. User enters credit card info on site

How should the contact form work?
1. Send email with all info to a cuf email address?
2. Should address really be required if they don't want to join? They don't need an address to call 1-800-MY-FAITH just a name
   => I can make address required if they check any of the boxes

I need a cuf email address

Newsletter content card on every page? Or just position papers... or both?

Broken CUF chapter links should be removed?

Something in footer about CUF non-profit status? Or at least at donate page...

Questions:
 - How many contact form submissions do we get per day/week?
 - How long before we respond to these requests? Do we ever do this via email (even as a receipt of submission?)
 - With donate page do we have a receipt of donation for it sent to donator?
 - Is there really no way to donate / contact CUF anonymously (besides faking data)?
 - The contact form requets should go to administrativeassistant@cuf.org correct?
 - Do we have any control over faith and life series / will we edit it at all?

Stuff I need from you:
 - Where are all newsletters on current site?
 - Updated staff => including job openings (job page P1 or P2)
 - Updated news / position papers
    => When you visit a conference or something you can send me info on it + a picture and I can upload it
    => Position papers can be gleaned from newsletters but I still want those separate pdfs
 - Updated list of links to other apostolates / etc... maybe some explanation (which I can provide?)

Stuff I need to do:
 - Implement chosen donate page design
 - Implement contact form sending email
 - Implement chosen navigation design
 - Add newsletter content card
 - Update styling on forms
 - Update information (newsletters / staff / position papers / news / links) as I receive the updated information
 - Remove / update broken links
 - Fix homepage for mobile devices (almost good)
 - Add article from Stebbins somehow (in history?)

Next meeting agenda:
 - Demo navigation / finished donate page / contact form (how to demo contact form email?)
 - Navigate through site to reorganize / refocus content

During-meeting notes:
font-style: tnr
main headings: 28px
subheadings: 20px (section titles)
header: 20px

fixed header: title of the page + navigation
unfixed header: CUF + mission statement
logo: on left sidebar always

no green or blue => header closer to body

