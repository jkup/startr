const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.sendSync('synchronous-message');

ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg);
});
