"use strict";
exports.__esModule = true;
var is = require("electron-is");
var path_1 = require("path");
var electron_1 = require("electron");
var electron_log_1 = require("electron-log");
var configs_1 = require("../configs");
// import { $dirname } from 'typings';
var count = 0;
function create(opts) {
    count += 1;
    opts.title = configs_1["default"].get('productName');
    var win = new electron_1.BrowserWindow(opts);
    // win.webContents.openDevTools();
    win.on('close', function () {
        count -= 1;
        win = null;
        electron_log_1["default"].info('close ...', count);
    });
    // win.webContents.
    return win;
}
exports.create = create;
function getCount() {
    return count;
}
exports.getCount = getCount;
function getPath() {
    var $dirname = configs_1.getDirname();
    var path = "file://" + path_1.join($dirname, '..', 'renderer') + "/index.html";
    if (is.dev()) {
        path = 'http://127.0.0.1:8000/';
    }
    return path;
}
exports.getPath = getPath;
//# sourceMappingURL=window.js.map