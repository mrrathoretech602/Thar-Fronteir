// Standalone Desktop App Entry Point for THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// Bundles embedded local game server + native 60FPS borderless/fullscreen desktop window.

const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow = null;
let httpServer = null;
let serverPort = 3000;

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
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function startInternalServer() {
    return new Promise((resolve, reject) => {
        const createServerInstance = (port) => {
            const server = http.createServer((req, res) => {
                let reqUrl = decodeURIComponent(req.url.split('?')[0]);
                if (reqUrl === '/') reqUrl = '/game.html';

                const filePath = path.join(__dirname, reqUrl);
                const ext = path.extname(filePath).toLowerCase();
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';

                fs.readFile(filePath, (err, content) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end('404 Not Found: ' + reqUrl);
                        } else {
                            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end('500 Server Error: ' + err.code);
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

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    // Try next port if 3000 is occupied
                    createServerInstance(port + 1);
                } else {
                    reject(err);
                }
            });

            server.listen(port, '127.0.0.1', () => {
                httpServer = server;
                serverPort = port;
                resolve(port);
            });
        };

        createServerInstance(3000);
    });
}

function createWindow() {
    const icoPath = path.join(__dirname, 'assets/app_icon.ico');
    const heroPng = path.join(__dirname, 'assets/characters/devrath/devrath_hero.png');
    const selectedIcon = fs.existsSync(icoPath) ? icoPath : (fs.existsSync(heroPng) ? heroPng : undefined);

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 960,
        minHeight: 540,
        title: "THAR FRONTIER: A SOLDIER'S PROMISE · 1971 | 23 Punjab Longewala",
        backgroundColor: '#05070d',
        autoHideMenuBar: true,
        show: false,
        icon: selectedIcon,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false // Keep full 60fps audio/rendering even if window is blurred
        }
    });

    mainWindow.loadURL(`http://127.0.0.1:${serverPort}/game.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Toggle Fullscreen with F11 or Alt+Enter when window is active
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.type === 'keyDown') {
            if (input.key === 'F11' || (input.alt && input.key === 'Enter')) {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                event.preventDefault();
            }
        }
    });
}

// Single Instance Lock (prevents duplicate game processes)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(async () => {
        try {
            await startInternalServer();
            createWindow();
        } catch (err) {
            console.error('Failed to start internal server:', err);
            app.quit();
        }

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    app.on('will-quit', () => {
        if (httpServer) {
            try { httpServer.close(); } catch {}
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}


