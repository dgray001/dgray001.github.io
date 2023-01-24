import os
import string
import sys

if len(sys.argv) < 2:
    print('Must specify name of new component')
    quit()

name = (sys.argv[1]).lower()
filename = name.split('/')[-1]
folder_string = f'__components/{name}'
newdir = os.path.join(os.path.dirname(__file__), folder_string)

if os.path.exists(newdir):
    print(f'A component with name {name} already exists')
    quit()

print(f'creating new component with name {name}')

os.mkdir(newdir)

f = open(os.path.join(newdir, f'{filename}.html'), 'w')
f.write(f'<link rel="stylesheet" href="./{folder_string}/{filename}.css">\n')
f.write(f'<div class="{filename.replace("_", "-")}">\n')
f.write('</div>')
f.close()

f = open(os.path.join(newdir, f'{filename}.js'), 'w')
f.write(f'class Cuf{string.capwords(filename.replace("_", " ")).replace(" ", "")} extends HTMLElement {{\n')
f.write('  constructor() {\n')
f.write('    super();\n')
f.write('  }\n')
f.write('\n')
f.write('  async connectedCallback() {\n')
f.write('    const shadow = this.attachShadow({mode: \'closed\'});\n')
f.write(f'    const res = await fetch(\'./{folder_string}/{filename}.html\');\n')
f.write('    shadow.innerHTML = await res.text();\n')
f.write('  }\n')
f.write('}\n')
f.write('\n')
f.write(f'customElements.define("cuf-{filename.replace("_", "-")}", Cuf{string.capwords(filename.replace("_", " ")).replace(" ", "")});\n')
f.close()

f = open(os.path.join(newdir, f'{filename}.css'), 'w')
f.close()