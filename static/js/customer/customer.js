// global variables
var ws;
var tableid;
var categorietabs;
var intersectObj = {
    topintersect: -1,
    bottomintersect: -1
}
var currentArr = [];
var currentCategory = '';
var currentqty = 1;

// import jquery libraries
window.$ = window.jQuery = require('jquery');

// wait for document to be safe to modify
$(window).on('load', function() {
    //setup
    categorietabs = $("#category-selector").children();
    categorietabs[0].classList.add('selected');
    categorietabs[0].setAttribute("id", "firstcategory")
    categorietabs[categorietabs.length-1].setAttribute("id", "lastcategory")
    categorietabs[categorietabs.length-1].classList.add('noBottomMargin');
    updateScrollShadow()
    setupWebSockets()
})

function orderPopup(itemIndex){
    generateOrderPopup(itemIndex);
    showOverlay();
}

function showOverlay(){
    $('#overlay').addClass('show')
    $('#overlay-content').addClass('show')
}

function hideOverlay(){
    $('#overlay').removeClass('show')
    $('#overlay-content').removeClass('show')
}

function requestMenu(category){
    $('#menu-title-bar-text').text(category)
    currentCategory = category;
    ws.send(JSON.stringify({
        "request": "get",
        "item": "menuitems",
        "args": [category]
    }))
}

function orderIncrement(){
    currentqty += 1;
    if(currentqty > 10){
        currentqty = 10;
    }
    $('#qty-txt').text(currentqty)
}

function orderDecrement(){
    currentqty -= 1;
    if(currentqty <= 0){
        currentqty = 1;
    }
    $('#qty-txt').text(currentqty)
}

function renderMenu(categoryArr){
    console.log(categoryArr)
    currentArr = categoryArr;

    $("#menu-item-block").html("")
    categoryArr.forEach(function (item, index) {

        //recreate every node
        var itemwrapper = document.createElement('div')
        itemwrapper.setAttribute("class", "menu-item dropShadow")

        var image = document.createElement('img')
        image.setAttribute("class","menu-item-img")
        image.setAttribute("src","/menu-static/" + item.Img)
        
        var bottomrow = document.createElement('div')
        bottomrow.setAttribute("class", "row menu-item-bottom-row")

        var infobox = document.createElement('div')
        infobox.setAttribute("class", "menu-item-infobox col-9")

        var titlerow = document.createElement('div')
        titlerow.setAttribute("class", "row noSideMargin")
        var title = document.createElement('span')
        title.setAttribute("class", "menu-item-name")
        var titletext = document.createTextNode(item.Name);

        var pricerow = document.createElement('div')
        pricerow.setAttribute("class", "row noSideMargin")
        var price = document.createElement('span')
        price.setAttribute("class", "menu-item-price")
        var pricetext = document.createTextNode("$" + (item.Price/100).toFixed(2));

        var addbutton = document.createElement('div')
        addbutton.setAttribute("class", "add-button col-3 noSidePadding")
        addbutton.setAttribute("onclick", "orderPopup(" + index + ")")

        var addbuttonsvg = document.createElement('img')
        addbuttonsvg.setAttribute("class", "add-button-icon")
        addbuttonsvg.setAttribute("src", "/static/image/add-to-order.svg")

        //append each node in heirachial order
        price.append(pricetext)
        pricerow.append(price)
        title.append(titletext)
        titlerow.append(title)

        infobox.append(titlerow)
        infobox.append(pricerow)
        addbutton.append(addbuttonsvg)
        
        bottomrow.append(infobox)
        bottomrow.append(addbutton)

        itemwrapper.append(image)
        itemwrapper.append(bottomrow)
        

        $("#menu-item-block").append(itemwrapper)
    });
}

// connect to server via WebSockets
function setupWebSockets(){
    var porttext;
    if (port != 80) {porttext = ":"+port} else {porttext = ""}
    ws = new WebSocket('ws://' + window.location.hostname + porttext);
    ws.onopen = function () {
        requestMenu(categorietabs[0].attributes.value.value)
        ws.send(JSON.stringify({
            "request": "get",
            "item": "tableid"
        }))
    }
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
            default:
                console.log(receivedObj)
        }
    };
}

// call when scrolled to update top and bottom shadows of #category-selector
function updateScrollShadow(){
    //get relavant coordinate values
    var firstelementtop = $("#firstcategory").position().top;
    var lastelementbottom = $("#lastcategory").position().top + $("#lastcategory").outerHeight();
    var topshadowelementbottom = $("#top-shadow-ele").position().top + $("#top-shadow-ele").outerHeight();
    var bottomshadowelementtop = $("#bottom-shadow-ele").position().top;
    
    //check for intersect   
    var topintersect = firstelementtop - topshadowelementbottom + 17 < 0
    var bottomintersect = bottomshadowelementtop - lastelementbottom + 1 < 0

    //check for change in shadows
    var topadd, toprem, bottomadd, bottomrem //classes to add/remove
    if(intersectObj.topintersect == -1 || intersectObj.bottomintersect == -1){ //Do not compare first run
        
        if(topintersect){
            topadd = "show"
        }else{
            topadd = ""
        }
        toprem = ""

        if(bottomintersect){
            bottomadd = "show"
        }else{
            bottomadd = ""
        }
        bottomrem = ""

    }else{

        //compare for changes(top)
        if(topintersect != intersectObj.topintersect){
            if(topintersect){
                topadd = "show"
                toprem = ""
            }else{
                topadd = ""
                toprem = "show"
            }
        }

        //compare for changes (bottom)
        if(bottomintersect != intersectObj.bottomintersect){
            if(bottomintersect){
                bottomadd = "show"
                bottomrem = ""
            }else{
                bottomadd = ""
                bottomrem = "show"
            }
        }

    }

    var classesObj = {
        top: {
            add: topadd,
            remove: toprem
        },
        bottom: {
            add: bottomadd,
            remove: bottomrem
        }
    }

    //update opacity values of shadows
    $("#top-shadow-ele").addClass(classesObj.top.add)
    $("#top-shadow-ele").removeClass(classesObj.top.remove)
    $("#bottom-shadow-ele").addClass(classesObj.bottom.add)
    $("#bottom-shadow-ele").removeClass(classesObj.bottom.remove)

    //save current state
    intersectObj.topintersect = topintersect
    intersectObj.bottomintersect = bottomintersect
}

function generateOrderPopup(itemIndex){
    $('#overlay-content').html('')
    let item = currentArr[itemIndex]
    currentqty = 1;

    //recreate every node
    var itemwrapper = document.createElement('div')
    itemwrapper.setAttribute("class", "order-menu dropShadow")

    var image = document.createElement('img')
    image.setAttribute("class","order-item-img")
    image.setAttribute("src","/menu-static/" + item.Img)

    var bottomrow = document.createElement('div')
    bottomrow.setAttribute("class", "row order-item-bottom-row")

    var infobox = document.createElement('div')
    infobox.setAttribute("class", "order-item-infobox col-9")

    var titlerow = document.createElement('div')
    titlerow.setAttribute("class", "row noSideMargin")
    var title = document.createElement('span')
    title.setAttribute("class", "order-item-name")
    var titletext = document.createTextNode(item.Name);

    var pricerow = document.createElement('div')
    pricerow.setAttribute("class", "row noSideMargin")
    var price = document.createElement('span')
    price.setAttribute("class", "order-item-price")
    var pricetext = document.createTextNode("$" + (item.Price/100).toFixed(2) + "/ea");

    var descrow = document.createElement('div')
    descrow.setAttribute("class", "row noSideMargin")
    var desc = document.createElement('span')
    desc.setAttribute("class", "order-item-description")
    var desctext = document.createTextNode(item.Description);

    var orderside = document.createElement('div')
    orderside.setAttribute("class", "col-3 noSidePadding order-side")

    var ordercountwrapper = document.createElement('div')
    ordercountwrapper.setAttribute("class", "order-count-wrapper col-12 noSidePadding")

    var orderdecrementbtn = document.createElement('div')
    orderdecrementbtn.setAttribute("class", "order-increment-btn col-4 noSidePadding fillHeight")
    orderdecrementbtn.setAttribute("onclick", "orderDecrement()")

    var orderdecrementbtnicon = document.createElement('img')
    orderdecrementbtnicon.setAttribute("class", "add-button-icon-order")
    orderdecrementbtnicon.setAttribute("src", "/static/image/remove-icon.svg")

    var orderincrementbtn = document.createElement('div')
    orderincrementbtn.setAttribute("class", "order-increment-btn col-4 noSidePadding fillHeight")
    orderincrementbtn.setAttribute("onclick", "orderIncrement()")

    var orderincrementbtnicon = document.createElement('img')
    orderincrementbtnicon.setAttribute("class", "add-button-icon-order")
    orderincrementbtnicon.setAttribute("src", "/static/image/add-icon.svg")

    var orderquantity = document.createElement('div')
    orderquantity.setAttribute("class", "col-4 noSidePadding fillHeight")
    orderquantity.setAttribute("id", "order-quantity")

    var spacer1 = document.createElement('div')
    spacer1.setAttribute("class", "row noSidePadding qty-label spacer")
    var spacer2 = document.createElement('div')
    spacer2.setAttribute("class", "row noSidePadding qty-label spacer")
    var spacer3 = document.createElement('div')
    spacer3.setAttribute("class", "row noSidePadding qty-label spacer")

    var qtylabel = document.createElement('div')
    qtylabel.setAttribute("class", "row noSidePadding qty-label")
    var qtylabeltxt = document.createTextNode('Quantity:');

    var qty = document.createElement('div')
    qty.setAttribute("class", "row noSidePadding noSideMargin qty")
    var qtyspan = document.createElement('span')
    qtyspan.setAttribute("id", "qty-txt")
    var qtyspantxt = document.createTextNode('1');

    var confirmwrap = document.createElement('div')
    confirmwrap.setAttribute("class", "row noSideMargin fillHeight")

    var addbtnorder = document.createElement('div')
    addbtnorder.setAttribute("class", "add-button-order col-8 noSidePadding")
    addbtnorder.setAttribute("onclick", "orderConfirmation()")

    var addbtnordericon = document.createElement('img')
    addbtnordericon.setAttribute("class", "add-button-icon")
    addbtnordericon.setAttribute("src", "/static/image/add-to-order.svg")

    var cancelorder = document.createElement('div')
    cancelorder.setAttribute("class", "add-button-order red col-4 noSidePadding")
    cancelorder.setAttribute("onclick", "hideOverlay()")

    var cancelordericon = document.createElement('img')
    cancelordericon.setAttribute("class", "add-button-icon")
    cancelordericon.setAttribute("src", "/static/image/close.svg")
    

    //append each node in heirachial order
    qtyspan.append(qtyspantxt)

    qtylabel.append(qtylabeltxt)
    qty.append(qtyspan)

    price.append(pricetext)
    pricerow.append(price)
    title.append(titletext)
    titlerow.append(title)
    desc.append(desctext)
    descrow.append(desc)
    orderdecrementbtn.append(orderdecrementbtnicon)
    orderincrementbtn.append(orderincrementbtnicon)
    orderquantity.append(spacer1)
    orderquantity.append(qtylabel)
    orderquantity.append(qty)
    orderquantity.append(spacer2)
    orderquantity.append(spacer3)
    addbtnorder.append(addbtnordericon)
    cancelorder.append(cancelordericon)

    infobox.append(titlerow)
    infobox.append(pricerow)
    infobox.append(descrow)
    ordercountwrapper.append(orderdecrementbtn)
    ordercountwrapper.append(orderquantity)
    ordercountwrapper.append(orderincrementbtn)
    confirmwrap.append(cancelorder)
    confirmwrap.append(addbtnorder)

    orderside.append(ordercountwrapper)
    orderside.append(confirmwrap)

    bottomrow.append(infobox)
    bottomrow.append(orderside)

    itemwrapper.append(image)
    itemwrapper.append(bottomrow)

    $('#overlay-content').append(itemwrapper)
}