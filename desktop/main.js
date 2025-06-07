const { app, BrowserWindow } = require('electron/main')
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

const createWindow = () => {

    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    // win.loadFile('index.html')
    const startUrl = isDev
        ? 'http://localhost:5173' // or whatever Vite's dev server port is
        : `file://${path.join(__dirname, 'dist', 'index.html')}`;

    win.loadURL(startUrl);
}

app.whenReady().then(() => {
    // Path to backend executable after packaging
    const backendPath = path.join(process.resourcesPath, 'backend', 'main.exe');
    backendProcess = spawn(backendPath, [], { stdio: 'ignore' });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        if (backendProcess) backendProcess.kill();
    }
})

app.on('will-quit', () => {
    if (backendProcess) backendProcess.kill();
});