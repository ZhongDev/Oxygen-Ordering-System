// This script houses any javascript controlled animations.

// Displays the dimming overlay and #overlay-content
function showOverlay(){
    $('#overlay').css("display","block");
    $('#overlay-content').css("display","block");
    $('#overlay').css("opacity",0);
    $('#overlay-content').css("opacity",0);
    $('#overlay').fadeTo(400, 1)
    $('#overlay-content').fadeTo(200, 1)
}

// Displays the dimming overlay and #overlay-content for ordered items
function showOrderOverlay(){
    $('#overlay').css("display","block");
    $('#overlay-content-orders').css("display","block");
    $('#overlay').css("opacity",0);
    $('#overlay-content-orders').css("opacity",0);
    $('#overlay').fadeTo(400, 1)
    $('#overlay-content-orders').fadeTo(200, 1)
}

// Hides all overlays that are open.
function hideOverlay(){
    $('#overlay').fadeTo(400, 0, ()=>{
        setTimeout(function(){
            $('#overlay').css("display","none");
        },10)
    })
    $('#overlay-content').fadeTo(200, 0, ()=>{
        setTimeout(function(){
            $('#overlay-content').css("display","none");
        },10)
    })
    $('#overlay-content-orders').fadeTo(200, 0, ()=>{
        setTimeout(function(){
            $('#overlay-content-orders').css("display","none");
        },10)
    })
}

// Animates space for the quantity confirmation message
function orderConfirmation(){
    $("#item-infobox").removeClass("col-9")
    $("#item-infobox").fadeTo(300, 0)
    $("#item-infobox").animate({
        width: "0px",
        padding: "0px"
    }, 400, ()=>{$("#item-infobox").remove()})
    $("#order-count-wrapper").animate({
        height: "100%"
    }, 500)
    $("#order-increment-btn").removeClass("col-4")
    $("#order-increment-btn").fadeTo(300, 0)
    $("#order-increment-btn").animate({
        width: "0px"
    }, 500)
    $("#order-decrement-btn").removeClass("col-4")
    $("#order-decrement-btn").fadeTo(300, 0)
    $("#order-decrement-btn").animate({
        width: "0px"
    }, 500)
    $('#qty-txt').animate({
        height: "4rem",
        "line-height": "4rem",
        "font-size": "4rem"
    }, 600, ()=>{
        generateConfirmation()
    })
}

// Animates the order page differently to signify the order has been sent and not cancelled
function orderAcknowleadged(){
    $('#overlay').fadeTo(600, 0, ()=>{
        setTimeout(function(){
            $('#overlay').css("display","none");
        },10)
    })
    $('#overlay-content').animate({
        top: "-100vh"
    }, 500, ()=>{
        setTimeout(function(){
            $('#overlay-content').css("display","none");
            $('#overlay-content').animate({
                top: "0vh"
            }, 200)
        },10)
    })
}
