import { create, getPath } from './window';
import * as is from 'electron-is';
import * as updater from './autoUpdater';
import * as log from 'electron-log';

const minWidth = 1120;
const minHeight = 800;

export function init() {
  const win = create({ 
    title: '觅芽店家',
    width: minWidth, 
    height: minHeight,
    minWidth: minWidth,
    minHeight: minHeight,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    show: false,
  });
  
  win.setBackgroundColor('#292C32');

  win.on('ready-to-show', () => {
    log.info('window ready to show ...');
    win.show();
  });
  updater.init(win);
  win.loadURL(getPath());

  return win;
}