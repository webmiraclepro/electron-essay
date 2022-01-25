const { contextBridge, ipcRenderer } = require('electron');
const path = require('path')
const fs = require('fs')
const {dialog} = require('@electron/remote');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    send(channel, arg) {
      ipcRenderer.send(channel, arg)
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    getPreloadPath() {
      // return path.join(__dirname, '../../webview_preload.js')
      // return `${path.resolve('src/renderer/webview_preload.js')}`
      return path.join(__dirname, '../renderer/webview_preload.js')
    }
  },
  getPreloadPath() {
    return `file://${path.resolve('resources/assets/js/webview_preload.js')}`
  },
  getPathInstance() {
    return path;
  },
  getFsInstance() {
    return fs;
  },
  getDialogInstance() {
    return dialog;
  },
  getDefaultPath() {
    return path.join(__dirname, '../files/');
  },
  showSaveDialog(result) {
    dialog.showSaveDialog({
      title: 'Select the File Path to save',
      defaultPath: path.join(__dirname, '../files/result.json'),
      buttonLabel: 'Save',
      // Restricting the user to only Json Files.
      filters: [
        {
          name: 'Json Files',
          extensions: ['json', 'csv']
        }, ],
      properties: []
    }).then(file => {
    // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
          console.log(file.filePath.toString());
          
          // Creating and Writing to the sample.txt file
          fs.writeFile(file.filePath.toString(),
                JSON.stringify(result), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        }
      }).catch(err => {
        console.log(err)
    });
  },
  showOpenDialog() {
    return dialog.showOpenDialog({
      title: 'Select the File Path to read',
      defaultPath: path.join(__dirname, '../files/'),
      buttonLabel: 'open',
      filters: [
      {
        name: 'Json Files',
        extensions: ['json', 'csv']
      }, ],
      properties: [ ]
    }).then(file => {
      console.log(file.canceled);
      // console.log(file)
      if(!file.canceled) {
        console.log(file.filePaths[0].toString());
        return new Promise((resolve, reject) => {
          const data = fs.readFileSync(file.filePaths[0].toString(), 'utf-8');
          resolve(data)
        })
      }
    }).catch(err => {
      console.log(err)
    });
  },

});