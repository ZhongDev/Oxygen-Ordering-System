// import MenuObject
const fs = require('fs');
let rawdata = fs.readFileSync('./oxygenMenu.json');  
let MenuObject = JSON.parse(rawdata);

// get port that is currently being listened on.
var port = process.env.PORT || 80

// generate tableid table
var tableidArr = []

// class for responding to table GUI
class customer {
    static get(req, res){
        res.render('pages/customer', {MenuObject, "port": port})
    }

    static ws(ws, req){
        ws.on('message', function (msg){
            handleRequest(ws, req, msg)
        })
    }
}

// class for responding to kitchen GUI (currently unused)
class kitchen {
    static get(req, res){
        res.render('pages/kitchen', {"port": port})
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            handleRequest(ws, req, msg)
        })
    }
}

// class for responding to kitchen GUI (currently unused)
class pos {
    static get(req, res){
        res.render('pages/pos', {"port": port})
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            handleRequest(ws, req, msg)
        })
    }
}

// assign table on connection handshake
function assignTableId(ws, Address){
    var newID = tableidArr.length
    tableidArr[newID] = {
        'addr': Address,
        'orders': []
    }
    ws.send(JSON.stringify({
        "item": "tableid",
        "value": newID + 1,
        "error": ""
    }))
}

// return requested menu Category Object
function returnMenuItems(ws, category){
    returnObj = MenuObject.categories[category];
    ws.send(JSON.stringify({
        "item": "menuitems",
        "value": returnObj,
        "error": ""
    }))
}

//return Items Ordered by a specific table
function returnBill(ws, tableid){
    returnObj = tableidArr[tableid-1].orders;
    ws.send(JSON.stringify({
        "item": "bill",
        "value": returnObj,
        "error": ""
    }))
}

//save Order Request
function saveOrder(ws, category, index, qty, tableid){
    tableidArr[tableid-1].orders.push({
        item: MenuObject.categories[category][index],
        qty: qty
    })
    ws.send(JSON.stringify({
        "item": "order",
        "value": "aknowleadged",
        "error": ""
    }))
}

//handle any get/order request from window clients
function handleRequest(ws, req, msg){
    var receivedObj = JSON.parse(msg);
        switch (receivedObj.request) {
            case "get":
                    switch(receivedObj.item){
                        case "tableid":
                            assignTableId(ws, req.connection.remoteAddress)
                            break
                        case "menuitems":
                            returnMenuItems(ws, receivedObj.args[0])
                            break
                        case "bill":
                            returnBill(ws, receivedObj.args[0])
                            break
                        default:
                            ws.send(JSON.stringify({
                                "item": "",
                                "error": "1::unknown request"
                            }))
                    }
                break
            case "order":
                saveOrder(ws, receivedObj.category, receivedObj.index, receivedObj.qty, receivedObj.tableid)
                break
            default:
                ws.send(JSON.stringify({
                    "item": "",
                    "error": "1::unknown request"
                }))
        }
}

//export handlers to main script
module.exports = {customer, kitchen, pos}