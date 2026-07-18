import os
import re

dir_path = 'resources/js/Pages/routes'
out_path = 'resources/js/Pages'

for filename in os.listdir(dir_path):
    if not filename.endswith('.tsx'):
        continue
    
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove createFileRoute
    content = re.sub(r'export const Route = createFileRoute\([^)]+\)\([^)]+\);?', '', content, flags=re.DOTALL)
    
    # Determine new filename
    name_parts = filename.replace('_authenticated.', '').replace('.tsx', '').split('.')
    new_name = ''.join(part.title() for part in name_parts)
    if not new_name or new_name == 'Index' or new_name == 'Root' or new_name == 'Authenticated':
        new_name = filename.replace('.tsx', '').replace('_', '').title()
    
    # We will just write it directly to the new file, then we can manually fix the layouts
    new_filepath = os.path.join(out_path, f"{new_name}.tsx")
    
    # Change export function XXX to export default function XXX
    content = re.sub(r'function (\w+)\(', r'export default function \1(', content)
    
    with open(new_filepath, 'w') as f:
        f.write(content)
        
print("Conversion done.")
