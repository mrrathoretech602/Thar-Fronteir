// Build script for Vercel and production deployments
// Ensures public/ directory contains complete, working static website & game assets.

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Building public/ directory for Vercel deployment...');

// Create clean public directory
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Copy root web files
const rootFiles = [
    'index.html',
    'game.html',
    'download.html',
    'download.css',
    'download.js',
    'style.css'
];

for (const file of rootFiles) {
    const srcPath = path.join(__dirname, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(PUBLIC_DIR, file));
        console.log(`Copied ${file} -> public/${file}`);
    }
}

// 2. Copy directories
const dirsToCopy = [
    'assets',
    'Zgamland',
    'lib',
    'src',
    'FXsound'
];

for (const dir of dirsToCopy) {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(PUBLIC_DIR, dir);
    if (fs.existsSync(srcDir)) {
        copyDirRecursive(srcDir, destDir);
        console.log(`Copied directory: ${dir} -> public/${dir}`);
    }
}

console.log('Build completed successfully! public/ directory is ready for deployment.');
