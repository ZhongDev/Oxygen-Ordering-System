// import MenuObject
const fs = require('fs');
let rawdata = fs.readFileSync('./menupack/oxygenMenu.json');  
let MenuObject = JSON.parse(rawdata);

//get port
var port = process.env.PORT || 80

//generate id table
var tableidArr = []

class customer {

    static get(req, res){
        res.render('pages/customer', {MenuObject, "port": port})
    }

    static ws(ws, req){
        ws.on('message', function (msg){
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
                            default:
                                ws.send(JSON.stringify({
                                    "item": "",
                                    "error": "1::unknown request"
                                }))
                        }
                    break
                    
                default:
                    ws.send(JSON.stringify({
                        "item": "",
                        "error": "1::unknown request"
                    }))
            }
        })
    }
}

class kitchen {
    static get(req, res){
        res.render('pages/kitchen', {})
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:kitchen')
        })
    }
}

class pos {
    static get(req, res){
        res.render('pages/pos', {})
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:pos')
        })
    }
}

module.exports = {customer, kitchen, pos}

//assigning table
function assignTableId(ws, Address){
    var newID = tableidArr.length
    tableidArr[newID] = Address
    ws.send(JSON.stringify({
        "item": "tableid",
        "value": newID + 1,
        "error": ""
    }))
}

//return menu Object
function returnMenuItems(ws, category){
    returnObj = MenuObject.categories[category];
    ws.send(JSON.stringify({
        "item": "menuitems",
        "value": returnObj,
        "error": ""
    }))
}