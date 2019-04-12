// import .env
require('dotenv').config()
var port = process.env.PORT || 80

// require express.js
var path = require('path')
var express = require('express')
var app = express()
var expressWs = require('express-ws')(app)

// require electron functions
const {
    app: electronapp,
    BrowserWindow
} = require('electron')

// require Exported Handlers
var handler = require('./oxygenHandler.js')

// set the view engine to ejs
app.set('view engine', 'ejs')

// respond to GET and Websockets requests on root
app.get('/', handler.customer.get)
app.ws('/', handler.customer.ws)

// POS GUI server
app.get('/pos/', handler.pos.get)
app.ws('/pos/', handler.pos.ws)

// start listening for requests
app.listen(port, () => {
    console.log(`OxygenOS is listening on port ${port}`)
    electronapp.on('ready', () => {
        createWindow()
            .then(()=>{
                console.log(`Electron window attempting connection to localhost on ${port}`)
            })
    })
})

// create the electron window and connect to the local server
function createWindow() {
    return new Promise((resolve, reject) => {
        // Create the browser window.
        win = new BrowserWindow({
            width: 800,
            height: 600
        })

        // and load the index.html of the app.
        win.loadURL('http://127.0.0.1/pos/')
        // win.webContents.openDevTools()   // or CMD+OPTION+I
        resolve()
    })
}