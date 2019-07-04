// global variables
var ws;

// import jquery libraries
window.$ = window.jQuery = require('jquery');

// wait for document to be safe to modify
$(window).on('load', function() {
    //setup
    setupWebSockets()
})

function setupWebSockets(){
    var porttext;
    if (port != 80) {porttext = ":"+port} else {porttext = ""}
    ws = new WebSocket('ws://' + window.location.hostname + porttext);
    ws.onopen = function () {}
    ws.onmessage = function (event) {
        var receivedObj = JSON.parse(event.data)
        switch(receivedObj.item){
            case "tableid":
                tableid = receivedObj.value
                $('#table-id').text(tableid)
            break
            case "menuitems":
                renderMenu(receivedObj.value)
            break
            case "order":
                orderAcknowleadged()
            break
            default:
                console.log(receivedObj)
        }
    };
}

function lookUp(table){
    ws.send(JSON.stringify({
        "request": "get",
        "item": "bill",
        "args": [table]
    }))
}