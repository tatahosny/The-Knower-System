const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'UI');
const pagesDir = path.join(__dirname, 'resources/js/Pages/UI_Generated');

if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
}

const selfClosingTags = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'polygon', 'polyline', 'line', 'ellipse']);

function escapeText(text) {
    return text
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function processHtmlContent(html) {
    // Basic extraction of main tag
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    let mainHtml = mainMatch ? mainMatch[0] : html;

    // Remove comments
    mainHtml = mainHtml.replace(/<!--[\s\S]*?-->/g, '');

    // Convert class to className
    mainHtml = mainHtml.replace(/\bclass="/g, 'className="');
    // Convert for to htmlFor
    mainHtml = mainHtml.replace(/\bfor="/g, 'htmlFor="');
    
    // SVG specific attributes
    mainHtml = mainHtml.replace(/stroke-width/g, 'strokeWidth');
    mainHtml = mainHtml.replace(/stroke-linecap/g, 'strokeLinecap');
    mainHtml = mainHtml.replace(/stroke-linejoin/g, 'strokeLinejoin');
    mainHtml = mainHtml.replace(/fill-rule/g, 'fillRule');
    mainHtml = mainHtml.replace(/clip-rule/g, 'clipRule');
    
    // Strip styles
    mainHtml = mainHtml.replace(/\bstyle="[^"]*"/g, '');

    // Ensure self-closing tags are closed
    for (const tag of selfClosingTags) {
        const regex = new RegExp(`<(${tag})([^>]*?)(/?)>`, 'gi');
        mainHtml = mainHtml.replace(regex, (match, tagName, attrs, closingSlash) => {
            if (closingSlash) return match; // Already self-closing
            return `<${tagName}${attrs} />`;
        });
    }
    
    // Escape { } < > inside text blocks (naive regex, we protect tags)
    const tokens = mainHtml.split(/(<[^>]+>)/g);
    for (let i = 0; i < tokens.length; i++) {
        if (!tokens[i].startsWith('<')) {
            tokens[i] = escapeText(tokens[i]);
        }
    }
    mainHtml = tokens.join('');

    return mainHtml;
}

const folders = fs.readdirSync(uiDir);

for (const folder of folders) {
    const folderPath = path.join(uiDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        const htmlFile = path.join(folderPath, 'code.html');
        if (fs.existsSync(htmlFile)) {
            const html = fs.readFileSync(htmlFile, 'utf8');
            const jsxContent = processHtmlContent(html);
            
            const compName = folder.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
            
            const componentStr = `import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ${compName}({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user} header="${compName}">
            <Head title="${compName} - The Knower OS" />
            ${jsxContent}
        </AuthenticatedLayout>
    );
}
`;
            fs.writeFileSync(path.join(pagesDir, `${compName}.jsx`), componentStr, 'utf8');
            console.log(`Converted ${folder} to ${compName}.jsx`);
        }
    }
}
