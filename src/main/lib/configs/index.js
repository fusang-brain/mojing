"use strict";
exports.__esModule = true;
var Config = require("electron-store");
exports.getDirname = function () {
    // const $dirname = __dirname;
    // console.log($dirname, 'dirname');
    // return $dirname;
    return $$dirname;
};
// interface IConfig {
//   updaterPath?: string;
//   productName?: string;
// }
var config = new Config({
    name: 'config',
    // productName: '魔镜店+',
    // updaterPath: 'http://release.meyup.io/store',
    schema: {
        upgradePath: {
            type: 'string',
            format: 'uri'
        }
    }
});
config.set('upgradePath', 'http://release.meyup.io/store');
config.set('productName', '魔镜店+');
config.set('dirname', exports.getDirname());
exports["default"] = config;
//# sourceMappingURL=index.js.map