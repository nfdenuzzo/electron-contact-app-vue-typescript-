/* eslint-disable */

import { app, BrowserWindow, nativeTheme, ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import firstRun from 'electron-first-run';
import { encrypt, decrypt } from '../utils/encryptionHelper';
import { parseStringData } from '../utils/helperFunctions';

var myModule = require('./testData');

const defaultData = [{
  "id": "77b3dfcf-27f3-4ac4-a620-f147847db8c3",
  "name": "Contact 1",
  "email": "contact@contact.com",
  "phone": "+1 (111) 111-1111",
  "address": "101 Street, County, State, PostCode"
}];

try {
  if (
    process.platform === 'win32' &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minHeight: 700,
    minWidth: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

//#region check if first run
ipcMain.handle('is-first-run', (event, ...args) => {
  // firstRun.clear()
  const isFirstRun = firstRun()
  return { isFirstRun };
});



//#region open file
ipcMain.handle('upload-file', (event, ...args) => {
  if (!fs.existsSync(args[0].filePath)) {
    return {
      status: 400,
      message: 'File no longer exists please create a new file'
    };
  }
  try {
    const file = args[0].filePath;
    const fileContents = fs.readFileSync(file).toString();
    // if fileContents.length is not greater than 0 we know the files is empty
    const decryptedData = fileContents.length > 0 ? decrypt(fileContents, args[0].password) : "";
    const parseData = parseStringData(decryptedData);
    if (parseData.success) {
      return {
        status: 200,
        message: 'File opened Successfully',
        fileContents: parseData.data,
        filePath: args[0].filePath,
        filePassword: args[0].password
      };
    } else {
      return {
        status: 401,
        message: 'Incorrect Password.'
      };
    }
  } catch (err) {
    console.log('err', err);
    return {
      status: 500,
      message: 'Unable to open File'
    };
  }
});
//#endregion

//#region create file - with data
ipcMain.handle('create-file', (event, ...args) => {
console.log("args", args)
  const encryptedData = encrypt(JSON.stringify(myModule.testData), args[0].password);
  fs.writeFile(
    path.join(app.getPath('userData') + `/${args[0].fileName}.dat`),
    encryptedData,
    function(err) {
      if (err) {
        return { status: 500, message: 'File creation failed' };
      }
    }
  );
  return {
    status: 200,
    message: 'File created Successfully',
    filePath: path.join(app.getPath('userData') + `/${args[0].fileName}.dat`),
    filePassword: args[0].password,
    fileContents: myModule.testData
  };
});
//#endregion

// ipcMain.handle('create-file', (event, ...args) => {
//   try {
//     const encryptedData = encrypt(JSON.stringify(defaultData), args[0].password);
//     fs.writeFile(
//       path.join(app.getPath('userData') + `/${args[0].fileName}.dat`),
//       encryptedData,
//       function(err) {
//         if (err) {
//           return { status: 500, message: 'File creation failed' };
//         }
//       }
//     );
//     return {
//       status: 200,
//       message: 'File created Successfully',
//       filePath: path.join(app.getPath('userData') + `/${args[0].fileName}.dat`),
//       filePassword: args[0].password,
//       fileContents: defaultData
//     };
//   } catch (err) {
//     return {
//       status: 500,
//       message: 'Unable to Create File'
//     };
//   }
// });

//#region update file
ipcMain.handle('update-file', (event, ...args) => {
  if (!fs.existsSync(args[0].filePath)) {
    return {
      status: 400,
      message: 'File no longer exists please create a new file'
    };
  }
  try {
    const encryptedData = encrypt(JSON.stringify(args[0].fileData), args[0].password, args[0].filePath);
    fs.writeFile(args[0].filePath, encryptedData, function(err) {
      if (err) {
        return { status: 500, message: 'File update failed' };
      }
    });
    return { status: 200, message: 'File updated Successfully', fileContents: args[0].fileData };
    
  } catch (err) {
    return {
      status: 500,
      message: 'Unable to update File'
    };
  }
});

//#endregion
