'use strict';

const electron      = require('electron');
const GitHubApi     = require("github");
const BrowserWindow = electron.BrowserWindow;
const ipcMain       = electron.ipcMain;
const app           = electron.app;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let repositories;

const github = new GitHubApi({
  version: "3.0.0",
  // optional
  debug: false,
  protocol: "https",
  host: "api.github.com",
  timeout: 5000,
  headers: {
    "user-agent": "Starter-Kit-GitHub-App"
  }
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('asynchronous-message', function(event, arg) {
  const foo = github.repos.get({
    user: "jkup",
    repo: "shortcut"
  }, function(err, res) {
    repositories.push({
      name: res.name,
      description: res.description,
      stars: res.stargazers_count
    });
  });
  event.sender.send('asynchronous-reply', repositories);
});
