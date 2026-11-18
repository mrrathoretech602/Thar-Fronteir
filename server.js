const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.zip': 'application/zip',
    '.exe': 'application/vnd.microsoft.portable-executable',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const SETUP_EXE_PATH = path.join(__dirname, 'dist', 'TharFrontier1971_Setup.exe');
const ZIP_PATH = path.join(__dirname, 'dist', 'TharFrontier1971_v1.0_Windows_x64.zip');

const server = http.createServer((req, res) => {
    let reqUrl = decodeURIComponent(req.url.split('?')[0]);

    // Direct game download routes (Direct Setup.exe like Steam)
    if (reqUrl === '/download' || reqUrl === '/download-game' || reqUrl === '/download-exe' || reqUrl === '/download-setup') {
        const downloadFile = fs.existsSync(SETUP_EXE_PATH) ? SETUP_EXE_PATH : ZIP_PATH;
        const fileName = path.basename(downloadFile);
        const contentType = path.extname(downloadFile) === '.exe' ? 'application/vnd.microsoft.portable-executable' : 'application/zip';

        if (fs.existsSync(downloadFile)) {
            const stat = fs.statSync(downloadFile);
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': stat.size,
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(downloadFile).pipe(res);
            return;
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: Game installer executable not found in dist folder.');
            return;
        }
    }

    if (reqUrl === '/download-zip') {
        if (fs.existsSync(ZIP_PATH)) {
            const stat = fs.statSync(ZIP_PATH);
            res.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="TharFrontier1971_v1.0_Windows_x64.zip"',
                'Content-Length': stat.size,
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(ZIP_PATH).pipe(res);
            return;
        }
    }

    // Default route
    if (reqUrl === '/') reqUrl = '/index.html';

    const filePath = path.join(__dirname, reqUrl);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Efficient streaming for large files (like .zip or heavy audio)
    if (ext === '.zip') {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': stats.size,
                    'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`
                });
                fs.createReadStream(filePath).pipe(res);
            }
        });
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found: ' + reqUrl);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    const gameUrl = `http://localhost:${PORT}/`;
    const siteUrl = `http://localhost:${PORT}/download.html`;
    console.log(`\n======================================================`);
    console.log(`🇮🇳 THAR FRONTIER: A SOLDIER'S PROMISE · 1971`);
    console.log(`⚔️ Longewala, Jaisalmer, Rajasthan · Cinematic 2.5D`);
    console.log(`🌐 Web Game:         ${gameUrl}`);
    console.log(`🚀 Download Website: ${siteUrl}`);
    console.log(`📦 Direct PC App (.exe): http://localhost:${PORT}/download`);
    console.log(`======================================================\n`);

    // Automatically open in default browser on Windows
    const startCmd = process.platform === 'win32' ? `start ${siteUrl}` : `open ${siteUrl}`;
    exec(startCmd, (err) => {
        if (err) {
            console.log(`Navigate to: ${siteUrl}`);
        }
    });
});

