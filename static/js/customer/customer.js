// global variables
var categorietabs;
var intersectObj = {
    topintersect : -1,
    bottomintersect: -1
}

// import jquery libraries
window.$ = window.jQuery = require('jquery');

// wait for document to be safe to modify
$(window).on('load', function() {
    categorietabs = $("#category-selector").children();
    categorietabs[0].classList.add('selected');
    categorietabs[0].setAttribute("id", "firstcategory")
    categorietabs[categorietabs.length-1].setAttribute("id", "lastcategory")
    updateScrollShadow()
})

function updateScrollShadow(){
    //get relavant coordinate values
    var firstelementtop = $("#firstcategory").position().top;
    var lastelementbottom = $("#lastcategory").position().top + $("#lastcategory").outerHeight();
    var topshadowelementbottom = $("#top-shadow-ele").position().top + $("#top-shadow-ele").outerHeight();
    var bottomshadowelementtop = $("#bottom-shadow-ele").position().top;
    
    //check for intersect   
    var topintersect = firstelementtop - topshadowelementbottom + 17 < 0
    var bottomintersect = bottomshadowelementtop - lastelementbottom < 0

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