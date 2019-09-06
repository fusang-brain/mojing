"use strict";
exports.__esModule = true;
var electron_updater_1 = require("electron-updater");
var configs_1 = require("../configs");
var electron_1 = require("electron");
var electron_log_1 = require("electron-log");
var UpgradePath = configs_1["default"].get('upgradePath');
var win = null;
var firstChecked = false;
var inited = false;
var mode = 'null';
function sendUpdateMessage(data) {
    if (!win) {
        console.log('==> win is null');
        return;
    }
    data.mode = mode;
    win.webContents.send('updaterMessage', data);
}
exports.sendUpdateMessage = sendUpdateMessage;
function setWin(mainWindow) {
    win = mainWindow;
}
exports.setWin = setWin;
function init(mainWindow) {
    console.log(UpgradePath, 'upgradePath');
    win = mainWindow;
    if (inited) {
        return;
    }
    var message = {
        error: 'ERROR',
        checking: 'CHECKING',
        updateAva: 'AVAILABLE',
        updateNotAva: 'NOT_AVAILABLE',
        downloadProgress: 'DOWNLOAD_PROGRESS',
        updateDownloaded: 'UPDATE_DOWNLOADED'
    };
    // autoUpdater.autoDownload = false;
    electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
    electron_updater_1.autoUpdater.setFeedURL(UpgradePath);
    electron_updater_1.autoUpdater.on('error', function (error) {
        electron_log_1["default"].info('update error: ', error);
    });
    electron_updater_1.autoUpdater.on('checking-for-update', function () {
        electron_log_1["default"].info('checking update');
        sendUpdateMessage({
            type: message.checking
        });
    });
    electron_updater_1.autoUpdater.on('update-available', function (info) {
        electron_log_1["default"].info('update-available', info);
        // updating = false;
        sendUpdateMessage({
            type: message.updateAva,
            data: {
                version: info.version,
                releaseDate: info.releaseDate
            }
        });
    });
    electron_updater_1.autoUpdater.on('update-not-available', function (info) {
        electron_log_1["default"].info('update-not-available', info);
        sendUpdateMessage({
            type: message.updateNotAva
        });
    });
    // 更新下载进度事件
    electron_updater_1.autoUpdater.on('download-progress', function (progressObj) {
        electron_log_1["default"].info('download-progress', progressObj);
        sendUpdateMessage({
            type: message.downloadProgress,
            data: progressObj
        });
    });
    electron_updater_1.autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        electron_log_1["default"].info('update-downloaded');
        sendUpdateMessage({
            type: message.updateDownloaded
        });
    });
    electron_1.ipcMain.on('updateNow', function (event, arg) {
        electron_updater_1.autoUpdater.quitAndInstall();
    });
    electron_1.ipcMain.on('autoCheckUpdate', function (event, arg) {
        mode = 'auto';
        if (firstChecked) {
            sendUpdateMessage({
                type: message.updateNotAva
            });
            return;
        }
        electron_log_1["default"].info('auto update checking');
        checkForUpdate();
        firstChecked = true;
    });
    electron_1.ipcMain.on('manualCheckUpdate', function (event, arg) {
        electron_log_1["default"].info('manual update checking');
        mode = 'manual';
        checkForUpdate();
    });
    inited = true;
    firstChecked = false;
}
exports.init = init;
function manualCheckUpdate() {
    electron_log_1["default"].info('manual update checking click');
    if (win) {
        win.webContents.send('checkUpdate');
    }
}
exports.manualCheckUpdate = manualCheckUpdate;
function checkForUpdate() {
    // if (!updating) {
    electron_updater_1.autoUpdater.checkForUpdates();
    // }
}
exports.checkForUpdate = checkForUpdate;
function checkForUpdateAndNotify() {
    // if (updating) {
    //   autoUpdater.checkForUpdatesAndNotify();
    //   updating = true;
    // }
}
exports.checkForUpdateAndNotify = checkForUpdateAndNotify;
//# sourceMappingURL=autoUpdater.js.map