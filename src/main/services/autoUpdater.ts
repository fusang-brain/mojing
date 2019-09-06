import { autoUpdater } from 'electron-updater';
import config from '../configs';
import { BrowserWindow, ipcMain, dialog } from 'electron';
import log from 'electron-log';

const UpgradePath = config.get('upgradePath') as string;

let win: BrowserWindow|null = null;
let firstChecked: boolean = false;
let inited: boolean = false;
let mode: 'auto'|'manual'|'null' = 'null';

type updateMessageStruct = { type: string, data?: any, mode?: string }

export function sendUpdateMessage(data: updateMessageStruct) {
  if (!win) {
    console.log('==> win is null');
    return;
  }

  data.mode = mode;

  win.webContents.send('updaterMessage', data);
}

export function setWin(mainWindow: BrowserWindow) {
  win = mainWindow;
}

export function init(mainWindow: BrowserWindow) {
  console.log(UpgradePath, 'upgradePath');
  win = mainWindow;

  if (inited) {
    return;
  }

  const message = {
    error: 'ERROR',
    checking: 'CHECKING',
    updateAva: 'AVAILABLE',
    updateNotAva: 'NOT_AVAILABLE',
    downloadProgress: 'DOWNLOAD_PROGRESS',
    updateDownloaded: 'UPDATE_DOWNLOADED',
  }

  // autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.setFeedURL(UpgradePath);


  autoUpdater.on('error', function (error) {
    log.info('update error: ', error);
  });

  autoUpdater.on('checking-for-update', function () {
    log.info('checking update');
    
    sendUpdateMessage({
      type: message.checking,
    });
    
  });

  autoUpdater.on('update-available', function (info) {
    log.info('update-available', info);
    // updating = false;
    sendUpdateMessage({
      type: message.updateAva,
      data: {
        version: info.version,
        releaseDate: info.releaseDate,
      },
    });
  });

  autoUpdater.on('update-not-available', function (info) {
    log.info('update-not-available', info);
    
    sendUpdateMessage({
      type: message.updateNotAva,
    });
    
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    log.info('download-progress', progressObj);
    sendUpdateMessage({
      type: message.downloadProgress,
      data: progressObj,
    });

  });

  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    log.info('update-downloaded');
    sendUpdateMessage({
      type: message.updateDownloaded,
    });
  });

  ipcMain.on('updateNow', (event: any, arg: any) => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('autoCheckUpdate', (event: any, arg: any) => {
    mode = 'auto';
    if (firstChecked) {
      sendUpdateMessage({
        type: message.updateNotAva,
      });
      return;
    }
    log.info('auto update checking');
    
    checkForUpdate();
    firstChecked = true;
    
  });

  ipcMain.on('manualCheckUpdate', (event: any, arg: any) => {
    log.info('manual update checking');
    mode = 'manual';
    checkForUpdate();
  });

  inited = true;
  firstChecked = false;
}

export function manualCheckUpdate() {
  log.info('manual update checking click');
  if (win) {
    win.webContents.send('checkUpdate');
  }
  
}

export function checkForUpdate() {
  // if (!updating) {
  autoUpdater.checkForUpdates();
  // }
}

export function checkForUpdateAndNotify() {
  // if (updating) {
  //   autoUpdater.checkForUpdatesAndNotify();
  //   updating = true;
  // }
}