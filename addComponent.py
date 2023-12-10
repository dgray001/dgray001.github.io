import os
import string

def addCufComponent():
  name = input('New component name: ').lower().replace(' ', '_')
  filename = name.split('/')[-1]
  html_class_name = filename.replace('_', '-')
  ts_class_name = string.capwords(filename.replace('_', ' ')).replace(' ', '')
  folder_depth_string = '../' * len(name.split('/'))
  folder_string = f'src/components/{name}'
  newdir = os.path.join(os.path.dirname(__file__), folder_string)

  if os.path.exists(newdir):
      print(f'A component with name {name} already exists')
      quit()
  print(f'\nCreating new component with name {name}')

  os.mkdir(newdir)

  f = open(os.path.join(newdir, f'{filename}.html'), 'w')
  f.write(f'<div id="example">Hello from {html_class_name}!</div>\n')
  f.close()

  f = open(os.path.join(newdir, f'{filename}.ts'), 'w')
  f.write(f"import {{CufElement}} from '{folder_depth_string}cuf_element';\n")
  f.write('\n')
  f.write(f"import html from './{filename}.html';\n")
  f.write('\n')
  f.write(f"import './{filename}.scss';\n")
  f.write('\n')
  f.write(f'export class Cuf{ts_class_name} extends CufElement {{\n')
  f.write('  private example: HTMLDivElement;\n')
  f.write('\n')
  f.write('  constructor() {\n')
  f.write('    super();\n')
  f.write('    this.htmlString = html;\n')
  f.write("    this.configureElement('example');\n")
  f.write('  }\n')
  f.write('\n')
  f.write('  protected override parsedCallback(): void {\n')
  f.write(f"    console.log('Cuf{ts_class_name} parsed!');\n")
  f.write('  }\n')
  f.write('}\n')
  f.write('\n')
  f.write(f"customElements.define('cuf-{html_class_name}', Cuf{ts_class_name});\n")
  f.write('\n')
  f.write('declare global {\n')
  f.write('  interface HTMLElementTagNameMap {\n')
  f.write(f"    'cuf-{html_class_name}': Cuf{ts_class_name};\n")
  f.write('  }\n')
  f.write('}\n')
  f.close()

  f = open(os.path.join(newdir, f'{filename}.scss'), 'w')
  f.close()


def addNewPage():
  print('not implemented')


i = input('CLI to add a new component to the frontend:\n\n  1. CufElement component\n  2. New page\n\n  > ')
print('')
if i == '1':
  addCufComponent()
elif i == '2':
  addNewPage()
else:
  print('Unrecognized command')
