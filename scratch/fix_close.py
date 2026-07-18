import os
import re

dir_path = 'resources/js/Pages'

for filename in os.listdir(dir_path):
    if not filename.endswith('.tsx'):
        continue
    
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace `\n            close();` with `\n            });\n            close();`
    # But only if it is missing `});` before it. We can just look for `,\n            close();` and replace it.
    
    # Let's do a regex replacement: if close() is preceded by something other than `}` or `;`
    # actually, since it was stripped, it's preceded by `,`
    content = re.sub(r',\n(\s*close\(\);)', r',\n            });\n\1', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
        
print("Fixed close();")
