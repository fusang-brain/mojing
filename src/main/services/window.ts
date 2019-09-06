import * as is from 'electron-is';
import * as url from 'url';
import { join } from 'path';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import log from 'electron-log';
import config, { getDirname } from '../configs';
// import { $dirname } from 'typings';

let count = 0;

export function create(opts: BrowserWindowConstructorOptions) {
  count += 1;
  opts.title = config.get('productName') as string;
  let win: BrowserWindow|null = new BrowserWindow(opts);

  // win.webContents.openDevTools();
  
  win.on('close', () => {
    
    count -= 1;
    win = null;

    log.info('close ...', count);
  });

  // win.webContents.

  return win;
}

export function getCount() {
  return count;
}

export function getPath() {

  const $dirname = getDirname();
  // console.log($dirname, 'dirname');
  // let path = `file://${join($dirname, '..', 'renderer')}/index.html`
  let path = url.format({
    pathname: join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true,
  });

  if (is.dev()) {
    path = 'http://127.0.0.1:8000/';
  }
  return path;
}