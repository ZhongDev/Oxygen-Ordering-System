class customer {
    static get(req, res){
        res.render('pages/customer', {})
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