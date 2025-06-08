const { app, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

let backendProcess;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    if (app.isPackaged) {
        win.loadFile(path.join(process.resourcesPath, 'dist', 'index.html'));
    } else {
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

// Clean up backend process on quit
app.on('before-quit', () => {
    if (backendProcess) {
        // backendProcess.kill();
        if (process.platform === 'win32') {
            // Force kill process tree on Windows (optional, only if needed)
            exec(`taskkill /pid ${backendProcess.pid} /T /F`);
        } else {
            backendProcess.kill();
        }
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});