const {BrowserWindow, BrowserView} = require('electron').remote
const {ipcRenderer} = require('electron')
const path = require('path')

// pdfjs
const showPrintPreview = () => {
  // create new window
  const win = new BrowserWindow({width: 1000, height: 660, frame: false, webPreferences: {
    devTools: true,
    nodeIntegration: true
  }})
  win.show()

  // left
  let viewL = new BrowserView()
  win.addBrowserView(viewL)
  viewL.setBounds({ x: 0, y: 0, width: 600, height: 660 })
  viewL.setAutoResize({horizontal: true, vertical: true})

  // left pdf part loading 
  showPrintPreviewLoading(viewL.id)

  // right
  let viewR = new BrowserView({webPreferences: { nodeIntegration: true }})
  win.addBrowserView(viewR)
  viewR.setBounds({ x: 600, y: 0, width: 400, height: 660 })
  viewR.setAutoResize({horizontal: true, vertical: true})
  viewR.webContents.loadURL(path.join('file://', __dirname, 'previewSidebar.html'))
  viewR.webContents.openDevTools()

  // send viewL id to page renderer process
  viewR.webContents.on("did-finish-load", () => {
    viewR.webContents.send('getViewLId', viewL.id)
  })
  
  // print pdf
  printToPdf({landscape: false, pageSize: 'A4'}, viewL.id)
}

// show pdf loading page
const showPrintPreviewLoading = (viewLId) => {
  if (viewLId) {
    let viewL = BrowserView.fromId(Number(viewLId))
    if (viewL) {
      let pdfLoadingUrl = path.join('file://', __dirname, 'previewStartLoading.html')
      viewL.webContents.loadURL(pdfLoadingUrl)
    }
  }
}

// send 'print to pdf' message to main process, and receive message show pdf
const printToPdf = (options, viewLId) => {
  if (viewLId) {
    let viewL = BrowserView.fromId(Number(viewLId))
    if (viewL) {
      ipcRenderer.send('print-to-pdf', options)
      ipcRenderer.on('wrote-pdf', (event, pdfpath) => {
        // alert('=======wrote-pdf=======' + pdfpath)
        if (pdfpath && pdfpath != 'error') {
          viewL.webContents.loadURL(pdfpath)
        }
      })
    }
  }
}

// get sytem printers
const getPrinters = () => {
  let printers = []
  let win = BrowserWindow.getFocusedWindow()
  if (win) {
    printers = win.webContents.getPrinters()
    console.log('====printers====', printers)
  }
  return printers
}

if (exports) {
  exports.showPrintPreview = showPrintPreview
  exports.showPrintPreviewLoading = showPrintPreviewLoading
  exports.printToPdf = printToPdf
  exports.getPrinters = getPrinters
} else {
  // export {showPrintPreview, showPrintPreviewLoading, printToPdf}
}