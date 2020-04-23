// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, BrowserView} = require('electron')
const fs = require('fs')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on("did-finish-load", function() {

    // mainWindow.webContents.setZoomFactor(5)

    // mainWindow.webContents.getZoomLevel((r) => {
    //   console.log('=======ZoomLevel=====1=', r)
    // })
    // mainWindow.webContents.setZoomLevel(8.8)
    // mainWindow.webContents.getZoomLevel((r) => {
    //   console.log('=======ZoomLevel=====2=', r)
    // })

    // Use default printing options
    // mainWindow.webContents.getZoomFactor((r) => {
    //   console.log('=======ZoomFactor=====1=', r)
    // })
    // mainWindow.webContents.setZoomFactor(2)
    // mainWindow.webContents.getZoomFactor((r) => {
    //   console.log('=======ZoomFactor=====2=', r)
    // })

  })

  // print to pdf
  ipcMain.on('print-to-pdf', (event, options) => {
    console.log('========receive print command====')
    const pdfPath = path.join(__dirname, 'print_pdf_temp/print.pdf')
    mainWindow.webContents.printToPDF(options).then(data => {
      console.log('========print to pdf success====')
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error

        // 弹窗打印预览============
        let viewerUrl = path.join('file://', __dirname, `node_modules/electron-pdf-window/pdfjs/web/viewer.html?file=${decodeURIComponent('file://' + pdfPath)}`)
        console.log('========print pdf create====', viewerUrl)
        event.reply('wrote-pdf', viewerUrl)
      })
    }).catch(error => {
      event.reply('wrote-pdf', 'error')
      console.log('========print to pdf success====', error)
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
