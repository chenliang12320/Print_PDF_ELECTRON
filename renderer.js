// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {app, BrowserWindow, BrowserView} = require('electron').remote
const {ipcRenderer} = require('electron')

const PDFWindow = require('electron-pdf-window')
const path = require('path')

const ipc = require('electron').ipcRenderer
ipc.on('compute-factorial', function (event, fromWindowId) {
  const result = factorial(number)
  const fromWindow = BrowserWindow.fromId(fromWindowId)
  fromWindow.webContents.send('factorial-computed', number, result)
})

document.getElementById('pdfBtn').addEventListener('click', function() {
  let url = path.join('file://', __dirname, './testPdf.pdf')
  document.getElementById('urlSpan').innerHTML = url
  const win = new BrowserWindow({width: 800, height: 600})
  PDFWindow.addSupport(win)
  win.loadURL(url)
  win.show()

  // let view = new BrowserView()
  // win.setBrowserView(view)
  // view.setBounds({ x: 800, y: 0, width: 300, height: 300 })
  // view.webContents.loadURL('https://electronjs.org')
})  

document.getElementById('pdfBtn1').addEventListener('click', function() {
  const win = new BrowserWindow({width: 400, height: 275})
  win.loadURL(path.join('file://', __dirname, './pdfprint.html'))
  win.show()
})  

const printDialog = require('electron-print-dialog');
document.getElementById('pdfBtn2').addEventListener('click', function() {
  // let url = path.join('file://', __dirname, './testPdf.pdf')
  const win = new BrowserWindow({width: 400, height: 275})
  // printDialog.attach(win)
  printDialog.open(win, {
    data: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })
})  

// pdfjs
document.getElementById('pdfjsBtn').addEventListener('click', function() {
  let url = path.join('file://', __dirname, './testPdf.pdf')
  ipcRenderer.send('print-to-pdf')
  // url = decodeURIComponent(url)

  // `file://${PDF_JS_PATH}?file=${decodeURIComponent(url)}`

  // let viewerUrl = path.join('file://', __dirname, `node_modules/electron-pdf-window/pdfjs/web/viewer.html?file=${decodeURIComponent(url)}`)
  // document.getElementById('urlSpan').innerHTML = viewerUrl
  // const win = new BrowserWindow({width: 1000, height: 660, frame: false, webPreferences: {
  //   devTools: true
  // }})
  // // win.webContents.openDevTools ()
  // // win.loadURL(viewerUrl) // ${}
  // // file://<path>/pdfjs/web/viewer.html?file=pdf.pdf
  // win.show()


  // // left
  // let viewL = new BrowserView()
  // win.addBrowserView(viewL)
  // viewL.setBounds({ x: 0, y: 0, width: 600, height: 660 })
  // viewL.setAutoResize({horizontal: true, vertical: true})
  // viewL.webContents.loadURL(viewerUrl)

  // // right
  // let viewR = new BrowserView()
  // win.addBrowserView(viewR)
  // viewR.setBounds({ x: 600, y: 0, width: 400, height: 660 })
  // viewR.setAutoResize({horizontal: true, vertical: true})
  // viewR.webContents.loadURL(path.join('file://', __dirname, 'previewSidebar.html'))
})