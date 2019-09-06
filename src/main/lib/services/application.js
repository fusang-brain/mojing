"use strict";
exports.__esModule = true;
var window_1 = require("./window");
var is = require("electron-is");
var updater = require("./autoUpdater");
var log = require("electron-log");
var minWidth = 1120;
var minHeight = 800;
function init() {
    var win = window_1.create({
        title: '觅芽店家',
        width: minWidth,
        height: minHeight,
        minWidth: minWidth,
        minHeight: minHeight,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: is.dev() ? true : false
        },
        show: false
    });
    win.setBackgroundColor('#292C32');
    win.on('ready-to-show', function () {
        log.info('window ready to show ...');
        win.show();
    });
    updater.init(win);
    win.loadURL(window_1.getPath());
    return win;
}
exports.init = init;
//# sourceMappingURL=application.js.map