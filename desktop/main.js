const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: { ... }
    });

    // If you use Vite for development, adjust this as needed
    const isDev = !app.isPackaged;
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist', 'index.html')}`;

    win.loadURL(startUrl);
}

app.whenReady().then(() => {
    let backendPath;
    if (app.isPackaged) {
        // In production: exe is in resources/backend/main.exe
        backendPath = path.join(process.resourcesPath, 'backend', 'main.exe');
    } else {
        // In development: exe is in your project folder
        backendPath = path.join(__dirname, 'build', 'main.exe');
    }

    backendProcess = spawn(backendPath, [], { stdio: 'ignore' });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) backendProcess.kill();
        app.quit();
    }
});

app.on('will-quit', () => {
    if (backendProcess) backendProcess.kill();
});