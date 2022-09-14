/*
    {"type":"data","format":"JS"}
 */

(function(app){
    if(!app) return false;
    var config={
        name:'view',
    };
    var self={
        
    };

    var obj={
        "template":`<div>viewer of</div>`,     //includindg dom and css, will add to body container,
        "auto":function(input){
            
            console.log("Hello world");
        },
        "title":"",     //default page title
    };

    cNews.page(config.name,obj);
})(cNews);