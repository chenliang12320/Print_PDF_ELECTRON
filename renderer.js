// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {BrowserWindow} = require('electron').remote

const PDFWindow = require('electron-pdf-window')
const path = require('path')

const { showPrintPreview } = require('./printPreview')

document.getElementById('pdfBtn').addEventListener('click', function() {
  let url = path.join('file://', __dirname, './testPdf.pdf')
  document.getElementById('urlSpan').innerHTML = url
  const win = new BrowserWindow({width: 800, height: 600})
  PDFWindow.addSupport(win)
  win.loadURL(url)
  win.show()
})  

document.getElementById('pdfBtn1').addEventListener('click', function() {
  const win = new BrowserWindow({width: 400, height: 275})
  win.loadURL(path.join('file://', __dirname, './pdfprint.html'))
  win.show()
})  

// pdfjs
document.getElementById('pdfjsBtn').addEventListener('click', function() {
  showPrintPreview()
})