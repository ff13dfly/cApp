/*
    {"type":"data","format":"JS"}
*/

(function(App){
    if(!App) return false;
    var config={
        name:'history',
        prefix:"hs_",
        cls:{
            entry:'hs_index',
        },
    };

    var self={
        history:function(params,data){
            console.log(params);
            console.log(data);

            var RPC=App.cache.getG("RPC");
            var sel=$("#"+config.cls.entry);
            var ha='<span page="view" data="{&quot;anchor&quot;:&quot;testMe&quot;,&quot;block&quot;:1942,&quot;owner&quot;:&quot;5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy&quot;}">anchor link</span>';
            sel.html('Ready to show history<br>'+ha);
            App.fresh();
        },
        //prepare the basic data when code loaded
        struct:function(){
            self.clsAutoset(config.prefix);
            //console.log(`Config:${JSON.stringify(config)}`);
        },
        clsAutoset:function(pre){
            var hash=App.tools.hash;
            for(var k in config.cls){
                if(!config.cls[k]) config.cls[k]=pre + hash();
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
            "name":config.name,
            "title":"Anchor history details",     //default page title
            "raw":null,
            "params":{},
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,ck){
                //console.log(`${config.name} event "before" param :${JSON.stringify(params)}`);
                
                ck && ck();
            },
            "loading":function(params,data){
                console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                test.auto();        //test data, need to remove
                self.history(params,data);
            },
            "after":function(params,ck){
                //console.log(`${config.name} event "after" param :${JSON.stringify(params)}`);
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);