import os
import sys

if len(sys.argv) < 2:
    print('Must specify name of new page')
    quit()

name = (sys.argv[1]).lower()
filename = name.split('/')[-1]
folder_depth_string = "../" * len(name.split('/'))
newdir = os.path.join(os.path.dirname(__file__), name)

if os.path.exists(newdir):
    print(f'A page with name {name} already exists')
    quit()

print(f'creating new page with name {name}')

os.mkdir(newdir)

name_spaced = name.replace("_", " ").title()
keywords = "Catholics, United, Faith, " + name_spaced.replace(' ', ', ')

f = open(os.path.join(newdir, 'index.html'), 'w')
f.write('<!DOCTYPE html>\n')
f.write('<html lang="en">\n')
f.write('<head>\n')
f.write('  <meta charset="UTF-8">\n')
f.write('  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
f.write('  <meta name="description" content="">\n')
f.write(f'  <meta name="keywords" content="{keywords}">\n')
f.write('  <meta name="author" content="Daniel Gray">\n')
f.write(f'  <title>{name_spaced} | CUF</title>\n')
f.write(f'  <base href="{folder_depth_string}">\n')
f.write(f'  <link rel="stylesheet" href="./{name}/{filename}.css">\n')
f.write(f'  <link rel="icon" type="image/png" href="./__images/logo_square.png">\n')
f.write(f'  <script type="text/javascript" src="./{name}/{filename}.js"></script>\n')
f.write('  <script type="module" src="./__components/header/header.js" async></script>\n')
f.write('  <script type="module" src="./__components/footer_contact/footer_contact.js" async></script>\n')
f.write('  <script type="module" src="./__components/sidebar/sidebar.js" async></script>\n')
f.write('  <script type="module" src="./__components/content_card/content_card.js" async></script>\n')
f.write('  <script type="text/javascript" src="./scripts/util.js" async></script>\n')
f.write('  <script src="https://www.google.com/recaptcha/api.js"></script>\n')
f.write('</head>\n')
f.write('<body>\n')
f.write('  <cuf-header></cuf-header>\n')
f.write('  <div class="page-content">\n')
f.write('    <div class="actual-content">\n')
f.write(f'      <div class="test">{name.replace("_", " ").title()} content</div>\n')
f.write('    </div>\n')
f.write('    <cuf-sidebar panels=\'["prayer", "news", "papers"]\'></cuf-sidebar>\n')
f.write('  </div>\n')
f.write('  <cuf-footer-contact></cuf-footer-contact>\n')
f.write('</body>\n')
f.write('</html>')
f.close()

f = open(os.path.join(newdir, f'{filename}.js'), 'w')
f.close()

f = open(os.path.join(newdir, f'{filename}.css'), 'w')
f.write(f'@import "{folder_depth_string}styles.css";')
f.close()