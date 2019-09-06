#!/usr/bin node

const path = require('path');
const fs = require('fs');
const rootDir = __dirname;


// console.log(rootDir, 'rootDir');

const appPackagePath = path.join(rootDir, '../app/package.json');

const appPackageJSON = require(appPackagePath);
const mainPackageJSON = require(path.join(rootDir, '../package.json'));

appPackageJSON.dependencies = mainPackageJSON.dependencies;
appPackageJSON.name = mainPackageJSON.name;
appPackageJSON.version = mainPackageJSON.version;
appPackageJSON.description = mainPackageJSON.description;

fs.writeFileSync(appPackagePath, JSON.stringify(appPackageJSON,null,2));