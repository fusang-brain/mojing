import { app, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';
import log from 'electron-log';
import config, { getDirname } from '../configs';
import { join } from 'path';
// import { checkForUpdate, checkForUpdateAndNotify, setMode, checkUpdate } from './autoUpdater';
import is = require('electron-is');
import { manualCheckUpdate } from './autoUpdater';
import aboutWindow from 'about-window';
// import config from '../../renderer/config';

const productName: string = config.get('productName') as string;

export function init() {
  log.info('(menu) init');

  const helpSubmenus: MenuItemConstructorOptions[] = [
    {
      label: 'Learn More',
      click () { require('electron').shell.openExternal('https://meyup.io') }
    }
  ];

  if (is.dev()) {
    helpSubmenus.push({
      label: '开发者工具',
      role: 'toggledevtools',
    });
  }

  const $dirname = getDirname();

  function openAboutWindow() {
    aboutWindow({
      product_name: config.get('productName') as string,
      icon_path: is.dev() ? `${$dirname}/../renderer/icon.png` : `${$dirname}/dist/renderer/icon.png`,
      copyright: 'Copyright (c) 2019 武汉扶桑彼岸科技',
      package_json_dir: is.dev() ? `${$dirname}/../../` : `${$dirname}/dist/../`,
      win_title: '关于魔镜店家',
      use_version_info: false,
      win_options: {
        title: '关于魔镜店家',
      },
      description: "更加现代化的眼镜门店管理, 助力您的新零售",
    });
  }

  const template: any = [
    {
      label: productName,
      submenu: is.osx() ? [
        {
          label: `关于${productName}`,
          click: () => {
            openAboutWindow();
          },
        },
        {
          label: '检查更新', 
          click: () => {
            manualCheckUpdate();
          },
        },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'unhide', label: '取消隐藏' },
        { type: 'separator' },
        { role: 'quit', label: '退出' },
      ] : [
        {
          label: `关于${productName}`,
          click: () => {
            openAboutWindow();
          },
        },
        {
          label: '检查更新', 
          click: () => {
            manualCheckUpdate();
          },
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' },
      ]
    },
    {
      label: "编辑",
      submenu: [
        { label: "复制", accelerator: "CmdOrCtrl+C", selector: 'copy:' },
        { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: 'paste:' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forcereload', label: '强制重新加载' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏显示' },
      ]
    },
    {
      label: '窗口',
      role: 'window',
      submenu: [
        {role: 'minimize', label: '最小化' + __dirname},
        {role: 'close', label: '关闭' + $$dirname},
        
      ]

    },
    {
      label: '帮助',
      // role: '帮助',
      role: 'help',
      submenu: helpSubmenus,
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}