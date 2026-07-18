import os
import re

dir_path = 'resources/js/Pages'

for filename in os.listdir(dir_path):
    if not filename.endswith('.tsx'):
        continue
    
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We will search for any lines that have '=> ({ meta: ' or 'head: () =>' and 'component: ' and remove them
    # Because of the nested braces, it's easier to just strip anything from "export const Route = createFileRoute" up to "});"
    # Wait, they were already partially stripped. Let's look for "=> ({ meta:" and "component: "
    content = re.sub(r'^\s*head:\s*\(\)\s*=>.*?\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*=>\s*\(\{\s*meta:.*?\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*component:\s*[\w]+,\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*}\);\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*beforeLoad:.*?},\n', '', content, flags=re.MULTILINE|re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)
        
print("Cleanup 2 done.")
