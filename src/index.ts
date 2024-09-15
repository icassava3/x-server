import { app, BrowserWindow, shell, ipcMain, Menu, MenuItemConstructorOptions, autoUpdater, dialog } from "electron";
// import { ensureRedisServerIsRunning } from "./server/databases/redis/redisServer";
const path = require('path');
require('dotenv').config()

let mainWindow

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

//demarrage server api
require('./server/index')
  
//fonction de configuration de la mise à jour automatique
const initAutoUpdate = () => {
  // sortir si on n'est pas en mode production
  if (!app.isPackaged) return

  //const url = `http://192.168.1.5:8500/update/x-server/${process.arch}`
  const url = `https://global.spider-api.com/v1/update/x-server/${process.arch}`
  autoUpdater.setFeedURL({ url })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const version = process.platform === 'win32' ? releaseName : releaseNotes
    mainWindow.webContents.send('new-update', { version: version });
  })

  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
    mainWindow.webContents.send('update-error', { message: message });
  })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
}

//demo
// setInterval(() => {
//   mainWindow.webContents.send('new-update', { version: "1.0.2" });
// }, 15000)

//fonction de configuration de lancement automatique au demarrage de l'ordinateur
const setAutoLaunch = () => {
  // sortir si on n'est pas en mode production
  if (!app.isPackaged) return
  const appFolder = path.dirname(process.execPath)
  const updateExe = path.resolve(appFolder, '..', 'Update.exe')
  const exeName = path.basename(process.execPath)
  app.setLoginItemSettings({
    openAtLogin: true,
    path: updateExe,
    args: ['--processStart', `"${exeName}"`]
  })
}

// Create the browser window.
const createWindow = () => {
  const defaultWidth = 1500
  const defaultHeight = 910
  // We cannot require the screen module until the app is ready.
  const { screen } = require('electron')

  // Screen's available work area dimensions.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const screenWidth = width < defaultWidth ? width : defaultWidth
  const screenHeight = height < defaultHeight ? height : defaultHeight

  mainWindow = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    icon: './assets/icons/win/icon.ico',
    title: 'x-Server ' + app.getVersion(),
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.maximize()

  // const menuOptions: any = exampleMenuTemplate
  // const menu = Menu.buildFromTemplate(menuOptions);
  // Menu.setApplicationMenu(menu);
  if (process.env.NODE_ENV !== "development") {
    Menu.setApplicationMenu(null);
  }
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
  // lance la routine de mise à jour
  initAutoUpdate()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow()
  // lance la routine de mise à jour
  initAutoUpdate()
  // lancement au demarage de l'ordinateur
  setAutoLaunch()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("restart-and-update", (event, options) => {
  autoUpdater.quitAndInstall()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// ipcMain.on("print-to-pdf", (event, options) => {
//   // console.log("options",options)
//   const pdfPath = path.join(__dirname, "demo.pdf");
//   const win = BrowserWindow.fromWebContents(event.sender);
//   win.webContents
//     .printToPDF(options)
//     .then((data) => {
//       const buf2 = (Buffer as any).from(data, "binary");
//       const b64 = Buffer.from(buf2).toString("base64");
//       const pdfB64Data: string = `data:application/pdf;base64,${b64}`;
//       event.sender.send("wrote-pdf", pdfB64Data);
//     })
//     .catch((error) => {
//       console.log(`Failed to write PDF to ${pdfPath}: `, error);
//     });
// });
// const exampleMenuTemplate = [
//   {
//     label: "Options",
//     submenu: [
//       {
//         label: "Quit",
//         click: () => app.quit()
//       },
//       {
//         label: "Radio1",
//         type: "radio",
//         checked: true
//       },
//       {
//         label: "Radio2",
//         type: "radio",
//       },
//       {
//         label: "Checkbox1",
//         type: "checkbox",
//         checked: true,
//         click: (item) => {
//           console.log("item is checked? " + item.checked);
//         }
//       },
//       { type: "separator" },
//       {
//         label: "Checkbox2",
//         type: "checkbox",
//         checked: false,
//         click: (item) => {
//           console.log("item is checked? " + item.checked);
//         }
//       },
//       {
//         label: "Radio Test",
//         submenu: [
//           {
//             label: "Sample Checkbox",
//             type: "checkbox",
//             checked: true
//           },
//           {
//             label: "Radio1",
//             checked: true,
//             type: "radio"
//           },
//           {
//             label: "Radio2",
//             type: "radio"
//           },
//           {
//             label: "Radio3",
//             type: "radio"
//           },
//           { type: "separator" },
//           {
//             label: "Radio1",
//             checked: true,
//             type: "radio"
//           },
//           {
//             label: "Radio2",
//             type: "radio"
//           },
//           {
//             label: "Radio3",
//             type: "radio"
//           }
//         ]
//       },
//       {
//         label: "zoomIn",
//         role: "zoomIn"
//       },
//       {
//         label: "zoomOut",
//         role: "zoomOut"
//       },
//       {
//         label: "Radio1",
//         type: "radio"
//       },
//       {
//         label: "Radio2",
//         checked: true,
//         type: "radio"
//       },
//     ]
//   }
// ];