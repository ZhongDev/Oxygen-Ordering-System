// This script houses all large element generation; popups, menus etc.
// All functions follow the structure of (Node Recreation) => (Node Tree Reconstuction) => (Append to relavent receptor element)

// Generates Pop Up for new Order Request (i.e. quantity selection screen)
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
    bottomrow.setAttribute("id", "order-item-bottom-row")

    var infobox = document.createElement('div')
    infobox.setAttribute("class", "order-item-infobox col-9")
    infobox.setAttribute("id", "item-infobox")

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
    ordercountwrapper.setAttribute("id", "order-count-wrapper")

    var orderdecrementbtn = document.createElement('div')
    orderdecrementbtn.setAttribute("class", "order-increment-btn col-4 noSidePadding fillHeight")
    orderdecrementbtn.setAttribute("id", "order-decrement-btn")
    orderdecrementbtn.setAttribute("onclick", "orderDecrement()")

    var orderdecrementbtnicon = document.createElement('img')
    orderdecrementbtnicon.setAttribute("class", "add-button-icon-order")
    orderdecrementbtnicon.setAttribute("src", "/static/image/remove-icon.svg")

    var orderincrementbtn = document.createElement('div')
    orderincrementbtn.setAttribute("class", "order-increment-btn col-4 noSidePadding fillHeight")
    orderincrementbtn.setAttribute("id", "order-increment-btn")
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


// Generates the confirmation prompt after a Quantity has been selected.
function generateConfirmation(){
    //recreate every node
    var confirmationinfobox = document.createElement('div')
    confirmationinfobox.setAttribute("class", "order-item-infobox col-8 noLeftPadding")
    confirmationinfobox.setAttribute("id", "confirmation-infobox")

    var toprow = document.createElement('div')
    toprow.setAttribute("class", "row noSideMargin center-content")
    var topspan = document.createElement('span')
    topspan.setAttribute("class", "order-item-confirm")
    var toptext = document.createTextNode('Please confirm quantity.');

    var bottomrow = document.createElement('div')
    bottomrow.setAttribute("class", "row noSideMargin center-content confirm-container")

    var cancelbtn = document.createElement('div')
    cancelbtn.setAttribute("class", "confirm-button red center-content dropShadow")
    cancelbtn.setAttribute("onclick", "hideOverlay()")
    var cancelicon = document.createElement('img')
    cancelicon.setAttribute("class", "confirm-button-icon")
    cancelicon.setAttribute("src", "/static/image/close.svg")

    var confirmbtn = document.createElement('div')
    confirmbtn.setAttribute("class", "confirm-button green center-content dropShadow")
    confirmbtn.setAttribute("onclick", "confirmQty()")
    var confirmicon = document.createElement('img')
    confirmicon.setAttribute("class", "confirm-button-icon")
    confirmicon.setAttribute("src", "/static/image/check.svg")

    //append each node in heirachial order
    topspan.append(toptext)
    toprow.append(topspan)

    confirmbtn.append(confirmicon)
    cancelbtn.append(cancelicon)
    bottomrow.append(cancelbtn)
    bottomrow.append(confirmbtn)

    confirmationinfobox.append(toprow)
    confirmationinfobox.append(bottomrow)

    $("#order-item-bottom-row").append(confirmationinfobox)
    $("#confirmation-infobox").fadeTo(300, 1)
}

// Generates items on the main area when a catergory is selected on the left
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

// Generates the Ordered table rows one by one in pure text rather than node reconstuction.
// This approach is favoured as it is much more repetable than the other code areas, and does not require full node loading
function showBill(billArr){
    console.log(billArr)
    var ordertext = '<tr>\n<th class="tg-0lax">Order #</th>\n<th class="tg-0lax">Item</th>\n<th class="tg-0lax">Cost/ea</th>\n<th class="tg-0lax">Quantity</th>\n<th class="tg-0lax">Total</th>\n</tr>'
    var totalcost = 0;
    billArr.forEach(function (item, index) {
        totalcost += item.item.Price*item.qty
        ordertext += '\n<tr>\n<td class="tg-baqh">' + (index + 1) + '</td>\n<td class="tg-baqh">' + item.item.Name + '</td>\n<td class="tg-baqh">$' + (item.item.Price/100).toFixed(2) + '</td>\n<td class="tg-baqh">' + item.qty + '</td>\n<td class="tg-baqh">$' + (item.item.Price*item.qty/100).toFixed(2) + '</td>\n</tr>';
    })
    $("#order-table").html(ordertext)
    $("#order-table-total-text").text('Total: $' + (totalcost/100).toFixed(2))
    showOrderOverlay()
}