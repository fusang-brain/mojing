import { app, BrowserWindow, ipcMain } from 'electron';
import * as is from 'electron-is';
import * as path from 'path';
import log from 'electron-log';
import * as application from './services/application';
import * as menu from './services/menu';
import * as window from './services/window';
import * as config from './configs';
import * as updater from './services/autoUpdater';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';

log.transports.file.level = 'info';
log.info('(main/index) app start');
log.info(`(main/index) log file at ${log.transports.file.file}`);
// log.info($dirname, 'dirname');

// ipcMain.on('AppLoaded', (event: any, arg: any) => {
//   event.sender.send('AppRunSuccess', 'true');
//   // log.info('app loaded');
// });

app.on('ready', () => {
  log.info('(main/index) app ready');
  const win = application.init();
  // win.
  menu.init();
  // if (is.dev()) {
  //   console.log('开发模式, 开始安装Redux调试工具');
  //   installExtension(REDUX_DEVTOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));
  // }
  win.webContents.openDevTools();

  // updater.checkUpdate();
});

// app.on('')

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  log.info('activate');
  if (window.getCount() === 0) {
    const win = application.init();
    win.show();
  }
});

app.on('quit', () => {
  log.info('(main/index) app quit');
  log.info('(main/index) <<<<<<<<<<<<<<<<<<<');
});

// Register to global, so renderer can access these with remote.getGlobal
global.services = {
  application,
  window,
};

global.configs = {
  config,
};
// global.services = {
//   application,
//   window,
// };

// global.configs = {
//   config,
// };