// import .env
require('dotenv').config()
var port = process.env.PORT || 80

// import express.js and dependencies
var path = require('path')
var express = require('express')
var app = express()
var expressWs = require('express-ws')(app)

// import electron functions
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

// Serve static files
app.use('/static/', express.static(path.join(__dirname, 'static')))
app.use('/menu-static/', express.static(path.join(__dirname, 'menu-static')))

// start listening for window connection
app.listen(port, () => {
    console.log(`OxygenOS is listening on port ${port}`)
    electronapp.on('ready', () => {
        console.log(`Electron window attempting connection to localhost on ${port}`)
        createWindow('http://127.0.0.1/', 1024, 720, false) 
    })
})

// create the electron window and connect to the local server
function createWindow(url, width, height, resizable) {
    return new Promise((resolve, reject) => {
        // Create the browser window.
        win = new BrowserWindow({
            width,
            height,
            resizable
        })

        // and load the index.html of the app.
        win.loadURL(url)
        
        // uncomment line below to enable automatic opening of DevTools (f12 menu)
        // setTimeout(function(){win.webContents.openDevTools()}, 1000)

        resolve()
    })
}

// end process when all windows are closed
electronapp.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electronapp.quit()
    }
})