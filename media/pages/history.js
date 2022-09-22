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
            account:'',
            info:'',
        },
    };

    var self={
        show:function(params,data){
            var anchor=params.anchor;
            var RPC=App.cache.getG("RPC");
            var cls=config.cls;
            
            var cmap = `<style>
                .${cls.account}{font-size:10px;color:#EF2356;}
                .${cls.info}{font-size:10px;}
            </style>`;
            $("#" + cls.entry).html(cmap);

            if(RPC.common.history){
                RPC.common.history(anchor,(list)=>{
                    console.log(list);
                    var dom='';
                    for(var i=0;i<list.length;i++){
                        dom+=self.decode(list[i]);
                    }
                    $("#"+cls.entry).append(dom);
                    App.fresh();
                });
            }
        },
        decode:function(row){
            var cls=config.cls;
            return `<div class="row">
                <div class="col-3 pt-2 ${cls.info}" >Block : ${row.block}</div>    
                <div class="col-9 pt-2 ${cls.account}">${App.tools.shorten(row.owner,12)}</div>
                <div class="col-12"><hr/></div>
            </div>`;
        },
        //prepare the basic data when code loaded
        struct: function () {
            self.clsAutoset(config.prefix);         
        },
        clsAutoset: function (pre) {
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
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
            "title":"History details",     //default page title
            "raw":null,
            "params":{},
            "preload":"Loading...",
            "snap":"",
            "template":`<div id="${config.cls.entry}"></div>`,     //includindg dom and css, will add to body container,
        },      
        "events":{
            "before":function(params,data,ck){
                ck && ck();
            },
            "loading":function(params,data){
                console.log(`${config.name} event "loading" param :${JSON.stringify(params)}`);
                test.auto();        //test data, need to remove
                self.show(params,data);
            },
            "after":function(params,data,ck){
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name,page);
})(cMedia);