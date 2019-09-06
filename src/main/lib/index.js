"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var electron_log_1 = require("electron-log");
var application = require("./services/application");
var menu = require("./services/menu");
var window = require("./services/window");
var config = require("./configs");
electron_log_1["default"].transports.file.level = 'info';
electron_log_1["default"].info('(main/index) app start');
electron_log_1["default"].info("(main/index) log file at " + electron_log_1["default"].transports.file.file);
// log.info($dirname, 'dirname');
// ipcMain.on('AppLoaded', (event: any, arg: any) => {
//   event.sender.send('AppRunSuccess', 'true');
//   // log.info('app loaded');
// });
electron_1.app.on('ready', function () {
    electron_log_1["default"].info('(main/index) app ready');
    var win = application.init();
    menu.init();
    // if (is.dev()) {
    //   console.log('开发模式, 开始安装Redux调试工具');
    //   installExtension(REDUX_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));
    // }
    // updater.checkUpdate();
});
// app.on('')
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    electron_log_1["default"].info('activate');
    if (window.getCount() === 0) {
        var win = application.init();
        win.show();
    }
});
electron_1.app.on('quit', function () {
    electron_log_1["default"].info('(main/index) app quit');
    electron_log_1["default"].info('(main/index) <<<<<<<<<<<<<<<<<<<');
});
// Register to global, so renderer can access these with remote.getGlobal
global.services = {
    application: application,
    window: window
};
global.configs = {
    config: config
};
// global.services = {
//   application,
//   window,
// };
// global.configs = {
//   config,
// };
//# sourceMappingURL=index.js.map