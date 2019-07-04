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
var currentindex = 1;
var firstcategory, lastcategory;

// import jquery libraries
window.$ = window.jQuery = require('jquery');

// wait for document to be fully loaded and safe to modify
$(window).on('load', function() {
    //setup
    categorietabs = $("#category-selector").children();
    categorietabs[0].classList.add('selected');
    firstcategory = categorietabs[0].attributes.id.value;
    lastcategory = categorietabs[categorietabs.length-1].attributes.id.value;
    categorietabs[categorietabs.length-1].classList.add('noBottomMargin');
    updateScrollShadow()
    setupWebSockets()
})

// ingest function for generating an order popup
function orderPopup(itemIndex){
    currentindex = itemIndex
    generateOrderPopup(itemIndex);
    showOverlay();
}

// ingest function for loading new items from a different catergory
function requestMenu(category){
    $('.menu-category.selected')[0].classList.remove('selected')
    setTimeout(function(){
        console.log('#' + category.split(" ").join("-"))
        $('#' + category.split(" ").join("-")).addClass('selected')
        checkintersection()
    },100)
    $('#menu-title-bar-text').text(category)
    currentCategory = category;
    ws.send(JSON.stringify({
        "request": "get",
        "item": "menuitems",
        "args": [category]
    }))
}

// ingest function for loading the Ordered items
function getOrders(){
    ws.send(JSON.stringify({
        "request": "get",
        "item": "bill",
        "args": [tableid]
    }))
}

// increase and decrese quantity count respectively on the order page.
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

// function to send out the order request after quantity has been confirmed.
function confirmQty(){
    ws.send(
        JSON.stringify({
            "request": "order",
            "tableid": tableid,
            "category": currentCategory,
            "index": currentindex,
            "qty": currentqty
        })
    )
}


// connect to server via WebSockets
function setupWebSockets(){
    // dynamically generate url port extention if port is configured to not :80
    var porttext;
    if (port != 80) {porttext = ":"+port} else {porttext = ""}

    // connect to backend
    ws = new WebSocket('ws://' + window.location.hostname + porttext);

    // when connected, request a table identifier
    ws.onopen = function () {
        requestMenu(categorietabs[0].attributes.value.value)
        ws.send(JSON.stringify({
            "request": "get",
            "item": "tableid"
        }))
    }

    // forward server responses to relevent functions
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
            case "bill":
                showBill(receivedObj.value);
            break
            default:
                console.log(receivedObj)
        }
    };
}

// call when scrolled to update top and bottom shadows of #category-selector
function updateScrollShadow(){
    //get relavant coordinate values
    var firstelementtop = $("#" + firstcategory).position().top;
    var lastelementbottom = $("#" + lastcategory).position().top + $("#" + lastcategory).outerHeight();
    var topshadowelementbottom = $("#top-shadow-ele").position().top + $("#top-shadow-ele").outerHeight();
    var bottomshadowelementtop = $("#bottom-shadow-ele").position().top;
    
    //check for intersect   
    var topintersect = firstelementtop - topshadowelementbottom + 17 < 0
    var bottomintersect = bottomshadowelementtop - lastelementbottom + 1 < 0

    //check for change in shadows
    var topadd, toprem, bottomadd, bottomrem //classes to add/remove

     //Do not compare first run
    if(intersectObj.topintersect == -1 || intersectObj.bottomintersect == -1){
        //check if top is intersecting
        if(topintersect){
            topadd = "show"
        }else{
            topadd = ""
        }
        toprem = ""
        //check if bottom is intersecting
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

    //Object for classes to add and remove. Allows the code flow seperation from before to join.
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

    //save current state for future comparison
    intersectObj.topintersect = topintersect
    intersectObj.bottomintersect = bottomintersect
}

// checks if category tab is off screen and scrolls to make sure it is on screen
function checkintersection(){
    var y = $('#category-selector').scrollTop();  //your current y position on selector element
    var selectedrect = $('.menu-category.selected')[0].getBoundingClientRect();
    var topshadowrect = document.getElementById("top-shadow-ele").getBoundingClientRect();
    var bottomshadowrect = document.getElementById("bottom-shadow-ele").getBoundingClientRect();

    if (selectedrect.top < topshadowrect.bottom){
        let offset = y - (topshadowrect.bottom - selectedrect.top);
        $('#category-selector').animate({ scrollTop: offset }, 400);
    }
    if (selectedrect.bottom > bottomshadowrect.top){
        let offset = y - (bottomshadowrect.top - selectedrect.bottom);
        $('#category-selector').animate({ scrollTop: offset }, 400);
    }
}
