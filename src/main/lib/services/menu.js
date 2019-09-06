"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var electron_log_1 = require("electron-log");
var configs_1 = require("../configs");
var path_1 = require("path");
// import { checkForUpdate, checkForUpdateAndNotify, setMode, checkUpdate } from './autoUpdater';
var is = require("electron-is");
var autoUpdater_1 = require("./autoUpdater");
var about_window_1 = require("about-window");
// import config from '../../renderer/config';
var productName = configs_1["default"].get('productName');
function init() {
    electron_log_1["default"].info('(menu) init');
    var helpSubmenus = [
        {
            label: 'Learn More',
            click: function () { require('electron').shell.openExternal('https://meyup.io'); }
        }
    ];
    if (is.dev()) {
        helpSubmenus.push({
            label: '开发者工具',
            role: 'toggledevtools'
        });
    }
    var $dirname = configs_1.getDirname();
    function openAboutWindow() {
        about_window_1["default"]({
            product_name: configs_1["default"].get('productName'),
            icon_path: path_1.join($dirname, '..', 'renderer') + "/icon.png",
            copyright: 'Copyright (c) 2019 武汉扶桑彼岸科技',
            package_json_dir: path_1.join($dirname, '../..') + "/",
            win_title: '关于魔镜店家',
            use_version_info: false,
            win_options: {
                title: '关于魔镜店家'
            },
            description: "更加现代化的眼镜门店管理, 助力您的新零售"
        });
    }
    var template = [
        {
            label: productName,
            submenu: is.osx() ? [
                {
                    label: "\u5173\u4E8E" + productName,
                    click: function () {
                        openAboutWindow();
                    }
                },
                {
                    label: '检查更新',
                    click: function () {
                        autoUpdater_1.manualCheckUpdate();
                    }
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
                    label: "\u5173\u4E8E" + productName,
                    click: function () {
                        openAboutWindow();
                    }
                },
                {
                    label: '检查更新',
                    click: function () {
                        autoUpdater_1.manualCheckUpdate();
                    }
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
            ]
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
                { role: 'minimize', label: '最小化' },
                { role: 'close', label: '关闭' },
            ]
        },
        {
            label: '帮助',
            // role: '帮助',
            role: 'help',
            submenu: helpSubmenus
        }
    ];
    var menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
exports.init = init;
//# sourceMappingURL=menu.js.map