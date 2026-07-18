import os
import re

dir_path = 'resources/js/Pages'

for filename in os.listdir(dir_path):
    if not filename.endswith('.tsx'):
        continue
    
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove all tanstack router imports entirely
    content = re.sub(r'import\s+{[^}]*}\s+from\s+["\']@tanstack/react-router["\'];\n?', '', content)
    
    # If the file uses Link, add Inertia Link
    if '<Link' in content:
        content = 'import { Link } from "@inertiajs/react";\n' + content
        content = re.sub(r'<Link\s+to=', r'<Link href=', content)
        content = re.sub(r'<Link\s+to\s*=\s*{([^}]+)}', r'<Link href={\1}', content)
    
    # If the file uses useNavigate, we can replace it with router from Inertia, but typically we need to just replace it with Inertia.visit
    # But for Login.tsx, we can just replace useNavigate with router
    if 'useNavigate' in content or 'navigate(' in content:
        content = 'import { router } from "@inertiajs/react";\n' + content
        content = re.sub(r'const\s+navigate\s*=\s*useNavigate\(\);', '', content)
        content = re.sub(r'void\s+navigate\(\{.*to:\s*([^}]+)\}\);', r'router.visit(\1);', content)
        content = re.sub(r'navigate\(\{.*to:\s*([^}]+)\}\);', r'router.visit(\1);', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
        
print("Cleanup done.")
