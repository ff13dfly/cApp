/*
    {"type":"data","format":"JS"}
 */

(function(App){
    if(!App) return false;
    var config={
        name:'view',
        prefix:"cv_",
        cls:{
            entry:'cv_index',
            row:'',
            anchor:'',
        },
    };
    var cache=null;

    var self={
        struct:function(){
            self.clsAutoset(config.prefix);
            console.log(`Config:${JSON.stringify(config)}`);
        },
        clsAutoset:function(pre){
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre+hash();
            }
            return true;
        },
    };

    var test={
        auto:function(){

        },
    };

    var page={
        "data":{
            "title":"cMedia App",     //default page title
            "raw":null,
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
            "input":{page:0},
        },      
        "events":{
            "before":function(ck){
                console.log('Before page loading...'+JSON.stringify(cache));
                var dt={view:"world"};
                ck && ck(dt);
            },
            "loading":function(input,data){
                console.log('Page loading...'+JSON.stringify(data));
                cache=data;
                test.auto();        //test data, need to remove
                console.log('ready to show page');
                $("#"+config.cls.entry).html("ready to render content....");
            },
            "after":function(ck){
                console.log('after page destoried...');
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);