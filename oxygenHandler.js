class customer {
    static get(req, res){
        res.send('customer')
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:customer')
        })
    }
}

class kitchen {
    static get(req, res){
        res.send('kitchen')
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:kitchen')
        })
    }
}

class pos {
    static get(req, res){
        res.send('pos')
    }
    static ws(ws, req){
        ws.on('message', function (msg){
            ws.send('ws:pos')
        })
    }
}

module.exports = {customer, kitchen, pos}