/**
 * ROBOTFORGE Desktop — Electron Main Process
 *
 * Manages the BrowserWindow, IPC handlers, tray icon,
 * collection daemon lifecycle, and auto-updates.
 */

import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog, session } from 'electron';
import path from 'node:path';
import { CollectionDaemon } from './daemon/CollectionDaemon';
import { registerRobotsIpc } from './ipc/robots.ipc';
import { registerStorageIpc } from './ipc/storage.ipc';
import { registerDaemonIpc } from './ipc/daemon.ipc';
import { getPlatformAdapter, type IPlatformAdapter } from './adapters';

// ─── Auto-updater ────────────────────────────────────────────
let autoUpdater: typeof import('electron-updater').autoUpdater | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { autoUpdater: au } = require('electron-updater');
  autoUpdater = au;
  autoUpdater!.autoDownload = false;
  autoUpdater!.autoInstallOnAppQuit = true;
} catch {
  // electron-updater not available in dev
}

// ─── Paths ───────────────────────────────────────────────────
const isDev = !app.isPackaged;
const PRELOAD_PATH = path.join(__dirname, 'preload.js');
const RENDERER_URL = isDev
  ? 'http://localhost:5174'
  : `file://${path.join(__dirname, '../renderer/index.html')}`;

// ─── Globals ─────────────────────────────────────────────────
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let daemon: CollectionDaemon | null = null;
let platform: IPlatformAdapter | null = null;

// ─── Window creation ─────────────────────────────────────────
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    title: 'ROBOTFORGE',
    backgroundColor: '#0F172A',
    show: false,
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // ─── CSP Headers (Spec §7.3 — Content Security Policy) ──
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            `connect-src 'self' ${isDev ? 'ws://localhost:* http://localhost:*' : ''} https://*.robotforge.dev https://*.livekit.cloud`,
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            "font-src 'self' data:",
            "worker-src 'self' blob:",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
          ].join('; '),
        ],
      },
    });
  });

  mainWindow.loadURL(RENDERER_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (e) => {
    if (daemon?.isRunning) {
      e.preventDefault();
      dialog
        .showMessageBox(mainWindow!, {
          type: 'warning',
          buttons: ['Stop & Quit', 'Cancel'],
          defaultId: 1,
          title: 'Collection In Progress',
          message: 'A collection session is still running. Stop it and quit?',
        })
        .then(({ response }) => {
          if (response === 0) {
            daemon?.stop();
            mainWindow?.destroy();
          }
        });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// ─── Tray ────────────────────────────────────────────────────
function createTray(): void {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('ROBOTFORGE Desktop');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Window', click: () => mainWindow?.show() },
    { type: 'separator' },
    {
      label: 'Collection Status',
      enabled: false,
      sublabel: daemon?.isRunning ? 'Running' : 'Idle',
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
}

// ─── Daemon ──────────────────────────────────────────────────
function initDaemon(): void {
  daemon = new CollectionDaemon();

  daemon.on('telemetry', (data) => {
    mainWindow?.webContents.send('daemon:telemetry', data);
  });

  daemon.on('episode-complete', (episode) => {
    mainWindow?.webContents.send('daemon:episode-complete', episode);
  });

  daemon.on('error', (error) => {
    mainWindow?.webContents.send('daemon:error', { message: error.message });
  });
}

// ─── IPC Registration ────────────────────────────────────────
function registerAllIpc(): void {
  registerRobotsIpc(ipcMain);
  registerStorageIpc(ipcMain);
  registerDaemonIpc(ipcMain, () => daemon);

  // Generic window controls
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
  ipcMain.handle('app:version', () => app.getVersion());

  // Platform adapter IPC
  ipcMain.handle('platform:storage-paths', () => platform?.getStoragePaths());
  ipcMain.handle('platform:gpu-info', () => platform?.detectGpus());
  ipcMain.handle('platform:usb-devices', () => platform?.enumerateUsbDevices());
  ipcMain.handle('platform:disk-space', (_e, p: string) => platform?.getAvailableDiskSpace(p));
  ipcMain.handle('platform:open-folder', (_e, p: string) => platform?.openInFileManager(p));
  ipcMain.handle('platform:capabilities', () => platform?.capabilities);
}

// ─── App lifecycle ───────────────────────────────────────────
app.whenReady().then(async () => {
  // Initialize platform adapter first
  platform = getPlatformAdapter();
  await platform.initialize();

  initDaemon();
  registerAllIpc();
  createMainWindow();

  // Only create tray if platform supports it
  if (platform.capabilities.supportsTray) {
    createTray();
  }

  initAutoUpdater();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    daemon?.stop();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('before-quit', () => {
  daemon?.stop();
});

// ─── Auto-update lifecycle (Spec §5 Step 2.1) ───────────────
function initAutoUpdater(): void {
  if (!autoUpdater) return;

  autoUpdater.on('update-available', (info) => {
    dialog
      .showMessageBox(mainWindow!, {
        type: 'info',
        buttons: ['Download', 'Later'],
        defaultId: 0,
        title: 'Update Available',
        message: `ROBOTFORGE v${info.version} is available. Download now?`,
      })
      .then(({ response }) => {
        if (response === 0) autoUpdater!.downloadUpdate();
      });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox(mainWindow!, {
        type: 'info',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        title: 'Update Ready',
        message: 'Update downloaded. Restart to install?',
      })
      .then(({ response }) => {
        if (response === 0) autoUpdater!.quitAndInstall();
      });
  });

  // Check for updates after a short delay
  setTimeout(() => {
    autoUpdater!.checkForUpdates().catch(() => {
      // Silently ignore update check failures
    });
  }, 5_000);
}
