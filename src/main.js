const { app } = require('electron');
const log = require('electron-log');

console.log = log.log;

import Api from './Api'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let api = null

app.on('ready', () => {
  api = new Api()
  api.init()
});

app.on('window-all-closed', () => {


})