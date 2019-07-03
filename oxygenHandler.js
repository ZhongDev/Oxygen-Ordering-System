// import MenuObject
const fs = require('fs');
let rawdata = fs.readFileSync('./oxygenMenu.json');  
let MenuObject = JSON.parse(rawdata);  
console.log(MenuObject)

class customer {
    static get(req, res){
        res.render('pages/customer', MenuObject)
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:customer')
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