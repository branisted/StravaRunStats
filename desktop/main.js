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

    // const startUrl = `file://${path.join(__dirname, 'build/dist', 'index.html')}`

    if (app.isPackaged) {
        // In production: pass a file path, not a file:// URL
        win.loadFile(path.join(process.resourcesPath, 'dist', 'index.html'));
    } else {
        // In development: pass the dev server URL
        win.loadURL('http://localhost:5173');
    }

}

app.whenReady().then(() => {
    let backendPath;
    if (app.isPackaged) {
        backendPath = path.join(process.resourcesPath, 'backend', 'main.exe');
    } else {
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