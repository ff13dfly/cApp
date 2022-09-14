;(function(App){
    if(!App) return false;
    var config={
        name:"index",
    };
    var self={
        listening:function(input){
            var info=App.info();
            $("#cMedia_index").html("This is a cApp, fullscreen function.");

            input.RPC.common.subscribe(function(list){
                
                if(list.length ==0) return false;
                for(var i=0;i<list.length;i++){
                    var row=list[i];
                    if(row.protocol && row.protocol.type==="data" && row.protocol.app===info.app){
                        console.log(row);
                    }
                }
            });
        },
    };

    var page={
        "data":{
            "title":"cMedia App",     //default page title
            "cache":null,
            "template":'<div id="cMedia_index">list of page</div>',     //includindg dom and css, will add to body container,
            "input":{page:0},
        },      
        "events":{
            "before":function(ck){
                console.log('before page loading...');
                ck && ck();
            },
            "loading":self.listening,
            "after":function(ck){
                console.log('after page destoried...');
                ck && ck();
            },
        },
    };

    App.page(config.name,page);
})(cMedia);