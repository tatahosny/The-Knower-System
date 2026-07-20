const fs = require('fs');
const path = require('path');

const srcDir = 'landing front/src/routes';
const destDir = 'resources/js/Pages/Public';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    if (file === '_public.tsx') continue; // We will handle the layout separately

    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');

    // Remove TanStack import
    content = content.replace(/import\s+{\s*createFileRoute\s*}\s+from\s+['"]@tanstack\/react-router['"];?\n?/, '');

    // Extract component name from file name
    // e.g. _public.about.tsx -> About
    // e.g. _public.blog.$slug.tsx -> BlogSlug
    let baseName = file.replace('_public.', '').replace('.tsx', '');
    if (baseName === 'index') baseName = 'Home';
    
    // camelCase to PascalCase
    const componentName = baseName.split(/[-.]/).map(part => {
        if (part.startsWith('$')) part = part.substring(1) + 'Detail';
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');

    // Match the Route definition
    const routeRegex = /export\s+const\s+Route\s*=\s*createFileRoute\([^)]+\)\(\{\s*(?:head:\s*\(\)\s*=>\s*\(\{\s*meta:\s*\[([\s\S]*?)\]\s*\}\),?\s*)?(?:component:\s*\(\)\s*=>\s*\(([\s\S]*)\)\s*,?\s*|\s*component:\s*function\s*[^{]*\{([\s\S]*)\}\s*,?\s*)\}\);?/s;

    const match = content.match(routeRegex);

    if (match) {
        const [fullMatch, metaContent, arrowComponent, funcComponent] = match;
        const componentBody = arrowComponent || funcComponent;

        // Parse meta loosely if present
        let headComponent = '';
        if (metaContent) {
            let title = '';
            let description = '';
            const titleMatch = metaContent.match(/title:\s*['"](.*?)['"]/);
            if (titleMatch) title = titleMatch[1];

            const descMatch = metaContent.match(/name:\s*['"]description['"],\s*content:\s*['"](.*?)['"]/);
            if (descMatch) description = descMatch[1];

            headComponent = `<Head>\n${title ? `        <title>${title}</title>\n` : ''}${description ? `        <meta name="description" content="${description}" />\n` : ''}      </Head>`;
        }

        let newContent = `import { Head } from "@inertiajs/react";\nimport PublicLayout from "@/Layouts/PublicLayout";\n\n`;
        newContent += content.replace(fullMatch, ''); // Keep other imports and logic

        newContent += `\nexport default function ${componentName}() {\n  return (\n    <>\n      ${headComponent}\n      ${componentBody}\n    </>\n  );\n}\n\n`;
        newContent += `${componentName}.layout = (page: React.ReactNode) => <PublicLayout children={page} />;\n`;

        fs.writeFileSync(path.join(destDir, `${componentName}.tsx`), newContent);
        console.log(`Converted ${file} -> ${componentName}.tsx`);
    } else {
        // Fallback: just copy and export default
        console.log(`Could not fully parse ${file}, manual intervention may be needed.`);
    }
}
